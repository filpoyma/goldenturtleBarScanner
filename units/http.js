import fetch from 'cross-fetch';

export class Http {
  static HEADERS = { 'Content-Type': 'application/json' };

  static async get(url) {
    try {
    return {data: await request(url), err: null};
    } catch (err) {
      console.warn(`GET Error:`, err.message);
      return { data: null, err: err.message };
    }
  }

  static async getStatus(url) {
    try {
      return {data: await requestStatus(url), err: null};
    } catch (err) {
      console.warn(`GETStatus Error:`, err.message);
      return { data: false, err: err.message };
    }
  }

  static async post(url, data) {
    try {
      return {data: await request(url, 'POST', data), err: null};
    } catch (err) {
      console.warn(`POST Error:`, err.message);
      return { data: null, err: err.message };
    }
  }

}

function handleError(res)  {
  if (!res.ok) throw Error(res.statusText);
}

async function request(url, method = 'GET', data) {
  const config = {
    method
  };
  if (method === 'POST') {
    config.body = JSON.stringify(data);
    config.headers = Http.HEADERS;
  }
  const response = await Promise.race([
    fetch(url, config),
    new Promise((res, rej) => setTimeout(() => rej(new Error('Timeout')), 3000))
  ]);
  handleError(response);
  return response.json();
}

async function requestStatus(url) {
  const response = await Promise.race([
    fetch(url),
    new Promise((res, rej) => setTimeout(() => rej(new Error('Timeout')), 3000))
  ]);
  handleError(response);
  return response.ok;
}
