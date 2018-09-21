import BaseJob from './util/baseJob';
import Task from './util/task';

const taskTypes = {
  number: 'addTaskNumber',
  numberMinMax: 'addTaskNumberMinMax',
  numberInt: 'addTaskNumberInt',
  numberIntSerie: 'addTaskNumberIntSerie',
  graphSerie: 'addTaskGraphSerie',
  text: 'addTaskText',
};

function getRandom(min, max) {
  return (Math.random() * ((max - min) + 1)) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

function getRandomIntSerie(iterations, min, max) {
  return Array.from({ length: iterations }, () => getRandomInt(min, max));
}

function getRandomMinMax(iterations) {
  return Array.from({ length: iterations }, (e, i) => {
    let min = getRandomInt(0, 100);
    if (getRandom(0, 1) > 0.5)
      min = 0;
    let max = getRandomInt(0, 100);
    if (min >= max) {
      max = 100;
    }
    
    const actual = getRandomInt(min, max);
    if (getRandom(0, 1) > 0.5)
      return { actual, name: `Tool ${i}` };
    return {
      name: `Tool ${i}`,
      min,
      max,
      actual,
    };
  });
}

function getRandomText(texts, propabilities) {
  if (!propabilities) {
    return texts[getRandomInt(0, texts.length - 1)];
  }
  if (propabilities.length < texts.length + 1)
    propabilities.push(2);
  const prob = Math.random();
  for (let i = 1; i < propabilities.length; i++) {
    if (prob < propabilities[i - 1])
      return texts[i - 1];
    if (prob < propabilities[i] && prob >= propabilities[i - 1])
      return texts[i];
  }
  return 'no text';
}

export class LocalJob extends BaseJob {
  constructor(jobName, interval) {
    super(jobName, interval);
  }
  
  static get className() {
    return 'LocalJob';
  }
  
  static fromObject(job, vars) {
    const localJob = new LocalJob(job.jobName, job.interval);
    job.tasks.forEach(t => {
      const taskAddMethod = taskTypes[t.type];
      localJob[taskAddMethod](t.taskName, t.task, vars);
    });
    return localJob;
  }
  
  addTaskNumber(taskName, task, vars) {
    const t = task || {};
    const min = this.getValue(t.min, vars) || 0;
    const max = this.getValue(t.max, vars) || 100;
    const taskObj = {
      target: taskName,
      execute: () => getRandom(min, max),
    };
    const taskobj = new Task(taskObj);
    this.tasks.push(taskobj);
  }
  
  addTaskNumberMinMax(taskName, task, vars) {
    const t = task || {};
    const iterations = this.getValue(t.iterations, vars) || 4;
    const taskObj = {
      target: taskName,
      execute: () => getRandomMinMax(iterations),
    };
    const taskobj = new Task(taskObj);
    this.tasks.push(taskobj);
  }
  
  addTaskNumberInt(taskName, task, vars) {
    const t = task || {};
    const min = this.getValue(t.min, vars) || 0;
    const max = this.getValue(t.max, vars) || 100;
    const taskObj = {
      target: taskName,
      execute: () => getRandomInt(min, max),
    };
    const taskobj = new Task(taskObj);
    this.tasks.push(taskobj);
  }
  
  addTaskNumberIntSerie(taskName, task, vars) {
    const t = task || {};
    const min = this.getValue(t.min, vars) || 0;
    const max = this.getValue(t.max, vars) || 100;
    const iterations = this.getValue(t.iterations, vars) || 50;
    const taskObj = {
      target: taskName,
      execute: () => getRandomIntSerie(iterations, min, max),
    };
    const taskobj = new Task(taskObj);
    this.tasks.push(taskobj);
  }
  
  addTaskGraphSerie(taskName, task, vars) {
    const t = task || {};
    const min = this.getValue(t.min, vars) || 0;
    const max = this.getValue(t.max, vars) || 100;
    const iterations = this.getValue(t.iterations, vars) || 50;
    const taskObj = {
      target: taskName,
      execute: () => ({
        categories: t.categories,
        series: t.seriesNames.map(s => ({
          name: s,
          data: getRandomIntSerie(iterations, min, max),
        })),
      }), 
    };
    const taskobj = new Task(taskObj);
    this.tasks.push(taskobj);
  }
  
  addTaskText(taskName, task, vars) {
    const t = task || {};
    const texts = this.getValue(t.texts, vars) || ['success', 'fail'];
    let probabilities = this.getValue(t.probabilities, vars) || [0.75, 0.25];
    if (!t.texts)
      probabilities = [0.5, 0.5];
    let probs = null;
    if (probabilities) {
      let currentProb = 0;
      probs = probabilities.map(p => {
        currentProb += p;
        return currentProb;
      });
    }
    const taskObj = {
      target: taskName,
      execute: () => getRandomText(texts, probs),
    };
    const taskobj = new Task(taskObj);
    this.tasks.push(taskobj);
  }
}
