import React from 'react';

import DefaultFrame from '../../react-elements/default-frame/widget';
import urlPaths from '../../lib/url_paths';
import { getJobsStructWithTitle } from '../../lib/titledTableStructures';
// import { get, post } from '../../lib/requests';

import '../../styles/default.scss';

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
    return (
      <DefaultFrame 
        title="Jobs" 
        history={this.props.history} 
        titledTables={[
          getJobsStructWithTitle('All your jobs', 'Add New', urlPaths.jobs.get.create()),
        ]} 
      />
    );
  }
}
