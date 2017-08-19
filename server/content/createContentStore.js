import path from "path";
import fs from "fs";

import MarkdownRenderer from "../util/MarkdownRenderer";

import NodeGit from "nodegit";

import sanitize from "sanitize-filename";

const PUBLIC_FOLDER = "public";
const DRAFTS_FOLDER = "drafts";
const UPLOADS_FOLDER = "uploads";

function listJsonFiles(dir) {
  return new Promise((resolve, reject) => {
    console.log("Reading files from " + dir);

    fs.readdir(dir, (err, files) => {
      if (err) {
        return reject(err);
      }

      return resolve(files.filter(file => file.endsWith(".json")).map(file => `${dir}${path.sep}${file}`));
    });
  });
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, content) => {
      if (err) {
        return reject(err);
      }

      return resolve(content);
    });
  });
}

function writeFile(absDir, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(absDir, JSON.stringify(content, null, 2), err => {
      if (err) {
        return reject(err);
      }
      resolve(absDir);
    });
  });
}

function readFiles(files) {
  return Promise.all(files.map(file => readFile(file)));
}

function convertToPosts(contents) {
  return contents.map(content => {
    const post = JSON.parse(content);
    post._summaryHtml = MarkdownRenderer.render(post.summary);
    post._contentHtml = MarkdownRenderer.render(post.content);
    const date = new Date(post.publish_time);
    post._date = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

    return post;
  });
}

function orderPostsByDate(posts) {
  const orderedPosts = [...posts];
  return orderedPosts.sort((a, b) => new Date(b.publish_time) - new Date(a.publish_time));
}

function ensureExistingDirectory(dir) {
  if (typeof dir !== "string") {
    throw new Error('Parameter "dir" must be a string');
  }

  const stats = fs.statSync(dir);
  if (!stats.isDirectory()) {
    throw new Error(`Path '${dir}' must point to an existing directory`);
  }
}

/**
 * Create a Content Store
 *
 * This implementation works on a Filesystem with Git. Maybe replaced by a real database later
 * but for my requirements now (having only a very few blog posts, only a single user that has
 * write access, ...) it's enough.
 *
 * Model restrictions
 * Each post must have a `slug` property. This property is identical to the file name, the post is stored in.
 * The `slug` must not be changed. Renaming slug/posts is currently not supported.
 *
 * Folder structure of the Store:
 *  `public` contains published posts visible to all users (flat dir, i.e. no subdirs)
 *  `drafts` contains new and work-in-progress-posts (flat dir, i.e. no subdirs)
 *
 * Reading:
 * `readAllPosts` expect one the two directories and returns all posts in that directory. Each returned object
 * contains HTML markup for Markdown-Fields and a human readable date. The post is ready to be rendered on client side.
 * TODO: caching
 *
 * Storing (to drafts folder):
 * A post can be stored in the drafts folder using the `storeDraft` function. This function takes the content of the
 * post and stores it inside the draft folder. The name of the file is derived from the `slug` property that must
 * be part of the object. The change is immediatly committed to git. A Post saved with `storeDraft` gets its
 * `published` property set to false.
 *
 * Publishing
 * A post can be published by copying it from draft to public folder. This is done using the 'publishPost' method.
 * The method expects the posts slug. That file will be copied from `public/SLUG.json` to `drafts/SLUG.json`. Then
 * the change will be committed to Git.
 *
 * The `published` property
 * * **All** posts inside the `public` folder have their `published` property to `true`. It's set, when a post
 * is published with `publishPost`
 *  A *new* or *modified* post inside the `drafts` folder have their published property to `false`. That is done
 *  in the `storeDraft` method.
 *
 *  This way **all published posts** have set their `published` property to `true`. Drafts have set it to `true`
 *  as long as their are no changes to the post after its last publishing. Draft posts have set it instead to `false`
 *  between calls to `storeDraft` and `publishPost`
 *
 * @param dir base directory where posts are stored.
 * @returns {{readPosts: readPosts}}
 */
function createContentStore(dir) {
  ensureExistingDirectory(dir);

  function readPosts() {
    return Promise.resolve(dir).then(listJsonFiles).then(readFiles).then(convertToPosts).then(orderPostsByDate).catch(err => {
      console.error(err);
      return null;
    });
  }

  return {
    readPosts
  };
}

export function createPublicContentStore(dir) {
  ensureExistingDirectory(dir);

  return createContentStore(path.join(dir, PUBLIC_FOLDER));
}

