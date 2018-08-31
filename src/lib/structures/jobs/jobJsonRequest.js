import qs from 'query-string';
import fetch from 'node-fetch';

import JobStructure from './jobStructure';

async function performFunc() {
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
}

export class JobJsonRequest extends JobStructure {
  constructor(jobname, interval) {
    super(jobname, interval);
    this.requests = [];
    this.perform = performFunc.bind(this);
  }
  
  static get className() {
    return 'JobJsonRequest';
  }
  
  static fromObject(job) {
    const jobJson = new JobJsonRequest(job.jobName, job.interval);
    job.tasks.forEach(t => {
      t.task = t.task || {};
      jobJson.addJsonRequest(t.taskName, t.task.endpoint, t.task.options);
    });
    return jobJson;
  }
  
  addJsonRequest(target, endpoint, options) {
    const opt = options || {};
    this.requests.push({
      target,
      endpoint,
      method: opt.method,
      body: opt.body,
      headers: opt.headers,
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
}
