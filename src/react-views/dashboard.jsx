import React from 'react';

import DashTreeHandler from '../lib/dashTreeHandler';
import Dashboard from '../widgets/dashboard';

import '../styles/default.scss';

export default class DashboardView extends React.Component {
  constructor(props) {
    super(props);
    this.dashboard = this.props.match.params.dashboard;
  }
  
  render() {
    (new DashTreeHandler()).addElement();
    return (<Dashboard title={this.dashboard || 'index2'} name="dash" key="dash" />);
  }
}
// window.location.href.substr(window.location.href.lastIndexOf('/') + 1)
