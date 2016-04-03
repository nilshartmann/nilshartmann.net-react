// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import {ensureDefined} from './util/Utils';
import Logger from './util/Logger';
import Boom from 'boom';

const LOGGER = Logger.getLogger('Api');

const AllowedFields = {
  title:        'title',
  slug:         'slug',
  summary:      'summary',
  body:         'body',
  tags:         'tags',
  publish_time: 'publish_time',
  date:         'to_char(publish_time,\'DD.MM.YYYY\') AS date'
};

export default class Api {
  constructor(database) {
    ensureDefined('database', database);
    this.database = database;
    LOGGER.info('Api created');
  }

  queryPosts(options, callback) {
    const fieldlist = [];
    const requestedFields = options.fields ? options.fields.split(',') : Object.keys(AllowedFields);
    const valid = requestedFields.every((field) => {
      if (!AllowedFields.hasOwnProperty(field)) {
        return false;
      }
      fieldlist.push(AllowedFields[field]);
      return true;
    });
    if (!valid) {
      return callback(Boom.badRequest('invalid fields'));
    }

    this.database.query(`SELECT ${fieldlist.join(',')} FROM posts ORDER BY posts.publish_time DESC`, [], callback);
  }
}
// Liefert ein bis drei Zeilen zurück: vorheriger, gesuchter, nächster Artikel
// WITH post AS (SELECT * FROM p WHERE p.t = 'Neuer Artikel') (SELECT p.*,'prev' AS prev from p,post WHERE p.z>post.z ORDER BY p.z ASC LIMIT 1) UNION SELECT *,'curr' AS prev FROM post UNION (SELECT p.*,'next' AS prev from p,post WHERE p.z<post.z ORDER BY p.z DESC LIMIT 1) ORDER by z;
