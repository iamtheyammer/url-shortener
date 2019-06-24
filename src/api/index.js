const express = require('express');
const app = express();
const cors = require('cors');
/*
  Here, we define API routes.
*/

app.use(cors());

app.use('/v0', require('./v0/'));

// handle API 404 errors
app.use('*', (req, res) => {
  res.sendStatus(404);
});

module.exports = app;
