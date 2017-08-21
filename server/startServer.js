// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------
import path from "path";

import Hapi from "hapi";
import Inert from "inert";
import hapiAuthJWT from "hapi-auth-jwt2";

import { createConfiguredStores } from "./content/createContentStore";
import { createReadApi, createWriteApi } from "./api/createApi";

import { configureReadApiRoutes } from "./server/configureReadApiRoutes";
import { configureWriteApiRoutes, validate } from "./server/configureWriteApiRoutes";

import renderIndexHtml from "./renderIndexHtml";
import renderRoute from "./server/renderRoute";

export function startServer(config) {
  const { apiHost, apiPort, contentPath, apiUser, apiPassword, webHost, webPort, jwtKey, publicBackendUrl } = config;
  const { publicContentStore, writableContentStore } = createConfiguredStores(contentPath);

  console.log("----------------------------------------------------", publicContentStore, writableContentStore);
  const uploadPath = path.join(contentPath, "uploads");

  // For certbot client:(https://certbot.eff.org/)
  // The webroot Plug-in needs access from outside to a '.well-known' folder
  // for the certificate request
  const webWellKnownPath = path.join(uploadPath, "web-well-known/.well-known");
  const apiWellKnownPath = path.join(uploadPath, "api-well-known/.well-known");
  console.log("webWellKnownPath", webWellKnownPath);
  console.log("apiWellKnownPath", apiWellKnownPath);

  // ---------------------------------------------------------------------------------------------------------------
  // -- Create Hapi Server
  // ---------------------------------------------------------------------------------------------------------------
  const server = new Hapi.Server();

  const cors = { additionalExposedHeaders: ["Authorization"] };
  console.log("Cors", cors);

  // ---------------------------------------------------------------------------------------------------------------
  // -- Configure connection
  // ---------------------------------------------------------------------------------------------------------------
  const apiConnection = server.connection({
    host: apiHost,
    port: apiPort,
    labels: "api",

    routes: {
      auth: {
        mode: "try" // https://github.com/dwyl/hapi-auth-jwt2#authentication-modes
      },
      cors
    }
  });

  // ---------------------------------------------------------------------------------------------------------------
  // -- Configure API routes
  // ---------------------------------------------------------------------------------------------------------------
  apiConnection.register([Inert, hapiAuthJWT], err => {
    if (err) {
      console.error(err);
    }

    apiConnection.auth.strategy("jwt", "jwt", {
      key: jwtKey, // Never Share your secret key
      validateFunc: validate, // validate function defined above
      verifyOptions: {
        algorithms: ["HS256"],
        ignoreExpiration: true
      }
    });

    apiConnection.auth.default("jwt");

    //
    configureReadApiRoutes(apiConnection, {
      publicApi: createReadApi(publicContentStore, config),
      authenticatedApi: createReadApi(writableContentStore, config)
    });
    configureWriteApiRoutes(apiConnection, createWriteApi(writableContentStore, apiUser, apiPassword), jwtKey);

    // For letsencrypt / certbot
    apiConnection.route({
      method: "GET", //
      path: "/.well-known/{param*}", //
      handler: {
        directory: {
          path: apiWellKnownPath
        }
      }
    });
  });

  if (!webHost) {
    console.log("WARN... no webHost configured. Starting API only");
  } else {
    const webConnection = server.connection({
      host: webHost,
      port: webPort,
      labels: "web"
    });

    webConnection.register(Inert, () => {
      const publicPath = path.join(__dirname, "/../client/public");

      console.log("------------------- WEB -------------------------");
      console.log("PublicPath: ", publicPath);
      console.log("uploadPath: ", uploadPath);
      console.log(`Host: ${webHost}:${webPort}`);

      webConnection.route({
        method: "GET",
        path: "/uploads/{param}",
        handler: {
          directory: {
            path: uploadPath
          }
        }
      });

      if (process.env.HOTLOADER) {
        console.log("Enable Hot server...");
        require("./devServerHapi").setup(webConnection, publicPath, renderIndexHtml(publicBackendUrl));
      } else {
        webConnection.route({
          method: "GET", //
          path: "/{param*}", //
          handler: {
            directory: {
              path: publicPath
            }
          }
        });

        // Serverside rendered URLs
        const CLIENT_PATHS = [
          "/",
          "/index.html",
          "/posts/{param*}",
          "/tags/{param*}",
          "/pages/{param*}",

          "/login/{param*}",
          "/upload",
          "/edit/{param*}"
        ];

        CLIENT_PATHS.forEach(path => {
          webConnection.route({
            method: "GET",
            path,
            handler: (request, reply) => renderRoute(request, reply, publicBackendUrl)
            // handler: (request, reply) => reply(indexHtml)
          });
        });
        // For letsencrypt / certbot
        webConnection.route({
          method: "GET", //
          path: "/.well-known/{param*}", //
          handler: {
            directory: {
              path: webWellKnownPath
            }
          }
        });
      }
    });
  }

  console.log(`About to start server...`);
  return server.start().then(() => server);
}
