import React from 'react';

import DashTreeHandler from '../lib/dashTreeHandler';
import Dashboard from '../widgets/dashboard';
import urlPaths from '../lib/url_paths';

import '../styles/default.scss';

export default class DashboardView extends React.Component {  
  render() {
    if (this.dashboard !== this.props.match.params.dashboard)
      this.dashboard = this.props.match.params.dashboard;
    // console.log(urlPaths.dashboard.get.edit(this.dashboard));
    (new DashTreeHandler()).addElement();
    return (
      <Dashboard 
        history={this.props.history} 
        title={this.dashboard || 'index2'} 
        name="dash" 
        key="dash" 
        editUrl={urlPaths.dashboard.get.edit(this.dashboard)} 
      />
    );
  }
}
