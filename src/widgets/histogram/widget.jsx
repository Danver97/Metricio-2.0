import React from 'react';
import Highcharts from 'highcharts';
import { withHighcharts } from 'react-jsx-highcharts';

import Widget from './histogram';

export default class HistogramWidget extends React.Component {
  constructor(props) {
    super(props);
  }
  
  static get layout() {
    return {
      x: 0,
      y: 0,
      w: 4,
      h: 5,
      minH: 7,
      maxH: 12,
      minW: 4,
      maxW: 12,
    };
  }
  
  render() {
    return ((withHighcharts(Widget, Highcharts))(this.props));
  }
}
