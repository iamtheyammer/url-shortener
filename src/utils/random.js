const genRandomString = require('randomstring').generate;

function makeId(length) {
  return genRandomString({
    length,
    charset: 'alphanumeric',
    readable: true
  });
}

module.exports = makeId;