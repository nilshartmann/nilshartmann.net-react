import fs from 'fs';
import path from 'path';
import expect from 'unexpected';

import { createPublicContentStore, createWritableContentStore } from '../../server/content/createContentStore';

import initTestEnv from './initTestEnv';
import expectedDraftContent from './__test_content__/expected/draft-posts.json';
import expectedPublicContent from './__test_content__/expected/public-posts.json';
const TESTCONTENT_DIR = path.join(__dirname, '__test_content__');

describe('createContentStore', () => {

  describe('createPublicContentStore', () => {
    let contentStore;

    before(() => {
      contentStore = createPublicContentStore(TESTCONTENT_DIR);
    });


    it('works', () => {
      expect(contentStore, 'to be an', 'object');
      expect(contentStore.readPosts, 'to be a', 'function');
    });

    it('does not allow an invalid dir', () => {
      expect(() => { createPublicContentStore('xxxx') },
        'to throw', /no such file or directory/
        );
    })

    it('read all PUBLIC posts', () => {
      const p = contentStore.readPosts();
      //    p.then(posts => fs.writeFileSync('c:/SPU/tmp/ppp.json', JSON.stringify(posts)));
      return expect(p, 'when fulfilled', expect.it('to equal', expectedPublicContent));
    });
  });

  describe('createWritableContentStore', () => {
    let testEnv;
    let contentStore;

    beforeEach(cb => {
      testEnv = initTestEnv();
      testEnv.initGitRepositoryFrom(TESTCONTENT_DIR)
        .then(repoDir => {
          contentStore = createWritableContentStore(repoDir);
          cb();
        })
        .catch(err=> { console.log('ERROR: '.err); return cb(err); });
    });


    it('works', () => {
      expect(contentStore, 'to be an', 'object');
      expect(contentStore.readPosts, 'to be a', 'function');
      expect(contentStore.publishPost, 'to be a', 'function');
    });

    it('read all DRAFT posts', () => {
      const p = contentStore.readPosts();
      //    p.then(posts => fs.writeFileSync('c:/SPU/tmp/bbb.json', JSON.stringify(posts)));
      return expect(p, 'when fulfilled', expect.it('to equal', expectedDraftContent));
    });

    it('publishPost fails with no parameter', () => {
      expect(() => { contentStore.publishPost() }, 'to throw', /must be set/);
    });

    it('publishes a post', () => {
      return contentStore.publishPost('sonnenuntergang')
        .then(()=>{
          expect(testEnv.hasFile('drafts/sonnenuntergang.json'), 'to be true');
          expect(testEnv.hasFile('public/sonnenuntergang.json'), 'to be true');
          expect(testEnv.readJson('drafts/sonnenuntergang.json'), 'to have property', 'published', true);
          expect(testEnv.readJson('public/sonnenuntergang.json'), 'to have property', 'published', true);
          return expect(testEnv.isRepoClean(), 'when fulfilled', 'to be true');
        });
    });

    it('removes all "protected" properties from post', () => {
      const postWithHiddenProperties = {
        slug: 'post-with-hidden-properties',
        title: 'This post contains hidden properties',
        _contentHtml: 'This should be removed',
        _date: 'This should go too'
      };

      const expectedStoredPost = {
        slug: 'post-with-hidden-properties',
        title: 'This post contains hidden properties',
        published: false
      };

      return contentStore.storeDraft(postWithHiddenProperties).then(()=>{
        expect(testEnv.readJson('drafts/post-with-hidden-properties.json'),
          'to equal', expectedStoredPost)});
      });

    it('fails on storing a post without "slug"', () => {
      expect(() => contentStore.storeDraft({title: 'xxx'}), 'to throw', /Missing slug property/);
    });

    it('stores a post', () => {
      const post = {
        slug: 'new-post',
        title: 'hello world'
      };

      const expectedDraftPost = Object.assign({}, post, { published: false });
      const p = contentStore.storeDraft(post);

      return p.then(publishedPost => {
        expect(publishedPost, 'to equal', expectedDraftPost);
        expect(testEnv.hasFile('drafts/new-post.json'), 'to be true');
        return expect(testEnv.isRepoClean(), 'when fulfilled', 'to be true');
      })
    });
    it('list uploaded files ordered by date', () => {
      const expectedFiles = [
        { file: 'uploads/logo_small.png' },
        { file: 'uploads/eclipse.png' }
      ];
      return contentStore.listUploadedFiles().then(files => { console.log(files); return files; })
      .then(files => {
        expect(files, 'to equal', expectedFiles);
      })
    });

    afterEach(() => {
      // testEnv.dispose();
    });
  });


});