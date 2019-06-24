const Router = require('express-promise-router');
const responseTypes = require('../../../utils/apiResponseTypes');
const users = require('../db/users');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.use((req, res, next) => {
  next();
});

router.post('/newSession', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.send(responseTypes.Err('Missing email or password.'));
  }
  
  users.getUserByEmailAndPassword(req.body.email, req.body.password)
    .then((dbResult) => {
      const user = dbResult.rows[0];
      if(!user) {
        return res.send(responseTypes.Err('Wrong email/password.'));
      }

      users.generateNewSession(user.id)
        .then((sessionKey) => {
          return res.send(responseTypes.Success({
            sessionKey
          }));
        });
    });
});

router.post('/new', (req, res) => {
  if(!req.user.validAuth) return responseTypes.Unauthorized(res);
  if(!req.user.isSuperAdmin) return responseTypes.Forbidden(res);

  users.addUser(req.body.email, req.body.password, req.body.isSuperAdmin)
    .then(() => res.send(responseTypes.Success()));
});

router.put('/purgeSessions', (req, res) => {
  if (!req.user.validAuth) return responseTypes.Unauthorized(res);
  if(req.body.forUser) if(req.body.forUser !== req.user.id && req.body.isSuperAdmin === false) return responseTypes.Forbidden(res);

  const forUser = req.body.forUser ? req.body.forUser : req.user.id;

  users.purgeSessions(forUser, req.user.session).then(
    (numSessionsRemoved) => res.send(responseTypes.Success(numSessionsRemoved + ' sessions removed, except for your current one.'))
  );
});


// export our router to be mounted by the parent application
module.exports = router;
