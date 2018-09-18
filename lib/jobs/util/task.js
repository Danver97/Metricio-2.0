function getTaskResult(target, value) {
  return {
    target,
    data: {
      value,
    },
  };
}

export default class Task {
  constructor(target, execute) {
    this.validateParams(target, execute);
    if (target.target && target.execute) {
      this.target = target.target;
      this.executeFunc = target.execute;
    } else {
      this.target = target;
      this.executeFunc = execute;
    }
  }
  
  validateParams(target, execute) {
    if (!target) {
      throw new Error('Missing target parameter.');
    } else if (typeof target === 'object' && (!target.target || !target.execute)) {
      throw new Error('Missing property of object parameter.');
    } else if (typeof target === 'string' && !execute) {
      throw new Error('Missing execute parameter.');
    } else if (typeof target !== 'string' && typeof target !== 'object') {
      throw new Error('Wrong parameter target type.');
    }
  }
  
  execute() {
    const execResult = this.executeFunc();
    if (execResult instanceof Promise) {
      return new Promise(async (resolve, reject) => {
        try {
          const value = await execResult;
          resolve(getTaskResult(this.target, value));
        } catch (e) {
          reject(e);
        }
      });
    } else {
      return getTaskResult(this.target, execResult);
    }
  }
}
