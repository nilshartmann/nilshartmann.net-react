// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import _ from "lodash";
import util from "util";

export function ensureDefined(name, value) {
  if (_.isNull(value) || _.isUndefined(value)) {
    throw new Error(`Argument '${name}' must be defined.`);
  }

  return value;
}

export function ensureTrue(msg, value) {
  if (value !== true) {
    throw new Error(msg);
  }

  return value;
}

export function ensureString(name, value) {
  if (!_.isString(value)) {
    throw new Error(`Argument '${name}' must be a string (value: '${value}')`);
  }

  return value;
}

export function ensureFunction(name, value) {
  if (!_.isFunction(value)) {
    throw new Error(`Argument '${name}' must be a function (value: '${value}')`);
  }

  return value;
}

export function isArray(value) {
  return _.isArray(value);
}

export function explodePlaceholder(array, offset = 1) {
  if (!isArray(array)) {
    return "";
  }
  return array
    .map((name, i) => {
      return "$" + (i + offset);
    })
    .join(",");
}

export function format(value) {
  if (_.isArray(value)) {
    return util.format.apply(this, value);
  }
  return value;
}

// see http://stackoverflow.com/a/2450976
export function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
