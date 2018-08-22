export default function request(method, url, async, headers, data, cb) {
  return new Promise((resolve, reject) => {
    // console.log(url);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        if (cb) cb(this);
        resolve(this);
      }
    };
    xhttp.open(method, url, async);
    if (headers) {
      if(Array.isArray(headers))
        headers.forEach((header) => xhttp.setRequestHeader(header.tag, header.value));
      if(typeof headers === 'object')
        Object.keys(headers).forEach(k => xhttp.setRequestHeader(k, headers[k]));
    }
    if (data) xhttp.send(data);
    else xhttp.send();
  });
}

  

export function post(url, headers, data, cb) {
  return request('POST', url, true, headers, data, cb);
}

export function postSync(url, headers, data, cb) {
  return request('POST', url, false, headers, data, cb);
}

export function get(url, headers, cb) {
  return request('GET', url, true, headers, null, cb);
}

export function getSync(url, headers, cb) {
  return request('GET', url, false, headers, null, cb);
}
