function getSession(req) {
  if(req.headers['session']) {
    return req.headers['session'];
  }

  if(req.cookies.session) {
    return req.cookies.session;
  }

  return null;
}

module.exports = getSession;