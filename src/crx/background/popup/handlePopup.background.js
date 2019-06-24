/* eslint-disable no-undef */
chrome.storage.sync.get('signed_in', (data) => {
  if (data.signed_in === true) {
    chrome.browserAction.setPopup({ popup: '/popup/default/default.html' });
  } else {
    chrome.browserAction.setPopup({ popup: '/popup/login/login.html' });
  }
});