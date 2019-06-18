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


// export our router to be mounted by the parent application
module.exports = router;