export function createWritableContentStore(dir) {
  const draftsDir = path.join(dir, DRAFTS_FOLDER);
  const publicDir = path.join(dir, PUBLIC_FOLDER);
  const uploadsDir = path.join(dir, UPLOADS_FOLDER);
  const listener = [];

  ensureExistingDirectory(publicDir);
  ensureExistingDirectory(uploadsDir);
  ensureExistingDirectory(path.join(dir, ".git"));

  function notifyListener() {
    listener.forEach(listener => listener());
  }

  function onChange(cb) {
    listener.push(cb);
  }

  function commit(fileOrFiles, commitMsg) {
    console.log("COMMITTE: ", fileOrFiles);
    const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    return NodeGit.Repository.open(dir).then(repo => {
      let index;
      return repo
        .refreshIndex()
        .then(indexResult => {
          index = indexResult;
          const addPromises = files.map(file => {
            const f = file.replace("\\", "/");
            return index.addByPath(f).then(addRes => {
              if (addRes) {
                throw new Error(`Failed to commit '${file}': ${addRes}`);
              } else return addRes;
            });
          });
          return Promise.all(addPromises).then(() => index.write()).then(() => index.writeTree());
        })
        .then(oid => {
          return NodeGit.Reference.nameToId(repo, "HEAD").then(head => repo.getCommit(head)).then(parent => {
            const author = NodeGit.Signature.now("Nils Hartmann", "nils@nilshartmann.net");

            return repo
              .createCommit("HEAD", author, author, `${commitMsg} ${files.join()}`, oid, [parent])
              .then(() => fileOrFiles);
          });
        });
    });
  }

  function storeDraft(post) {
    if (!post.slug) {
      throw new Error("Missing slug property");
    }
    const draftPost = {};
    Object.keys(post).forEach(key => {
      if (!key.startsWith("_")) {
        draftPost[key] = post[key];
      }
    });
    draftPost.published = false;

    const relPath = path.join(DRAFTS_FOLDER, `${post.slug}.json`);
    const postPath = path.join(dir, relPath);

    return writeFile(postPath, draftPost).then(() => commit(relPath, "Store Draft")).then(() => draftPost);
  }

  function publishPost(slug) {
    if (!slug) {
      throw new Error('Parameter "slug" must be set');
    }
    const fileName = `${slug}.json`;
    const draftPostPath = path.join(DRAFTS_FOLDER, fileName);
    const relPaths = [draftPostPath, path.join(PUBLIC_FOLDER, fileName)];

    const postPath = path.join(dir, draftPostPath);
    return readFile(postPath)
      .then(content => JSON.parse(content))
      .then(post => Object.assign({}, post, { published: true }))
      .then(publishedPost => {
        return Promise.all([
          writeFile(postPath, publishedPost),
          writeFile(path.join(dir, PUBLIC_FOLDER, fileName), publishedPost)
        ]);
      })
      .then(() => commit(relPaths, "Publish Post"))
      .then(commitResult => {
        notifyListener();
        return commitResult;
      });
  }

  function storeUpload(payload, fileName, formFile) {
    const name = sanitize(fileName);
    const relPath = path.join(UPLOADS_FOLDER, `${Date.now()}_${name}`);
    console.log(`Uploading to ${relPath}`);
    const uploadPath = path.join(dir, relPath);

    const file = fs.createWriteStream(uploadPath);

    return new Promise((resolve, reject) => {
      file.on("error", reject);

      formFile.pipe(file);
      formFile.on("end", () => resolve(path));
    }).then(() => commit(relPath, "Store Upload"));
  }

  function listUploadedFiles() {
    return new Promise((resolve, reject) => {
      console.log("Reading files from " + dir);

      fs.readdir(uploadsDir, (err, files) => {
        if (err) {
          return reject(err);
        }

        return resolve(files);
      });
    })
      .then(files =>
        files.map(file => ({
          mtime: fs.statSync(path.join(uploadsDir, file)).mtime,
          file: path.join(UPLOADS_FOLDER, file)
        }))
      )
      .then(files => files.sort((a, b) => b.mtime.getTime() - a.mtime.getTime()))
      .then(orderedFiles => orderedFiles.map(file => ({ file: file.file })));
  }

  function unpublish(slug) {
    // remove from public
    // in draft set to unpublished
  }

  return Object.assign({}, createContentStore(draftsDir), {
    onChange,
    storeDraft,
    publishPost,
    storeUpload,
    listUploadedFiles
  });
}

export function createConfiguredStores(baseDir) {
  const publicContentStore = createPublicContentStore(baseDir);

  const cachedPublicContentStore = {
    clearCache() {
      delete cachedPublicContentStore.cachedPosts;
    },

    readPosts() {
      if (cachedPublicContentStore.cachedPosts) {
        console.log("return from cache");
        return Promise.resolve(cachedPublicContentStore.cachedPosts);
      }
      return publicContentStore.readPosts().then(posts => {
        cachedPublicContentStore.cachedPosts = posts;
        return posts;
      });
    }
  };

  const writableContentStore = createWritableContentStore(baseDir);
  writableContentStore.onChange(() => cachedPublicContentStore.clearCache());

  return {
    publicContentStore: cachedPublicContentStore,
    writableContentStore
  };
}
