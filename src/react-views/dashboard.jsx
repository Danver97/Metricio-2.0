import React from 'react';

import DashTreeHandler from '../lib/dashTreeHandler';
import Dashboard from '../widgets/dashboard';
import urlPaths from '../lib/url_paths';
import { post } from '../lib/requests';

import '../styles/default.scss';

export default class DashboardView extends React.Component {
  constructor(props) {
    super(props);
    if (this.dashboard !== this.props.match.params.dashboard)
      this.dashboard = this.props.match.params.dashboard;
    this.onSave = this.onSave.bind(this);
    this.onJob = this.onJob.bind(this);
    this.onNewWidget = this.onNewWidget.bind(this);
  }
  
  onSave(dashStr) {
    const structure = JSON.stringify(dashStr, (k, v) => (k === 'socket' ? undefined : v));
    post(
      urlPaths.dashboard.post.save(dashStr.name), 
      { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${this.props.auth.getToken()}` }, 
      `layout=${structure}`
    );
  }
  
  onJob() {
    if (this.props.history) {
      this.props.history.push(urlPaths.jobs.get.jobs());
      return;
    }
    window.location.assign(urlPaths.jobs.get.jobs());
  }
  
  onNewWidget() {
    if (this.props.history) {
      this.props.history.push(urlPaths.dashboard.get.newWidget(this.dashboard));
      return;
    }
    window.location.assign(urlPaths.dashboard.get.newWidget(this.dashboard));
  }
  
  render() {
    if (this.dashboard !== this.props.match.params.dashboard)
      this.dashboard = this.props.match.params.dashboard;
    const dth = new DashTreeHandler();
    dth.addElement(dth.newElement(this.dashboard));
    return (
      <Dashboard 
        history={this.props.history} 
        title={this.dashboard || 'index2'} 
        name="dash" 
        key="dash" 
        onSave={this.onSave} 
        onJob={this.onJob} 
        onAddPanel={this.onNewWidget} 
        editUrl={urlPaths.dashboard.get.edit(this.dashboard)} 
      />
    );
  }
}
