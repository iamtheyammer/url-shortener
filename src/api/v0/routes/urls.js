const Router = require('express-promise-router');
const responseTypes = require('../../../utils/apiResponseTypes');
const genRandomString = require('../../../utils/random');
const urls = require('../db/urls');
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

router.use((req, res, next) => {
  next();
});

router.get('/getAll', (req, res) => {
  if (!req.user.validAuth) return responseTypes.Unauthorized(res);

  urls.getAll()
    .then((urls) => {
      res.status(200).send(responseTypes.Success({
        urls
      }));
    }).catch((err) => {
      console.log(err);
      res.send(responseTypes.Err('There was an error.'));
    });
});

router.get('/getByShortlink', (req, res) => {
  if(!req.user.validAuth) return responseTypes.Unauthorized(res);

  if(!req.query.shortlink) return responseTypes.BadRequest(
    'You need a shortlink query param.',
    res
  );

  urls.getByShortlink(req.query.shortlink)
    .then((shortlink) => {
      if(shortlink) return res.send(responseTypes.Success(shortlink));
      return res.send(responseTypes.Err('No shortlink found.'));
    });
});

router.post('/new', (req, res) => {
  if (!req.user.validAuth) return responseTypes.Unauthorized(res);

  if(!req.body.destination) {
    return res.send(responseTypes.Err('No shortlink/destination.'));
  }

  if(!req.body.destination.match(urlRegex)) {
    return responseTypes.Err('The specified destination is not valid.', res);
  }

  const shortlink = req.body.shortlink ? req.body.shortlink : genRandomString(8);
  
  if (!shortlink.match(/[a-zA-Z0-9]{ 3, }/)) {
    if ((shortlink.match(/[a-zA-Z0-9]{1,}/) && req.user.isSuperAdmin === true)) 
    {
      // no worries :)
    } else {
      return responseTypes.BadRequest(
        'Invalid shortlink. Shortlinks may be uppercase and lowercase letters and ' +
        'numbers only. For non-super-admins, they also need to be at least 3 characters.',
        res
      );
    }
  }

  urls.newUrl(req.user.id, shortlink, req.body.destination)
    .then(() => {
      res.status(200).send(responseTypes.Success({
        shortlink,
        destination: req.body.destination
      }));
    }).catch((err) => {
      if(err.code === '23505') {
        return responseTypes.Err(
          'A shortlink with this ID already exists.',
          res
        );
      }
      return responseTypes.Err(err, res);
    });
});

router.put('/update', (req, res) => {
  if (!req.user.validAuth) return responseTypes.Unauthorized(res);

  if(!req.body.urlId) {
    return responseTypes.Err('No URL ID.', res);
  }

  if(!req.body.destination && !req.body.shortlink) {
    return res.send(responseTypes.Err('You need something to update!'));
  }

  urls.updateById(req.body.urlId, req.body.shortlink, req.body.destination)
    .then((dbResult) => {
      switch (dbResult.rowCount) {
        case 0: 
          return responseTypes.Err(
            'That urlId doesn\'t exist.',
            res
          );
        case 1:
          return responseTypes.Success(
            {
              shortlink: req.body.shortlink,
              destination: req.body.destination
            },
            res
          );
        default:
          return responseTypes.Err(null, res);  
      }
    }).catch((err) => {
      if(err.code === '22P02') return responseTypes.Err(
        'urlId must be a number.',
        res
      );
      return res.send(responseTypes.Err(err));
    });
});

router.delete('/delete', (req, res) => {
  if (!req.user.validAuth) return responseTypes.Unauthorized(res);

  if(!req.body.urlId) {
    return res.send(responseTypes.Err('Missing urlId.'));
  }

  urls.deleteById(req.body.urlId)
    .then(() => {
      return res.status(200).send(responseTypes.Success());
    }).catch((err) => {
      return res.send(responseTypes.Err(err));
  });
});

// export our router to be mounted by the parent application
module.exports = router;
