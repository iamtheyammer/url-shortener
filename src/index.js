const express = require('express');
const cookieParser = require('cookie-parser');
const join = require('path').join;

const app = express();

app.use(express.json()); // use JSON for body parsing
app.use(cookieParser());

// app.use(function (req, res, next) { // fix CORS
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-LabDay-Token");
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
//   next();
// });

app.use('/api/', require('./api/v0/middleware/auth.js'));
app.use('/api/', require('./api/index')); // API routes

// Serve static files
app.use('/', express.static(join(__dirname, 'staticHtml/')));

// // serve react statics
// app.use('/admin', express.static(join(__dirname, 'frontend/build')));

// // Serve the react app!
// app.get('/admin/*', (req, res) => {
//   res.sendFile(join(__dirname + '/frontend/build/index.html'));
// });

// finally, serve shortener
app.use('/', require('./shortener'));

const port = process.env.PORT ? process.env.PORT : 8080;
console.log('URL Shortener running on port ' + port);
app.listen(port);
