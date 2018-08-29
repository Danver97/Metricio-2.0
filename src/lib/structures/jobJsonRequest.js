import qs from 'query-string';
import fetch from 'node-fetch';

export default class JobJsonRequest {
  constructor(jobname, interval) {
    this.jobName = jobname;
    this.interval = interval;
    this.requests = [];
    this.perform = async function () {
      const results = [];
      let promises = [];
      this.requests.forEach(r => {
        promises.push(fetch(r.endpoint, {
          method: r.method,
          headers: r.headers,
          body: r.body,
        }));
      });
      promises = Promise.all(promises);
      promises.forEach((result, i) => {
        results.push({
          target: results[i].target,
          data: { value: result },
        });
      });
      return results;
    };
    this.perform = this.perform.bind(this);
  }
  
  addJsonRequest(target, endpoint, options) {
    this.requests.push({
      target,
      endpoint,
      method: options.method,
      body: options.body,
      headers: options.headers,
    });
  }
  
  addGetRequest(target, endpoint, options) {
    this.requests.push({
      target,
      endpoint: `${endpoint}?${qs.stringify(options.query)}`,
      method: 'GET',
      body: null,
      headers: options.headers,
    });
  }
  
  addPostRequest(target, endpoint, options) {
    this.requests.push({
      target,
      endpoint: `${endpoint}`,
      method: 'POST',
      body: options.body,
      headers: options.headers,
    });
  }
  
  getJob() {
    const job = {};
    job[this.jobName] = { interval: this.interval, perform: this.perform }
  }
}
