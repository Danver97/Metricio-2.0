import React from 'react';

import ComponentStructure from '../lib/structures/component';
import DashboardEdit from '../react-views/dashboard-edit/widget';
import DefaultFrame from '../react-elements/default-frame/widget';
import urlPaths from '../lib/url_paths';
import { get, post } from '../lib/requests';

import '../styles/default.scss';

export default class DashboardEditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editChild: null,
    };
  }
  
  componentDidMount() {
    const query = this.props.location.search;
    const dashboard = this.props.match.params.dashboard;
    get(`${urlPaths.dashboard.get.getComponentStructure(dashboard)}${query}`, { Accept: 'application/json' }, xhttp => {
      const response = JSON.parse(xhttp.responseText);
      this.setState({ editChild: new ComponentStructure(response.type, response.attrs) });
    });
    this.saveEdit = this.saveEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.back = this.back.bind(this);
  }
  
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
      this.props.history
        .replace(urlPaths.dashboard.get.dashboard(this.props.match.params.dashboard));
      return;
    }
    window.location.assign(urlPaths.dashboard.get.dashboard(this.props.match.params.dashboard));
  }
  
  render() {
    return (
      <DefaultFrame history={this.props.history}>
        <DashboardEdit 
          cancelHandler={this.cancelEdit} 
          childStructure={this.state.editChild} 
          className="widget__edit" 
          history={this.props.history} 
          saveHandler={this.saveEdit} 
        />
      </DefaultFrame>
    );
  }
}
