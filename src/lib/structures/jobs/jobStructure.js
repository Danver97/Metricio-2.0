export default class JobStructure {
  constructor(jobName, interval) {
    this.jobName = jobName;
    this.interval = interval;
    this.perform = () => {
      throw new Error('JobStructure: this.perform not implemented.');
    };
  }
  
  static get className() {
    throw new Error('JobStructure: this.className not implemented.');
  }
  
  static fromObject() {
    throw new Error('JobStructure: this.fromObject() not implemented.');
  }
  
  getJob() {
    const job = { jobName: this.jobName };
    job[this.jobName] = { interval: this.interval, perform: this.perform };
    return job;
  }
}
