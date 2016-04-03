// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import Joi from 'joi';
import Boom from 'boom';
import hapiAuthJWT from 'hapi-auth-jwt2'; // http://git.io/vT5dZ
import JWT from 'jsonwebtoken';   // used to sign our content
import uuid from 'uuid';

import { ensureDefined } from '../util/Utils';

// export const JWT_KEY = 'SimpleBlogSecretKey';
const ALL_SESSIONS = {};

function newSession(user) {
  const session = {
    id: uuid.v4(),
    user
  };
  ALL_SESSIONS[session.id] = session;

  return session;
}

function deleteSession(id) {
  console.log('Sessions', ALL_SESSIONS);
  console.log('Removing', id);
  delete ALL_SESSIONS[id];
}

export function validate(decoded, request, callback) {
  if (!ALL_SESSIONS.hasOwnProperty(decoded.id)) {
    return callback(null, false);
  }
  return callback(null, true);
}
export function configureWriteApiRoutes(server, api, jwtKey) {
  ensureDefined('server', server);
  ensureDefined('api', api);
  ensureDefined('jwtKey', jwtKey);

  server.route({
    method: 'POST',
    path: '/api/login',
    handler: (request, reply) => {
      const user = api.login(request.payload.userid, request.payload.password);
      if (!user) {
        return reply(Boom.unauthorized('Invalid user or password'));
      }

      const session = newSession(user);
      const token = JWT.sign(session, jwtKey, {
        expiresIn: '1d'
      });

      reply({ text: 'Login successful' })
        .header('Authorization', token);
    },
    config: {
      payload: {
        parse: true
      },
      auth: false,
      validate: {
        payload: {
          userid: Joi.string().alphanum().min(1).required(),
          password: Joi.string().min(1).required()
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/logout',
    handler: (request, reply) => {
      const auth = request.auth;
      if (auth && auth.credentials) {
        deleteSession(auth.credentials.id);
      }
      reply({ text: 'Logged out' });
    }
  });

  server.route({
    method: 'POST',
    path: '/api/posts',
    handler: (request, reply) => {
      console.log('########################################################');
      console.log(request.payload);
      api.storeDraft(request.payload.post).then(savedPost => reply(savedPost));
    },
    config: {
      auth: 'jwt'
    }
  });

  server.route({
    method: 'PUT',
    path: '/api/posts',
    handler: (request, reply) => {
      const { slug, action } = request.payload;
      console.log(' ############################## publish', slug, action);
      if (action !== 'publish') {
        return reply(Boom.badRequest('invalid action'));
      }
      api.publishPost(slug)
        .then(() => reply({ 'msg': 'ok' }))
        .catch(err => { console.log('ERROR', err); reply(Boom.wrap(err)); })
    },
    config: {
      auth: 'jwt',
      validate: {
        payload: {
          slug: Joi.string().required(),
          action: Joi.string().regex(/publish/)
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/uploads',
    handler: (request, reply) => {
      api.listUploads()
        .then(files => reply(files))
      //   .catch(err => { console.log('ERROR', err); reply(Boom.wrap(err)); })
    },
    config: {
      auth: 'jwt',
    }
  });


  server.route({
    method: 'GET',
    path: '/api/restricted',
    handler: (request, reply) => {
      reply({ text: 'You used a Token!' })
        .header('Authorization', request.headers.authorization);
    },
    config: {
      auth: 'jwt'
    }
  });

  server.route({
    method: 'POST',
    path: '/api/upload',
    handler: (request, reply) => {
      const payload = request.payload;
      const formFile = payload.file;
      console.log('FORM FILE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ');
      console.dir(formFile);
      console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ');

      api.upload(payload, formFile.hapi.filename, formFile)
        .then(uploadedFile => {
          console.log('FILE UPLOADED TO: ' + uploadedFile);
          const ret = {
            filename: formFile.hapi.filename,
            headers: formFile.hapi.headers
          };
          reply(JSON.stringify(ret));
        }).catch(err => {
          console.error(err);
          reply(Boom.wrap(err));
        });
    },
    config: {
      auth: 'jwt',
      payload: {
        output: 'stream',
        parse: true,
        maxBytes: (1024 * 1024 * 20)
      },
      validate: {
        payload: {
          file: Joi.object().required()
        }
      }
    }
  });
}
