import React from 'react';
import qs from 'query-string';

import JobEdit from './jobs-edit';
import urlPaths from '../lib/url_paths';
// import Auth from '../lib/authService';
import { post } from '../lib/requests';

import '../styles/default.scss';

export default class JobCreateView extends React.Component {
  constructor(props) {
    super(props);
    // this.auth = new Auth();
    this.saveJob = this.saveJob.bind(this);
    this.cancelJob = this.cancelJob.bind(this);
    this.back = this.back.bind(this);
  }
  
  saveJob(jobStr) {
    jobStr.dashboard = this.props.match.params.dashboard;
    jobStr.tasks = JSON.stringify(jobStr.tasks);
    post(
      urlPaths.jobs.post.create(),
      { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${this.props.auth.getToken()}` },
      qs.stringify(jobStr)
    );
    this.back();
  }
  
  cancelJob() {
    this.back();
  }
  
  back() {
    if (this.props.history) {
      this.props.history.goBack();
      return;
    }
    window.location.assign(urlPaths.jobs.get.jobs());
  }
  
  render() {
    return (
      <JobEdit 
        history={this.props.history} 
        onSave={this.saveJob} 
        onCancel={this.cancelJob}
        onDelete={this.deleteJob}
      />
    );
  }
}
