import React from 'react';

import './styles.scss';

export default class MultipleProgress extends React.Component {
  constructor(props) {
    super(props);

    const defaultThresholds = {
      100: 'ffffff',
    }
    
    this.state = {
      value: this.props.value,
      max: this.props.max,
      thresholdsColors: this.props.thresholdsColors || defaultThresholds,
      float: this.props.float || 'left',
    };
  }

  getValue(actual, max) {
    const M = max || 100;
    return (actual / M) * 100;
  }

  checkIfRGBHexColor(color) {
    const regex = /[A-Fa-f0-9]{6}/;
    return regex.test(color);
  }

  getColorWithAlpha(color, alpha, str) {
    let result = '';
    if (this.checkIfRGBHexColor(color))
      result = color + alpha;
    else
      result = 'ffffff' + alpha;
    if(!str) {
      return result;
    }
    return '#' + result;
    
  }

  getProgressDoneColor(color, str) {
    return this.getColorWithAlpha(color, 'bb', str);
  }

  getProgressUndoneColor(color, str) {
    return this.getColorWithAlpha(color, '44', str);
  }
  
  getThresholdColor(value) {
    let thresholds = this.state.thresholdsColors;
    return this.state.thresholdsColors[Object.keys(thresholds).find(k => parseInt(k) >= value)];
  }
  
  render() {
    const undoneFloat = {
      left : 'right',
      right : 'left',
    }
    let widthDone = this.getValue(this.state.value, this.state.max);
    let widthUndone = 100 - widthDone;
    widthDone = widthDone + '%';
    widthUndone = widthUndone + '%';
    const doneFloat = this.state.float;
    const backCol = this.getThresholdColor(this.state.value);
    
    return (
      <div className="progress_container">
        <div className="progress_done" style={{width: widthDone, float: doneFloat, backgroundColor: this.getProgressDoneColor(backCol, true)}}></div>
        <div className="progress_undone" style={{width: widthUndone, float: undoneFloat[doneFloat], backgroundColor: this.getProgressUndoneColor(backCol, true)}}></div>
      </div>
    );
  }
}