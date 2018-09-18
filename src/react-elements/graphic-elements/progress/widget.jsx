import React from 'react';

import './styles.scss';

export default class MultipleProgress extends React.Component {
  constructor(props) {
    super(props);
    this.defaultThresholds = {};
    this.defaultThresholds[Number.MAX_SAFE_INTEGER] = 'ffffff';
  }

  getValue(actual, max, min) {
    const m = min || 0;
    const M = max || 100;
    return ((actual - m) / (M - m)) * 100;
  }

  getColorWithAlpha(color, alpha, str) {
    let result = '';
    if (this.checkIfRGBHexColor(color, str)) {
      if (str)
        return color + alpha;
      result = color + alpha;
    } else
      result = `ffffff${alpha}`;
    if (!str) {
      return result;
    }
    return `#${result}`;
  }

  getProgressDoneColor(color, str) {
    return this.getColorWithAlpha(color, 'bb', str);
  }

  getProgressUndoneColor(color, str) {
    return this.getColorWithAlpha(color, '44', str);
  }
  
  getThresholdColor(value) {
    const thresholds = /* this.props.thresholdsColors || */this.defaultThresholds;
    return thresholds[Object.keys(thresholds).find(k => parseInt(k, 10) >= value)];
  }

  checkIfRGBHexColor(color, str) {
    if (!str)
      return /[A-Fa-f0-9]{6}/.test(color);
    return /^#[A-Fa-f0-9]{6}$/.test(color);
  }
  
  render() {
    const undoneFloat = {
      left: 'right',
      right: 'left',
    };
    let widthDone = this.getValue(this.props.value, this.props.max, this.props.min);
    let widthUndone = 100 - widthDone;
    widthDone = `${widthDone}%`;
    widthUndone = `${widthUndone}%`;
    const doneFloat = this.props.float || 'left';
    const backCol = this.getThresholdColor(this.props.value);
    
    return (
      <div className="progress_container">
        <div className="progress_done" style={{ width: widthDone, float: doneFloat, backgroundColor: this.getProgressDoneColor(backCol, true) }} />
        <div 
          className="progress_undone" 
          style={{ width: widthUndone, float: undoneFloat[doneFloat], backgroundColor: this.getProgressUndoneColor(backCol, true) }} 
        />
      </div>
    );
  }
}
