import path from 'path';
import expect from 'unexpected';

import { startServer } from '../../server/startServer';

import initTestEnv from './initTestEnv';
import expectedDraftContent from './__test_content__/expected/draft-posts.json';
import expectedPublicContent from './__test_content__/expected/public-posts.json';
const TESTCONTENT_DIR = path.join(__dirname, '__test_content__');



describe('API Server', () => {
  let testEnv;
  let server;

  function _login() {
    return server.inject({
      method: 'POST',
      url: '/api/login',
      payload: {
        userid: 'testapiuser',
        password: 'test-api-password'
      }
    }).then(res => {
      expect(res.result, "to equal", { text: 'Login successful' });
      return res;
    });
  }


  beforeEach(() => {
    testEnv = initTestEnv();
    return testEnv.initGitRepositoryFrom(TESTCONTENT_DIR)
      .then(repoDir => ({
        apiHost: 'localhost',
        apiPort: 7788,
        contentPath: repoDir,
        apiUser: 'testapiuser',
        apiPassword: 'test-api-password',
        jwtKey: 'xxx'
      }))
      .then(serverConfig => startServer(serverConfig))
      .then(s => server = s);
  });

  describe('admin API', () => {
    let loginResult;
    beforeEach(() => {
      return _login().
        then(res => loginResult = res);
    });

    it('should login', () => {
      console.log(loginResult);
      expect(loginResult.statusCode, "to equal", 200);
      expect(loginResult.headers['authorization'], "to be defined");
    });

    it('should logout', () => {
      return server.inject({
        url: '/api/logout',
          headers: {
            // token should be invalid now
            authorization: loginResult.headers['authorization']
          }
        })
        .then(res => {
          expect(res.statusCode, "to equal", 200);
          return server.inject({
            url: '/api/restricted',
            headers: {
              // token should be invalid now
              authorization: loginResult.headers['authorization']
            }
          }).then(res => {
              expect(res.statusCode, "to equal", 401);
            });
        })
    });

    it('should NOT have access to restricted route without token', () => {
      return server.inject('/api/restricted')
        .then(res => {
          expect(res.statusCode, "to equal", 401);
        })
    });

    it('should  have access to restricted route with valid token', () => {
      return server.inject({
        url: '/api/restricted',
        headers: {
          authorization: loginResult.headers['authorization']
        }
      })
        .then(res => {
          expect(res.statusCode, "to equal", 200);
        })
    });

    it('should list all PUBLIC posts WITHOUT credentials ', () => {
      return server.inject('/api/posts').then(res => {
        expect(res.result, "to equal", expectedPublicContent);
      });
    });

    it('should list all DRAFT posts WITHOUT credentials ', () => {
      return server.inject({
        url: '/api/posts',
        headers: {
          authorization: loginResult.headers['authorization']
        }
      }).then(res => {
        expect(res.result, "to equal", expectedDraftContent);
      });
    });

    it('should publish post WITH credentials ', () => {
      return server.inject({
           url: '/api/posts/das-osgi-buch'
          }).then (initialRes => {
            expect(initialRes.statusCode, "to equal", 404);

          return server.inject({
          method: 'PUT',
          url: '/api/posts',
          payload: {
            slug: 'das-osgi-buch',
            action: 'publish'
          },
          headers: {
            authorization: loginResult.headers['authorization']
          }
        }).then(res => {
          // Result should be OK
          expect(res.result, "to equal", { 'msg': 'ok' });

          // not-logged in user should find the post
          return server.inject({
            url: '/api/posts/das-osgi-buch'
            }).then (res2 => {
              expect(res2.statusCode, "to equal", 200);
            })
        });
      })
    });

    it('should list all PUBLIC posts with INVALID credentials ', () => {
      return server.inject({
        url: '/api/posts',
        headers: {
          authorization: 'fuckinvalid'
        }
      }).then(res => {
        expect(res.result, "to equal", expectedPublicContent);
      });
    });

  });

  describe('public read API', () => {

    it('should list all posts', () => {
      return server.inject('/api/posts').then(res => {
        expect(res.result, "to equal", expectedPublicContent);
      });
    });

    it('should find a post', () => {
      const p = server.inject('/api/posts/osgi-by-example')
        .then(res => res.result);
      return expect(p, 'when fulfilled', 'to satisfy', { slug: 'osgi-by-example' });
    });

    it('should return all tags', () => {
      const p = server.inject('/api/tags')
        .then(res => res.result);
      return expect(p, 'when fulfilled', 'to satisfy',
        { tags: expect.it('to contain', 'JavaScript', 'React', 'Fotografie', 'Sonnenuntergang', 'Artikel und Vorträge', 'OSGi', 'Softwareentwicklung') });
    })
  });

  afterEach(() => {
    if (server) {
      return server.stop();
    }
  });
});