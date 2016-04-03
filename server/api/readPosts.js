import path from 'path';
import fs from 'fs';

import MarkdownRenderer from '../util/MarkdownRenderer';

function listFiles(dir) {
  return new Promise((resolve, reject) => {
    console.log('Reading files from ' + dir);

    fs.readdir(dir, (err, files) => {
      if (err) {
        return reject(err);
      }

      return resolve(files.map(file => `${dir}${path.sep}${file}`));
    });
  });
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, content) => {
      if (err) {
        return reject(err);
      }

      return resolve(content);
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

export default function readPosts(dir) {
  return Promise.resolve(dir)
    .then(listFiles)
    .then(readFiles)
    .then(convertToPosts)
    .then(orderPostsByDate)
    .catch(console.error);
}