// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------
import fs from "fs";
import path from "path";
import { startServer } from "./startServer";
import renderIndexHtml from "./renderIndexHtml";

const argv = require("yargs").argv;
const serverConfigFile = argv.config || path.join(__dirname, "../../content/config/server-config.json");
console.log("Reading Server Config from ", serverConfigFile);
const config = JSON.parse(fs.readFileSync(serverConfigFile, "utf8"));

// properties marked with 'xxx' should be set in config file and kept secret
const serverConfig = Object.assign(
  {
    apiHost: "localhost",
    apiPort: 7777,
    publicBackendUrl: "http://localhost:7777",
    webHost: "localhost",
    webPort: 3000,
    apiUser: "nils",
    apiPassword: "xxx",
    jwtKey: "xxx",
    contentPath: path.join(__dirname, "../../content"),
    flickr: {
      apiKey: "xxx",
      userId: "xxx"
    }
  },
  config
);

process.on("unhandledRejection", function(reason, p) {
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

// TODO move to startServer(?)
serverConfig.indexHtml = renderIndexHtml(serverConfig.publicBackendUrl);

startServer(serverConfig)
  .then(server => {
    server.connections.forEach(c => console.log(`Server running at: ${c.info.uri}`));
  })
  .catch(err => console.error("ERROR:", err));
