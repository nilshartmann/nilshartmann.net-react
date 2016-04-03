// --------------------------------------------------------------------------------------
// ---
// ---
// ---
// --------------------------------------------------------------------------------------
// --- Nils Hartmann (http://nilshartmann.net).
// -------------------------------------------------------------------------------------
import async from 'async';
import * as Utils from '../util/Utils';
import Logger from '../util/Logger';

const LOGGER = Logger.getLogger('SchemaGenerator');

function executeSqls(database, sqls, callback) {
  let lastResult;
  async.eachSeries(sqls, (sql, iteratorCallback) => {
    database.query(sql, [], (err, result) => {
      if (err) {
        LOGGER.info(`Error while running '${sql}: '${err}'`);
        return iteratorCallback(err);
      }
      lastResult = result;
      return iteratorCallback();
    });
  }, (err) => {
    return callback(err, lastResult);
  });
}

export default {
  recreateUserAndSchema(database, userAndSchemaName, callback) {
    Utils.ensureDefined('database', database);
    Utils.ensureString('userAndSchemaName', userAndSchemaName);

    // Array handling: http://www.postgresql.org/docs/9.4/static/arrays.html

    executeSqls(
      database,
      [
        `DROP SCHEMA IF EXISTS ${userAndSchemaName} CASCADE`,
        `DROP USER IF EXISTS ${userAndSchemaName}`,
        `CREATE ROLE ${userAndSchemaName} LOGIN PASSWORD '${userAndSchemaName}' NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;`,
        `GRANT ${userAndSchemaName} TO simpleblogadmin`,
        `CREATE SCHEMA ${userAndSchemaName} AUTHORIZATION ${userAndSchemaName}`,
        `CREATE TABLE ${userAndSchemaName}.posts (
        slug TEXT PRIMARY KEY,
        alias TEXT UNIQUE,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        tags TEXT[] NOT NULL,
        publish_time TIMESTAMP NOT NULL DEFAULT current_timestamp,
        published boolean NOT NULL DEFAULT false)`,
        `ALTER TABLE ${userAndSchemaName}.posts OWNER TO ${userAndSchemaName};`
      ],
      callback
    );
  }
};
