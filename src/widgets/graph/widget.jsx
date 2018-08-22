import React from 'react';
import Highcharts from 'highcharts';
import { withHighcharts } from 'react-jsx-highcharts';

import Widget from './graph';

export default class GraphWidget extends React.Component {
  constructor(props) {
    super(props);
  }
  
  static get layout() {
    return Widget.layout;
  }
  
  render() {
    return ((withHighcharts(Widget, Highcharts))(this.props));
  }
}
