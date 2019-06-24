const byId = (id) => document.getElementById(id);

const writeError = (err) => byId('form-error').innerHTML = err;
