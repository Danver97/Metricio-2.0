async function performBase(self) {
  const promises = [];
  const results = [];
  self.tasks.forEach(r => {
    const execResult = r.execute();
    if (execResult instanceof Promise)
      promises.push(execResult);
    else
      results.push(execResult);
  });
  const promisesResults = await Promise.all(promises);
  return results.concat(promisesResults);
}

export default class JobStructure {
  constructor(jobName, interval) {
    this.jobName = jobName;
    this.interval = interval;
    this.tasks = [];
    this.perform = () => performBase(this);
  }
  
  static get className() {
    throw new Error('JobStructure: this.className not implemented.');
  }
  
  static fromObject() {
    throw new Error('JobStructure: this.fromObject() not implemented.');
  }

  getValue(value, vars = {}) {
    if (/\$([\w-]+)/.test(value))
      return vars[/\$([\w-]+)/.exec(value)[1]] || value;
    return value;
  }

  getValueAll(value, vars = {}) {
    if (/\$([\w-]+)/.test(value)) {
      return value.replace(/\$([\w-]+)/g, (match, p1) => vars[p1] || match);
    }
    return value;
  }
  
  assignPerform(func) {
    this.perform = () => func(this);
  }
  
  getJob() {
    const job = { jobName: this.jobName };
    job[this.jobName] = { interval: this.interval, perform: this.perform };
    return job;
  }
}
