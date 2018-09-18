import React from 'react';

import DefaultFrame from '../react-elements/default-frame/widget';
import urlPaths from '../lib/url_paths';
import { getJobsStructWithTitle } from '../lib/titledTableStructures';
// import { get, post } from '../../lib/requests';

import '../styles/default.scss';

export default class JobsList extends React.Component {
  constructor(props) {
    super(props);
    this.back = this.back.bind(this);
  }
  
  back() {
    if (this.props.history) {
      this.props.history.goBack();
      this.props.history
        .replace(urlPaths.dashboard.get.dashboard(this.props.match.params.dashboard));
      return;
    }
    window.location.assign(urlPaths.dashboard.get.dashboard(this.props.match.params.dashboard));
  }
  
  render() {
    const dashboardName = this.props.match.params.dashboard;
    let title = 'All your jobs';
    let btnTitle = null;
    let btnLink = null;
    if (dashboardName) {
      title = `All jobs of ${dashboardName}`;
      btnTitle = 'Add New';
      btnLink = urlPaths.jobs.get.create(dashboardName);
    }
    return (
      <DefaultFrame 
        title="Jobs" 
        history={this.props.history} 
        titledTables={[ 
          getJobsStructWithTitle(title, dashboardName, btnTitle, btnLink), 
        ]} 
      />
    );
  }
}
