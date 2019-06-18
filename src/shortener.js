const express = require('express');
const app = express();
/*
  Here, we define API routes.
*/

const getDest = require('./api/v0/db/urls').getDestinationFromShortlink;

app.get('/:shortlink', (req, res) => {
  getDest(req.params.shortlink)
  .then((dest) => {
    if(dest) {
      return res.redirect(dest);
    }

    res.redirect('/404.html');
  });
});

module.exports = app;
