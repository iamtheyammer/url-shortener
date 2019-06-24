/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  switch (req.type) {
    case 'LOGIN_SUBMIT_USER_DETAILS':
      makeXhr(
        'POST',
        'https://' + req.data.url + '/api/v0/users/newSession',
        JSON.stringify({
          email: req.data.email,
          password: req.data.password
        }),
        (response) => {

          console.log(response);
          if(response.data.success === false || response.statusCode !== 200) {
            return sendResponse({
              type: 'LOGIN_SUBMIT_USER_DETAILS_ERROR',
              error: {
                message: response.data.message ? response.data.message : 'Couldn\'t find server.'
              }
            });
          }

          chrome.storage.sync.set(
            {
              'session': response.data.data.sessionKey,
              'server_url': req.data.url,
              'signed_in': true
            }
            );
          chrome.browserAction.setPopup({ popup: '/popup/default/default.html' });
          return sendResponse({
            type: 'LOGIN_SUBMIT_USER_DETAILS_SUCCESS'
          });
        }
      );
      break;
    default:
      // should be handeled somewhere else
      break;
  }
  return true;
});

function makeXhr(method, url, data, callback) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      // Typical action to be performed when the document is ready:
      callback({
        statusCode: this.status,
        headers: this.getAllResponseHeaders(),
        data: JSON.parse(this.responseText)
      });
    }
  };
  xhttp.open(method, url, true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(data);
}