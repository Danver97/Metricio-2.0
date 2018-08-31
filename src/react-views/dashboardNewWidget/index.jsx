import React from 'react';

import DashboardEdit from '../dashboard-edit/widget';
import DefaultFrame from '../../react-elements/default-frame/widget';
import urlPaths from '../../lib/url_paths';
import { post } from '../../lib/requests';

import '../../styles/default.scss';

export default class DashboardNewWidget extends React.Component {
  constructor(props) {
    super(props);
    this.saveNew = this.saveNew.bind(this);
    this.cancelNew = this.cancelNew.bind(this);
    this.back = this.back.bind(this);
  }
  
  saveNew(childStr) {
    const structure = childStr.stringify();
    post(
      urlPaths.dashboard.post.newWidget(this.props.match.params.dashboard), [{
        tag: 'Content-Type',
        value: 'application/x-www-form-urlencoded',
      }],
      `structure=${structure}`
    );
    this.back();
  }
  
  cancelNew() {
    this.back();
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
      <DefaultFrame history={this.props.history}>
        <DashboardEdit className="widget__edit" saveHandler={this.saveNew} cancelHandler={this.cancelNew} />
      </DefaultFrame>
    );
  }
}
