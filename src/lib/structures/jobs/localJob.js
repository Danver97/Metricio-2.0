import JobStructure from './jobStructure';

const taskTypes = {
  number: 'addTaskNumber',
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

function getRandomText(texts, propabilities) {
  if (!propabilities) {
    return texts[getRandomInt(0, texts.length - 1)];
  }
  if (propabilities.length < texts.length + 1)
    propabilities.push(2);
  console.log(propabilities);
  const prob = Math.random();
  console.log(prob);
  for (let i = 1; i < propabilities.length; i++) {
    if (prob < propabilities[i - 1])
      return texts[i - 1];
    if (prob < propabilities[i] && prob >= propabilities[i - 1])
      return texts[i];
  }
  return 'no text';
}

async function perform(self) {
  const result = [];
  self.tasks.forEach(t => {
    result.push({
      target: t.target,
      data: {
        value: t.execute(),
      },
    });
  });
  return result;
}

export class LocalJob extends JobStructure {
  constructor(jobName, interval) {
    super(jobName, interval);
    this.tasks = [];
    // this.perform = () => perform(this);
    this.assignPerform(perform);
  }
  
  static get className() {
    return 'LocalJob';
  }
  
  static fromObject(job) {
    const localJob = new LocalJob(job.jobName, job.interval);
    job.tasks.forEach(t => {
      const taskAddMethod = taskTypes[t.type];
      localJob[taskAddMethod](t.taskName, t.task);
    });
    return localJob;
  }
  
  addTaskNumber(taskName, task) {
    const t = task || {};
    const min = t.min || 0;
    const max = t.max || 100;
    const taskObj = {
      target: taskName,
      execute: () => getRandom(min, max),
    };
    this.tasks.push(taskObj);
  }
  
  addTaskNumberInt(taskName, task) {
    const t = task || {};
    const min = t.min || 0;
    const max = t.max || 100;
    const taskObj = {
      target: taskName,
      execute: () => getRandomInt(min, max),
    };
    this.tasks.push(taskObj);
  }
  
  addTaskNumberIntSerie(taskName, task) {
    const t = task || {};
    const min = t.min || 0;
    const max = t.max || 100;
    const iterations = t.iterations || 50;
    const taskObj = {
      target: taskName,
      execute: () => getRandomIntSerie(iterations, min, max),
    };
    this.tasks.push(taskObj);
  }
  
  addTaskGraphSerie(taskName, task) {
    const t = task || {};
    const min = t.min || 0;
    const max = t.max || 100;
    const iterations = t.iterations || 50;
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
    this.tasks.push(taskObj);
  }
  
  addTaskText(taskName, task) {
    const t = task || {};
    const texts = t.texts || ['success', 'fail'];
    let probabilities = t.probabilities || [0.75, 0.25];
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
    this.tasks.push(taskObj);
  }
}
