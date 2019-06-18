const moment = require('moment');
const db = require('../../../utils/db');

function newUrl(userId, shortlink, destination) {
  return db.query('INSERT INTO urls (created_by, created_at, updated_at, ' +
    'shortlink, destination) VALUES ($1, $2, $2, $3, $4)',
  [
    userId,
    moment().utc().valueOf(),
    shortlink,
    destination
  ]);
}

function updateUrlById(urlId, newShortlink, newDestination) {
  if(newShortlink && !newDestination) {
    return updateShortlinkById(urlId, newShortlink);
  }

  if(newDestination && !newShortlink) {
    return updateDestinationById(urlId, newDestination);
  }

  return db.query('UPDATE ' + db.urlsTableName + ' SET updated_at=$1, shortlink=$2, destination=$3 WHERE id=$4',
  [
    moment().utc().valueOf(),
    newShortlink,
    newDestination,
    urlId
  ]);
}

function updateShortlinkById(urlId, newShortlink) {
  return db.query('UPDATE ' + db.urlsTableName + ' SET updated_at=$1, shortlink=$2 WHERE id=$3',
    [
      moment().utc().valueOf(),
      newShortlink,
      urlId
    ]);
}

function updateDestinationById(urlId, newDestination) {
  return db.query('UPDATE ' + db.urlsTableName + ' SET updated_at=$1, destination=$2 WHERE id=$3',
    [
      moment().utc().valueOf(),
      newDestination,
      urlId
    ]);
}

function getAllUrls() {
  return db.query('SELECT * FROM ' + db.urlsTableName).then(dbResult => dbResult.rows);
}

function deleteUrlById(urlId) {
  return db.query('DELETE FROM ' + db.urlsTableName + ' WHERE id=$1', [ urlId ]);
}

function getDestinationFromShortlink(shortlink) {
  return db.query('SELECT destination FROM ' + db.urlsTableName + ' WHERE shortlink=$1', [ shortlink ])
    .then((dbResult) => dbResult.rows[0] ? dbResult.rows[0].destination : null);
}

module.exports = {
  newUrl,
  updateUrlById,
  getAllUrls,
  deleteUrlById,
  getDestinationFromShortlink
};