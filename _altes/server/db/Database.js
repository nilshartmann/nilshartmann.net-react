// --------------------------------------------------------------------------------------
// --- Nils Hartmann (http://nilshartmann.net).
// -------------------------------------------------------------------------------------

import pg from 'pg';
import * as Utils from '../util/Utils';
import Logger from '../util/Logger';
const LOGGER = Logger.getLogger('Database');

export default class Database {
  constructor(connectionString) {
    this.connectionString = Utils.ensureString('connectionString', connectionString);
  }

  /** Das übergebene callback wird nach Ausführung mit zwei Parametern
   * aufgerufen: fehler und result. Fehler ist immer null (aber NodeJs-Konvention), das Result
   * sind die Ergebnisse des Queries
   * @param sql
   * @param values
   * @param callback
   */
  query(sql, values, callback) {
    Utils.ensureDefined('sql', sql);
    Utils.ensureDefined('callback', callback);
    LOGGER.info('%s| %s', this.connectionString, sql, values);
    pg.connect(this.connectionString, (err, client, doneConnection) => {
      if (err) {
        console.error(err);
        throw new Error('Unable to acquire connection from pool');
      }

      client.query(sql, values, (queryError, result) => {
        // Connection zum Pool zurückgeben
        doneConnection();

        // Beim Fehler können wir nichts machen => Exception
        if (queryError) {
          LOGGER.error('Error while running query: ', queryError);
          return callback(queryError);
          // throw new Error('Error running query: ' + sql);
        }

        // Callback mit dem Resultat aufrufen
        callback(null, result.rows);
      });
    });
  }

  /**
   * Schließt ALLE Connections.
   *
   * Nur im Test verwenden !!!
   */
  static closeAllConnections() {
    LOGGER.info('Closing ALL connections');

    pg.end();
  }

  static newConnectionString(user) {
    Utils.ensureString('user', user);
    const _password = user; // TODO
    return 'postgres://' + user + ':' + _password + '@localhost:5432/simpleblog';
  }
}
