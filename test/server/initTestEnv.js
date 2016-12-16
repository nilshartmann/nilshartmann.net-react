import fs from 'fs';
import path from 'path';

import tmp from 'tmp';
import wrench from 'wrench';
import rimraf from 'rimraf';

import NodeGit from 'nodegit';

function cpr(src, dest) {
  const options = {
    forceDelete: true,
    preserveTimestamps: true
  }

  return new Promise((resolve, reject) => {
    wrench.copyDirSyncRecursive(src, dest, options);
    resolve(dest);
  });
}

export default function initTestEnv() {
  const basedir = tmp.dirSync({prefix: 'simpleblog_test_' }).name;
  console.log('Base dir', basedir);

  function initGitRepositoryFrom(dir) {

    return cpr(dir, basedir)
      .then(dest => NodeGit.Repository.init(dest, 0))
      .then(repo => {
        return repo.refreshIndex().then(index => {
          return index.addAll()
            .then(() => index.write())
            .then(() => index.writeTree());
        }).then(oid => {
          const author = NodeGit.Signature.now(
            "Nils Hartmann",
            "nils@nilshartmann.net"
            );
          return repo.createCommit("HEAD", author, author, "Initial Commit", oid)
            .then(() => repo.workdir())
        });
      });
  }

  function readJson(relPath) {
    const absPath = path.join(basedir, relPath);
    const content = fs.readFileSync(absPath);
    return JSON.parse(content);
  }

  function hasFile(relPath) {
    const absPath = path.join(basedir, relPath);
    fs.accessSync(absPath);
    return fs.statSync(absPath).isFile();
  }

  function isRepoClean() {
    return NodeGit.Repository.open(basedir)
      .then(repo => repo.getStatus())
      .then(statuses => { console.log(statuses); return statuses; })
      .then(statuses => statuses.length === 0);
  }

  function dispose() {
    if (basedir && fs.statSync(basedir).isDirectory()) {
      console.log('Remove base dir ', basedir);
      rimraf.sync(basedir);
    }
  }

  return {
    initGitRepositoryFrom,
    hasFile,
    readJson,
    isRepoClean,
    dispose
  };
}
