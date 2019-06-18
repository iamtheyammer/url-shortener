const { Pool } = require('pg');

if(!process.env.DATABASE_URL) {
  console.error('No DATABASE_URL config var.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

function query(text, params, callback) {
  return pool.query(text, params, callback);
}

module.exports = {
  query
};