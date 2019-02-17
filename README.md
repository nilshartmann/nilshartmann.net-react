Deprecation warning
===================

This was my personal blog. It uses Hapi as a websever and React for rendering the pages
both on server- and clientside. It stores its content as Markdown files in a regular Git repository.

**This repository is not used any longer**, as I migrated all my content to a GatsbyJS-based homepage, that has its [own repository on](https://github.com/nilshartmann/nilshartmann.net)

Server architecture
===================

The `hapi` server opens two connections on different ports and different host names:
* `api`: backend for the blog API (/api/...)
* `web`: serving static content

Development
-----------
For the development time the server can be started with a Webpack Development Server with hot reloading configured.
To enable hot reload set environment variable `HOTLOADER` to `true`.

Run
===
* `npm start`: Starts the server, serving static content from the file system. The application has to be build with `npm build` before
* `npm run server:watch` Starts a watching server (restart on code changes)
* `npm run server:watch-hot`:  Starts a watching server (restart on code changes) with **Hot reloading** for the client components enabled (using an embedded Webpack Development Server)
* `npm run build`: Build the static client files
* `npm test`: Runs the test suite (using an embedded server instance)
* `npm test:watch` Runs the tests suite but keeps alive and runs on each code change


Configuration
=============

Content
-------
The server expected to have a `store` directory with the following the directories:

* `public`: All published posts in json format
* `drafts`: All posts (this will be used as content store for logged-in users)
* `uploads`: directory where uploaded files are written to. This directory is mapped to the `web`connection,
so that can be accessed by clients)

All this three directories must be inside a Git repository.

The default location for the store is `../../content` (relative to server/server.js, so it points to a `content` directory
at the parent directory of the project)

The "store" is filebased using Git for version control. No database needed. It's very simple, does not scale but works for my purpose.

All files in the store are under Git control. If something is changed (i.e. new post is created), the application
changes the file on the filesystem and makes a commit. That makes it easy to recover in case you need to and
to clone your store (for example for backup)

Server
------
The server's start function (`startServer`) expect an object with configuration options (`server/server.js`). Some
of them are:

* `apiHost` and `apiPort`: Hostname and port for the API (required)
* `webHost` and `webPort`: Hostname and port for the web connection (optional).
If not specified, the Webserver will not be started. In that case only the API server is running
* `apiUser` and `apiPassword`: Username and Password for the admin user.
The admin user is the only known user in this system. This user is used to edit content. Multiple users
(with multiple roles) are currently not supported.
* `contentPath` must point to the `content` directory discussed above

All these values are configures to have sensible defaults, but can be overriden by providing a json file with the same keys as
described above. The path to the json file can be specified with the `--config` command line argument.

To embedd a server in another process (for example into the test suite), you can invoke `startServer` from your
own code an pass an apropriate configuration object. In the test suite for example we start the server on a
different port with different content store directories.




