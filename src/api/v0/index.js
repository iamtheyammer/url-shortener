const express = require('express');
const app = express();
/*
  Here, we define API routes.
*/

app.use('/users', require('./routes/users'));
app.use('/urls', require('./routes/urls'));


module.exports = app;
