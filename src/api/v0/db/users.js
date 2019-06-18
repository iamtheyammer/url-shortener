const crypto = require('crypto');
const moment = require('moment');
const db = require('../../../utils/db');

function getUserByEmailAndPassword(email, password) {
  return db.query('SELECT id, email, confirmed FROM ' + db.usersTableName + ' WHERE (email=$1 AND password=$2)',
  [
    email,
    password
  ]);
}

function getUserIdBySession(sessionString) {
  return db.query(
    'SELECT user_id FROM ' + db.sessionsTableName + ' WHERE session_string=$1',
    [
      sessionString
    ]
  ).then((dbResult) => {
    if(!dbResult.rows[0]) return -1;
    return dbResult.rows[0].user_id;
  });
}

function generateNewSession(userId) {
  const sessionKey = crypto.randomBytes(25).toString('hex');

  return db.query(
    'INSERT INTO ' + db.sessionsTableName + ' (user_id, created_at, session_string) VALUES ($1, $2, $3)',
    [
      userId,
      moment().utc().valueOf(),
      sessionKey
    ]
  ).then(() => sessionKey);
}

module.exports = {
  getUserByEmailAndPassword,
  getUserIdBySession,
  generateNewSession
};