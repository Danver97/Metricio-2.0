import React from 'react';
import qs from 'query-string';

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
    this.onVariable = this.onVariable.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }
  
  componentDidMount() {
    const variables = qs.parse(this.props.location.search) || {};
    post(
      urlPaths.dashboard.post.startParametrizedJobs(this.dashboard), 
      { Authorization: `Bearer ${this.props.auth.getToken()}`, 'Content-Type': 'application/x-www-form-urlencoded' }, 
      `variables=${JSON.stringify(variables)}`, 
      () => {}
    );
  }
  
  onRefresh(title, vars) {
    const variables = {};
    vars.filter(v => v.value && v.value !== 'no value').forEach(v => { variables[v.name] = v.value; });
    console.log('onRefresh');
    post(
      urlPaths.dashboard.post.stopParametrizedJobs(this.dashboard), 
      { Authorization: `Bearer ${this.props.auth.getToken()}`, 'Content-Type': 'application/x-www-form-urlencoded' }, 
      null, 
      () => {
        post(
          urlPaths.dashboard.post.startParametrizedJobs(title), 
          { Authorization: `Bearer ${this.props.auth.getToken()}`, 'Content-Type': 'application/x-www-form-urlencoded' }, 
          `variables=${JSON.stringify(variables)}`, 
          () => {}
        );
      }
    );
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
    this.redirect(urlPaths.jobs.get.jobs(this.dashboard));
  }
  
  onVariable() {
    this.redirect(urlPaths.dashboard.get.editVars(this.dashboard));
  }
  
  onNewWidget() {
    this.redirect(urlPaths.dashboard.get.newWidget(this.dashboard));
  }
  
  redirect(path) {
    if (this.props.history) {
      this.props.history.push(path);
      return;
    }
    window.location.assign(path);
  }
  
  render() {
    if (this.dashboard !== this.props.match.params.dashboard)
      this.dashboard = this.props.match.params.dashboard;
    const dth = new DashTreeHandler();
    dth.addElement(dth.newElement(this.dashboard));
    return (
      <Dashboard 
        history={this.props.history} 
        query={qs.parse(this.props.location.search)} 
        title={this.dashboard} 
        name="dash" 
        onSave={this.onSave} 
        onJob={this.onJob} 
        onAddPanel={this.onNewWidget} 
        onVariable={this.onVariable} 
        onRefresh={this.onRefresh} 
        editUrl={urlPaths.dashboard.get.edit(this.dashboard)} 
      />
    );
  }
}
