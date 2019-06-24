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

function getUserBySession(sessionString) {
  return db.query(
    'SELECT id, email, confirmed, is_super_admin ' +
    'FROM users WHERE id=(SELECT user_id FROM sessions WHERE session_string = $1)',
    [
      sessionString
   /* eslint-disable-next-line */
  ]).then((dbResult) => dbResult.rows[0] ? {...dbResult.rows[0], ...{ validAuth: true }} : { validAuth: false });
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

function addUser(email, password, isSuperAdmin) {
  return db.query('INSERT INTO ' + db.usersTableName + ' (email, password, confirmed, is_super_admin) ' +
  ' VALUES ($1, $2, $3, $4)',
  [
    email,
    password,
    false,
    isSuperAdmin
  ]);
}

function purgeSessions(userId, currentSession) {
  return db.query('DELETE FROM ' + db.sessionsTableName + ' WHERE user_id=$1' + currentSession ? ' AND session_string != $2' : '',
    [
      userId,
      currentSession
    ]).then((dbResult) => dbResult.affectedRows);
}

module.exports = {
  getUserByEmailAndPassword,
  getUserIdBySession,
  getUserBySession,
  generateNewSession,
  addUser,
  purgeSessions
};