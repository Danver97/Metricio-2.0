import React from 'react';

import JobEdit from '../react-views/jobs-edit';
import urlPaths from '../lib/url_paths';
// import Auth from '../lib/authService';
import { get, post } from '../lib/requests';

import '../styles/default.scss';

export default class JobEditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobStructure: null,
    };
    
    this.saveJob = this.saveJob.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
    this.cancelJob = this.cancelJob.bind(this);
    this.back = this.back.bind(this);
  }
  
  componentDidMount() {
    const jobName = this.props.match.params.jobName;
    get(
      urlPaths.jobs.get.job(jobName),
      { Accept: 'application/json', Authorization: `Bearer ${this.props.auth.getToken()}` },
      xhttp => {
        const response = JSON.parse(xhttp.responseText);
        this.setState({ jobStructure: response });
      }
    );
  }
  
  saveJob(jobStr) {
    const jobName = this.props.match.params.jobName;
    post(
      urlPaths.jobs.post.update(jobName),
      { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${this.props.auth.getToken()}` }, 
      `jobName=${jobStr.jobName}&interval=${jobStr.interval}&type=${jobStr.type}&tasks=${JSON.stringify(jobStr.tasks)}`
    );
    this.back();
  }
  
  deleteJob() {
    const jobName = this.props.match.params.jobName;
    post(
      urlPaths.jobs.post.delete(jobName),
      { Authorization: `Bearer ${this.props.auth.getToken()}` },
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
        jobStructure={this.state.jobStructure} 
        history={this.props.history} 
        onSave={this.saveJob} 
        onCancel={this.cancelJob}
        onDelete={this.deleteJob}
      />
    );
  }
}
