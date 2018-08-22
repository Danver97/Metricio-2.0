import React from 'react';

import DashTreeHandler from '../../../../lib/dashTreeHandler';

import './styles.scss';

export default class DashboardToolbarDashboardList extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    this.props.clickHandler();
  }
  
  dashListItemClick(name) {
    const dth = new DashTreeHandler();
    const current = dth.popAllUntil(name);
    window.location.assign(current.href);
  }

  render() {
    return (<div className="toolbar-dashboard-list">{this.props.children}</div>);
  }
}
