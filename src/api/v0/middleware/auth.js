const getUserBySession = require('../db/users.js').getUserBySession;
function authMiddleware(req, res, next) {
 if (!req.headers['x-yammer-session'] && !req.cookies.session && !req.headers['authorization']) {
   req.invalidSession = true;
   req.user = {
     validAuth: false
   };
   return next();
 }

 let session = '';
 if(req.headers['x-yammer-session']) {
   session = req.headers['x-yammer-session'];
 } else if (req.headers['authorization']) {
   session = req.headers['authorization'];
 } else if (req.cookies.session) {
   session = req.cookies.session;
 }

 return getUserBySession(session).then(user => {
   req.user = {
     session,
     validAuth:  user.validAuth,
     id: user.id,
     email: user.email,
     confirmed: user.confirmed,
     isSuperAdmin: user.is_super_admin
   };
   return next();
 });
}

module.exports = authMiddleware;