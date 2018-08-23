import React from 'react';

import DashboardEdit from '../react-views/dashboard-edit/widget';
import urlPaths from '../lib/url_paths';
import { post } from '../lib/requests';

import '../styles/default.scss';

export default class DashboardView extends React.Component {
  saveEdit(childStr) {
    const structure = childStr.stringify();
    post(
      urlPaths.dashboard.post.edit(this.props.match.params.dashboard), [{
        tag: 'Content-Type',
        value: 'application/x-www-form-urlencoded',
      }],
      `structure=${structure}`
    );
    this.back();
  }
  
  cancelEdit() {
    this.back();
  }
  
  back() {
    if (this.props.history) {
      this.props.history.goBack();
      return;
    }
    window.location.assign(urlPaths.dashboard.post.dashboard(this.props.match.params.dashboard));
  }
  
  render() {
    // return (<DashboardEdit childStructure={this.state.editChild} className="widget__edit" saveHandler={this.saveEdit} cancelHandler={this.cancelEdit} />);
    return [];
  }
}
