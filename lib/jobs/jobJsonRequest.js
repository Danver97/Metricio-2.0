import qs from 'query-string';
import fetch from 'node-fetch';

import BaseJob from './util/baseJob';
import Task from './util/task';

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

async function execute(self) {
  let err = null; 
  let json;
  const result = await fetch(self.endpoint, {
    method: self.method,
    headers: self.headers,
    body: self.body,
  });
  try {
    json = await result.json();
  } catch (e) {
    err = e;
    json = null;
  }
  console.log(json ? project(json, self.projection) : { error: err });
  return json ? project(json, self.projection) : { error: err };
}

export class JobJsonRequest extends BaseJob {
  constructor(jobname, interval) {
    super(jobname, interval);
  }
  
  static get className() {
    return 'JobJsonRequest';
  }
  
  static fromObject(job, vars) {
    const jobJson = new JobJsonRequest(job.jobName, job.interval);
    job.tasks.forEach(t => {
      t.task = t.task || {};
      jobJson.addJsonRequest(t.taskName, t.task.endpoint, t.task.options, vars || {});
    });
    return jobJson;
  }
  
  addJsonRequest(target, endpoint, options, vars) {
    const opt = options || {};
    const req = {
      target,
      endpoint: this.getValueAll(endpoint, vars),
      method: this.getValueAll(opt.method, vars) || 'GET',
      body: this.getValueAll(opt.body, vars),
      headers: this.getValueAll(opt.headers, vars),
      projection: this.getValueAll(opt.projection, vars),
    };
    req.execute = () => execute(req);
    const task = new Task(req.target, req.execute);
    this.tasks.push(task);
  }
  
  addGetRequest(target, endpoint, options, vars) {
    const query = options.query ? `?${qs.stringify(options.query)}` : '';
    options.method = 'GET';
    options.body = null;
    this.addJsonRequest(target, `${endpoint}${query}`, options, vars || {});
  }
  
  addPostRequest(target, endpoint, options, vars) {
    options.method = 'POST';
    options.body = qs.stringify(options.body);
    this.addJsonRequest(target, endpoint, options, vars || {});
  }
}
