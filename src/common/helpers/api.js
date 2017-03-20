import fetch from 'isomorphic-fetch';

const apiHost = 'https://api.themoviedb.org/3';
const apiKey = '22da2b00277a56c61e1490ce0fd093b5';

const get = (url, params) => {
  let urlParams = `api_key=${apiKey}`;
  if (params) {
    Object.keys(params).forEach((key) => {
      urlParams += `&${key}=${params[key]}`;
    });
  }
  return fetch(`${apiHost + url}?${urlParams}`)
    .then(response => response.json().then(json => ({ json, response })))
    .then(({ json, response }) => !response.ok ? Promise.reject(json) : json)
    .then(res => ({ res }), error => ({ error }));
};

const post = (url, data) =>
  fetch(apiHost + url, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    cache: 'default',
    body: JSON.stringify(data)
  }).then(response => response.json().then(json => ({ json, response })))
    .then(({ json, response }) => !response.ok ? Promise.reject(json) : json)
    .then(res => ({ res }), error => ({ error }));

export default {
  get,
  post
};
