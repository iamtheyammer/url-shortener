/* eslint-disable no-undef */

chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
  byId('form-destination').value = tabs[0].url;
});

byId('form-submit').addEventListener('click', (e) => {
  e.preventDefault();

  const details = {
    destination: byId('form-destination').value,
    shortlink: byId('form-shortlink').value
  };

  if (!details.destination) return writeError('No destination specified.');
  // no shortlink is ok-- the server will generate one
  writeError('Creating...');
  chrome.runtime.sendMessage({
    type: 'SHORTLINK_CREATE',
    data: details
  }, response => {
    switch (response.type) {
      case 'SHORTLINK_CREATE_SUCCESS':
        byId('form').style.display = 'none';
        byId('success-shortlink-url').innerHTML = 
          '<a id="success-shortlink-link" href="' + response.data.url +
          '">' + response.data.url + '</a>';
        byId('success-shortlink-copy').value = response.data.url;
        byId('success-shortlink-url').addEventListener('click', handleLinkClick);
        byId('success-copy-shortlink').addEventListener('click', copyShortlinkToClipboard);
        byId('success').style.display = 'block';
        break;
      case 'SHORTLINK_CREATE_ERROR':
        writeError('There was an error: ' + response.error.message);
        break;
    }
  });
});

function copyShortlinkToClipboard(e) {
  e.preventDefault();
  byId('success-shortlink-copy').select();
  document.execCommand('copy');
}

function handleLinkClick(e) {
  e.preventDefault();
  chrome.runtime.sendMessage({
    type: 'NEW_TAB',
    data: {
      url: e.target.href
    }
  });
}