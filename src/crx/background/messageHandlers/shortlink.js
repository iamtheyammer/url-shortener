/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  switch (req.type) {
    case 'SHORTLINK_CREATE':
      chrome.storage.sync.get(['session', 'server_url'], (storage) => {
        makeXhr(
          'POST',
          'https://' + storage['server_url'] + '/api/v0/urls/new',
          JSON.stringify({
            shortlink: req.data.shortlink,
            destination: req.data.destination,
          }),
          storage.session,
          (response) => {
            if (response.data.success === false || response.statusCode !== 200) {
              return sendResponse({
                type: 'SHORTLINK_CREATE_ERROR',
                error: {
                  message: response.data.message ? response.data.message : 'Couldn\'t find server.'
                }
              });
            }

            return sendResponse({
              type: 'SHORTLINK_CREATE_SUCCESS',
              data: {
                url: 'https://' + storage['server_url'] + '/' + response.data.data.shortlink,
                shortlink: response.data.data.shortlink,
                destination: response.data.data.destination
              }
            });
          }
        );
      });
      break;
    default:
      // should be handeled somewhere else
      break;
  }
  return true;
});

function makeXhr(method, url, data, session, callback) {
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
  if(session) xhttp.setRequestHeader('session', session);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(data);
}