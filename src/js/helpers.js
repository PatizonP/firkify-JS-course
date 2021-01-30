import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';
import { uploadRecipe } from './model.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     // const res = await fetch(url);
//     const data = await res.json();

//     //If the response from server is not OK, then we use error message from this server.
//     if (!res.ok) throw Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // const res = await fetch(url);
    const dataJson = await res.json();
    //If the response from server is not OK, then we use error message from this server.
    if (!res.ok) throw Error(`${dataJson.message} (${res.status})`);
    return dataJson;
  } catch (err) {
    throw err;
  }
};
// export const sendJSON = async function (url, data) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     // const res = await fetch(url);
//     const dataJson = await res.json();

//     //If the response from server is not OK, then we use error message from this server.
//     if (!res.ok) throw Error(`${dataJson.message} (${res.status})`);
//     return dataJson;
//   } catch (err) {
//     throw err;
//   }
// };
