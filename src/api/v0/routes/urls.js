const Router = require('express-promise-router');
const responseTypes = require('../../../utils/apiResponseTypes');
const getSession = require('../../../utils/session');
const genRandomString = require('../../../utils/random');
const users = require('../db/users');
const urls = require('../db/urls');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.use((req, res, next) => {
  next();
});

router.get('/getAll', (req, res) => {
  const session = getSession(req);

  if (!session) {
    res.status(401).send(responseTypes.Err('No session.'));
  }

  users.getUserIdBySession(session)
    .then((user_id) => {
      if (!user_id === -1) {
        return res.status(401).send(responseTypes.Err('Invalid session.'));
      }

      urls.getAllUrls()
        .then((urls) => {
          res.status(200).send(responseTypes.Success({
            urls
          }));
        }).catch((err) => {
          console.log(err);
          res.send(responseTypes.Err('There was an error.'));
        });
    });
});

router.post('/new', (req, res) => {
  const session = getSession(req);

  if (!session) {
    res.status(401).send(responseTypes.Err('No session.'));
  }

  if(!req.body.destination) {
    return res.send(responseTypes.Err('No shortlink/destination.'));
  }

  const shortlink = req.body.shortlink ? req.body.shortlink : genRandomString(8);
  
  users.getUserIdBySession(session)
    .then((user_id) => {
      if (!user_id === -1) {
        return res.status(401).send(responseTypes.Err('Invalid session.'));
      }

      urls.newUrl(user_id, shortlink, req.body.destination)
        .then(() => {
          res.status(200).send(responseTypes.Success({
            shortlink,
            destination: req.body.destination
          }));
        }).catch((err) => {
          res.send(responseTypes.Err(err));
        });
    });
});

router.put('/update', (req, res) => {
  const session = getSession(req);

  if (!session) {
    res.status(401).send(responseTypes.Err('No session.'));
  }

  if(!req.body.urlId) {
    res.send(responseTypes.Err('No URL ID.'));
  }

  if(!req.body.destination || !req.body.shortlink) {
    res.send(responseTypes.Err('You need something to update!'));
  }

  users.getUserIdBySession(session)
    .then((user_id) => {
      if (!user_id === -1) {
        return res.status(401).send(responseTypes.Err('Invalid session.'));
      }

      urls.updateUrlById(req.body.urlId, req.body.shortlink, req.body.destination)
        .then(() => {
          res.status(200).send(responseTypes.Success({
            shortlink: req.body.shortlink,
            destination: req.body.destination
          }));
        }).catch((err) => {
          res.send(responseTypes.Err(err));
        });
    });
});

router.delete('/delete', (req, res) => {
  const session = getSession(req);

  if (!session) {
    res.status(401).send(responseTypes.Err('No session.'));
  }

  if(!req.body.urlId) {
    res.send(responseTypes.Err('Missing urlId.'));
  }

  users.getUserIdBySession(session)
    .then((user_id) => {
      if (!user_id === -1) {
        return res.status(401).send(responseTypes.Err('Invalid session.'));
      }

      urls.deleteUrlById(req.body.urlId)
        .then(() => {
          res.status(200).send(responseTypes.Success());
        }).catch((err) => {
          res.send(responseTypes.Err(err));
        }); 
    });
});

// export our router to be mounted by the parent application
module.exports = router;
