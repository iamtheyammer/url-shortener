/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  switch (req.type) {
    case 'NEW_TAB':
      chrome.tabs.create({
        url: req.data.url,
        active: true
      });
      sendResponse();
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
  if (session) xhttp.setRequestHeader('session', session);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(data);
}