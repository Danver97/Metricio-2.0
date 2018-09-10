import qs from 'query-string';
import fetch from 'node-fetch';

import JobStructure from './jobStructure';

function project(obj, projection) {
  if (typeof projection === 'string')
    return obj[projection];
  if (Array.isArray(projection)) {
    const result = {};
    projection.forEach(p => { result[p] = obj[p]; });
    return result;
  }
  return obj;
}

async function perform(self) {
  const results = [];
  let promises = [];
  self.requests.forEach(r => {
    promises.push(fetch(r.endpoint, {
      method: r.method,
      headers: r.headers,
      body: r.body,
    }));
  });
  promises = await Promise.all(promises);
  promises.forEach((result, i) => {
    results.push({
      target: self.requests[i].target,
      data: { value: project(result, self.requests[i].projection) },
    });
  });
  return results;
}

export class JobJsonRequest extends JobStructure {
  constructor(jobname, interval) {
    super(jobname, interval);
    this.requests = [];
    // this.perform = () => perform(this);
    this.assignPerform(perform);
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
      method: opt.method || 'GET',
      body: opt.body,
      headers: opt.headers,
      projection: opt.projection,
    });
  }
  
  addGetRequest(target, endpoint, options) {
    const query = options.query ? `?${qs.stringify(options.query)}` : '';
    options.method = 'GET';
    options.body = null;
    this.addJsonRequest(target, `${endpoint}${query}`, options);
    /* this.requests.push({
      target,
      endpoint: `${endpoint}${query}`,
      method: 'GET',
      body: null,
      headers: options.headers,
    }); */
  }
  
  addPostRequest(target, endpoint, options) {
    options.method = 'POST';
    options.body = qs.stringify(options.body);
    this.addJsonRequest(target, endpoint, options);
    /* this.requests.push({
      target,
      endpoint,
      method: 'POST',
      body: qs.stringify(options.body),
      headers: options.headers,
    }); */
  }
}
