byId('form-submit').addEventListener('click', (e) => {
  e.preventDefault();
  const details = {
    url: byId('server-url').value,
    email: byId('login-email').value,
    password: byId('login-password').value
  };

  if(!details.url) return writeError('No URL.');
  if(!details.email) return writeError('No email.');
  if(!details.password) return writeError('No password.');

  writeError('Loading...');

  chrome.runtime.sendMessage({
    type: 'LOGIN_SUBMIT_USER_DETAILS',
    data: details
  }, (response) => {
    debugger;
    switch (response.type) {
      case 'LOGIN_SUBMIT_USER_DETAILS_SUCCESS':
        writeError('Success! Click on the extension to get started.');
        break;
      case 'LOGIN_SUBMIT_USER_DETAILS_ERROR':
        writeError('There was an error: ' + response.error.message);
    }
  });
});