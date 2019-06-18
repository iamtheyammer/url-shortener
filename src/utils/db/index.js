const query = require('./pool').query;

const usersTableName = 'users';
const sessionsTableName = 'sessions';
const urlsTableName = 'urls';

module.exports = {
  query,
  usersTableName,
  sessionsTableName,
  urlsTableName
};