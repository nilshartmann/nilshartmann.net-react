import fs from 'fs';
import sanitize from 'sanitize-filename';

import readPosts from './readPosts';

export default class Blog {
  constructor(postDir, uploadDir) {
    this.postDir = postDir;
    this.uploadDir = uploadDir;
    console.log('uploadDir: ' + uploadDir);
  }

  queryPosts(options = {}) {
    return readPosts(this.postDir)
      .then(posts => posts.filter(post => !options.filter || post.tags.find((t) => t === options.filter.tag)))
      .then(posts => options.limit ? posts.slice(0, options.limit) : posts);
  }

  getPost(slug) {
    return readPosts(this.postDir)
      .then(posts => {
        const thisPost = posts.findIndex((post) => slug === post.slug);
        if (thisPost === -1) {
          // not found
          return null;
        }

        const copy = Object.assign({}, posts[thisPost], {
          prev: thisPost > 0 ? posts[thisPost - 1] : undefined,
          next: thisPost < posts.length - 1 ? posts[thisPost + 1] : undefined
        });
        
        return copy;
      });
  }

  getTags(withCount) {
    return readPosts(this.postDir).then(posts => {
      const result = {
        tags: []
      };
      if (withCount) {
        result.min = Number.MAX_VALUE;
        result.max = Number.MIN_VALUE;
      }
      const tagMap = {};

      posts.forEach(post => {
        post.tags.forEach(tag => {
          if (!withCount) {
            if (result.tags.indexOf(tag) === -1) {
              result.tags.push(tag);
            }
          } else {
            if (!tagMap[tag]) {
              const t = {count: 1, tag: tag};
              tagMap[tag] = t;
              result.tags.push(t);
            } else {
              tagMap[tag].count = tagMap[tag].count + 1;
            }
            result.min = Math.min(result.min, tagMap[tag].count);
            result.max = Math.max(result.max, tagMap[tag].count);
          }
        });
      });

      // sort by name
      result.tags.sort((a, b) => {
        if (a.tag > b.tag) {
          return 1;
        }
        if (a.tag < b.tag) {
          return -1;
        }
        return 0;
      });

      return result;
    });
  }

  upload(payload, fileName, formFile) {
    const name = sanitize(fileName);
    const path = `${this.uploadDir}/${Date.now()}_${name}`;
    console.log(`Uploading to ${path}`);

    const file = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      file.on('error', reject);

      formFile.pipe(file);
      formFile.on('end', () => resolve(path));
    });
  }
}
