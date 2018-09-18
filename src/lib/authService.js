import decode from 'jwt-decode';
import cookies from 'browser-cookies';
import {
  post,
  get,
} from './requests';
import { getURLQueryFromObject } from './utils';

export default class AuthService {
  constructor(domain) {
    this.domain = domain || 'localhost:3000';
  }
  
  login(username, password, cb) {
    // Get a token from api server using the fetch api
    this.fetch(`http://${this.domain}/users/login`, {
      method: 'POST',
      data: {
        username,
        password,
      },
    }, null, (xhttp) => {
      const res = JSON.parse(xhttp.responseText);
      // this.setToken(res.token);
      if (cb)
        cb(res.token);
    });
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000)
        return true;
      return false;
    } catch (err) {
      return false;
    }
  }

  /* setToken(token) {
    localStorage.setItem('id_token', token);
    cookies.set('access_token', token, {expires: new Date(Date.now() + 20 * 60 * 1000), domain: this.domain, path: '/'});
  } */

  getToken() {
    return cookies.get('access_token');
    // return localStorage.getItem('id_token');
  }

  logout() {
    cookies.erase('access_token');
    // localStorage.removeItem('id_token');
  }

  getProfile() {
    return decode(this.getToken());
  }

  fetch(url, options, contentType, cb) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': contentType || 'application/x-www-form-urlencoded',
    };

    if (this.loggedIn())
      headers['Authorization'] = `Bearer ${this.getToken()}`;
    let data = options.data;
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded')
      data = getURLQueryFromObject(options.data);
    const checkForSuccess = (xhttp) => {
      if (xhttp.status >= 200 && xhttp.status < 300) {
        if (cb) cb(xhttp);
      } else {
        const err = new Error(xhttp.statusText);
        err.response = xhttp;
        throw err;
      }
    };
    
    if (options.method === 'POST')
      post(url, headers, data, checkForSuccess);
    else if (options.method === 'GET')
      get(url, headers, checkForSuccess);
  }
}
