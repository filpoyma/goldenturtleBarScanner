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

  static async post(url, data) {
    try {
      return {data: await request(url, 'POST', data), err: null};
    } catch (err) {
      console.warn(`POST Error:`, err.message);
      return { data: null, err: err.message };
    }
  }

  static async put(url, data) {
    return await request(url, 'PUT', data).catch((error) => console.log(`PUT ${url} error - ${error}`));
  }

  static async patch(url, data) {
    return await request(url, 'PATCH', data).catch((error) => console.log(`PATCH ${url} error - ${error}`));
  }

  static async delete(url, data) {
    return await request(url, 'DELETE', data).catch((error) => console.log(`DELETE ${url} error - ${error}`));
  }
}

function handleError(res)  {
  if (!res.ok) throw Error(res.statusText);
};

async function request(url, method = 'GET', data) {
  const config = {
    method
  };
  if (method === 'POST' || method === 'PATCH' || method === 'DELETE' || method === 'PUT') {
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
