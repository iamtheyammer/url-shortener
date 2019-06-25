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