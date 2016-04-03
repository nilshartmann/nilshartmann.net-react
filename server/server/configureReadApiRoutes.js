// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------
import Joi from 'joi';
import Boom from 'boom';

export function configureReadApiRoutes(server, { publicApi, authenticatedApi }) {

  function _api(request) {
    return request.auth.isAuthenticated ? authenticatedApi : publicApi;
  }

  server.route({
    method: 'GET', //
    path: '/api/posts', //
    handler: (request, reply) => {
      _api(request).queryPosts(request.query.options).then(posts => {
        reply(posts).type('application/json');
      }).catch(err => {
        reply(Boom.wrap(err));
      });
    },
    config: {
      validate: {
        query: {
          options: Joi.object()
        }
      }
    }
  });

  server.route({
    method: 'GET', //
    path: '/api/posts/{slug}', //
    handler: (request, reply) => {
      const slug = request.params.slug;
      _api(request).getPost(slug)
        .then(post => {
          if (!post) {
            reply(Boom.notFound(slug));
          } else {
            reply(post).type('application/json');
          }
        })
        .catch(err => {
          reply(Boom.wrap(err));
        });
    }
  });

  server.route({
    method: 'GET',
    path: '/api/tags',
    handler: (request, reply) => {
      _api(request).getTags(request.query.count === true)
        .then(tags => {
          reply(tags).type('application/json');
        })
        .catch(err => {
          reply(Boom.wrap(err));
        });
    },
    config: {
      validate: {
        query: {
          count: Joi.boolean()
        }
      }
    }
  });

  server.route({
    method: 'GET', //
    path: '/api/flickrimages', //
    handler: (request, reply) => {
      _api(request).getFlickrImages()
        .then(photos => reply(photos).type('application/json'))
        .catch(err => reply(Boom.wrap(err)))
    }
  });
}