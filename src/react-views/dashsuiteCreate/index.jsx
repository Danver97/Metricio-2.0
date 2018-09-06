import React from 'react';
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledTooltip,
} from 'reactstrap';

import { post } from '../../lib/requests';
import urlPaths from '../../lib/url_paths';
import DefaultFrame from '../../react-elements/default-frame/widget';

import './styles.scss';

export default class CreateView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashsuitename: '',
      dashNamesFormElems: [],
      dashNames: [],
    };
    this.keycounter = 0;
    this.onDashboardAddClick = this.onDashboardAddClick.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onXClick = this.onXClick.bind(this);
    this.addDashName = this.addDashName.bind(this);
    this.onInput = this.onInput.bind(this);
  }
  
  onXClick(e, id) {
    e.stopPropagation();
    const dashNamesFormElems = this.state.dashNamesFormElems.filter(r => r.props.id !== id);
    const dashNames = this.state.dashNames.filter(e => e.id !== id);
    this.setState({
      dashNamesFormElems: dashNamesFormElems,
      dashNames: dashNames,
    });
  }
  
  onDashboardAddClick(e) {
    e.stopPropagation();
    const dashNamesFormElems = this.state.dashNamesFormElems.slice();
    const key = this.keycounter++;
    const node = (
      <FormGroup key={key} id={key} row>
        <Label for={'dashboardname' + key} hidden>Dashboard name:</Label>
        <Col sm={10} >
          <Input type="text" name="dashboardname" id={'dashboardname' + key} onInput={e => this.addDashName(e, key)} placeholder="Name" />
        </Col>
        <Col sm={2} >
          <Button onClick={e => this.onXClick(e, key)}>X</Button>
        </Col>
      </FormGroup>
    );
    dashNamesFormElems.push(node);
    this.setState({dashNamesFormElems: dashNamesFormElems});
  }
  
  addDashName(e, id) {
    const dashNames = this.state.dashNames.slice();
    let dashname = dashNames.filter(e => e.id === id)[0];
    if(!dashname){
      dashname = {};
      dashname.id = id;
      dashname.text = e.target.value;
      dashNames.push(dashname)
    } else {
      dashname.id = id;
      dashname.text = e.target.value;
    }
    console.log(dashNames);
    this.setState({dashNames: dashNames});
  }
  
  onInput(e) {
    const obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  }
  
  getDashStringList() {
    const result = JSON.stringify(this.state.dashNames.map(e => e.text));
    // console.log(result);
    return result;
  }
  
  onSave(e) {
    e.preventDefault();
    post(
      // '/dashsuites/create',
      urlPaths.dashsuites.post.create(),
      { 'Content-Type': 'application/x-www-form-urlencoded' }, 
      `name=${this.state.dashsuitename}&dashboards=${this.getDashStringList()}`
    );
    this.back();
  }
  
  onCancel(e) {
    e.preventDefault();
    this.back();
  }
  
  back() {
    if (this.props.history)
      this.props.history.goBack();
    if (this.props.cancelLink)
      window.location.assign(this.props.cancelLink);
  }
  
  render() {
    return (
      <DefaultFrame>
        <div className="createView">
          <h1>New Dashsuite</h1>
          <Form className="form" action="/">
            <FormGroup>
              <Label for="dashsuitename">Dashsuite name:</Label>
              <Input type="text" name="dashsuitename" id="dashsuitename" onInput={e => this.onInput(e)} placeholder="Name" />
            </FormGroup>
            <FormGroup>
              <Label>Dashboard names:</Label>
              {this.state.dashNamesFormElems}
              <Button onClick={e => this.onDashboardAddClick(e)} style={{display:'block'}}>Add new</Button>
            </FormGroup>
          </Form>
          <Button color="primary" onClick={e => this.onSave(e)}>Save</Button>
          <Button color="secondary" onClick={e => this.onCancel(e)}>Cancel</Button>
        </div>
      </DefaultFrame>
    );
  }
}
