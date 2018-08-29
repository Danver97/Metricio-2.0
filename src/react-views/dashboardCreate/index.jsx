import React from 'react';
import qs from 'query-string';
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup, 
  InputGroupAddon, 
  InputGroupText,
  CustomInput,
  UncontrolledTooltip,
} from 'reactstrap';
import { post } from '../../lib/requests';
import urlPaths from '../../lib/url_paths';
import DefaultFrame from '../../react-elements/default-frame/widget';
import withAllProps from '../withAllProps';

import './styles.scss';

// Colors
// rst
const defBack = '#ffffff';
const defSide = '#e9ecef';
const defBorder = '#ced4da';

// const colorCheck = '#2ccc4b';
const colorInputCheck = '#ccffc4';
const colorBorderCheck = '#9cc395';
const colorSideInputCheck = '#aad4a3';

// const colorWrong = '#c92216';
const colorInputWrong = '#ffc4c4';
const colorBorderWrong = '#cc9595';
const colorSideInputWrong = '#e0a3a3';
// rcl

class DashboardCreateView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboardname: '',
      varNames: [],
      variablesAllowed: true,
      defaultStyleBack: { backgroundColor: defBack },
      defaultStyleSide: { backgroundColor: defSide, borderColor: defBorder },
    };
    this.keycounter = 0;
    this.onVariableAddClick = this.onVariableAddClick.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onXClick = this.onXClick.bind(this);
    this.addVarName = this.addVarName.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.dashIsMain = this.dashIsMain.bind(this);
  }
  
  onSave(e) {
    e.preventDefault();
    const params = qs.stringify({
      name: this.state.dashboardname,
      dashsuite: this.props.query.dashsuite,
      ismain: !this.state.variablesAllowed,
      variables: this.getVarsStringList(),
    });
    post(
      // '/dashboard/create',
      urlPaths.dashboard.post.create(),
      [{
        tag: 'Content-Type',
        value: 'application/x-www-form-urlencoded',
      }], 
      // `name=${this.state.dashboardname}&variables=${this.getDashStringList()}`,
      params,
    );
    this.back();
  }
  
  onCancel(e) {
    e.preventDefault();
    this.back();
  }
  
  onXClick(e, id) {
    e.stopPropagation();
    const varNames = this.state.varNames.filter(elem => elem.id !== id);
    this.setState({ varNames });
  }
  
  onInput(e) {
    const obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  }
  
  onBlur(e) {
    const obj = {};
    console.log(this.state);
    console.log(e.target);
    console.log(this.validateField(e.target.name, e.target.value));
    if (this.validateField(e.target.name, e.target.value))
      this.checkState(e.target.name, obj);
    else
      this.wrongState(e.target.name, obj);
    this.setState(obj);
  }
  
  onVariableAddClick(e) {
    if (e)
      e.stopPropagation();
    const key = this.keycounter++;
    const varNames = this.state.varNames.slice();
    varNames.push({ id: `variablename${key}`, text: '' });
    this.setState({ varNames });
  }
  
  getVarField(key, value) {
    const disabled = !this.state.variablesAllowed;
    return (
      <FormGroup key={key} id={key} row>
        <Label for={`${key}`} hidden>Variable name:</Label>
        <Col sm={10} >
          <InputGroup>
            {this.getInputAddonIcon('code', 'prepend', this.state[`${key}Side`] || this.state.defaultStyleSide)}
            <Input 
              type="text" 
              name={`${key}`}
              id={`${key}`} 
              onInput={e => this.addVarName(e, key)} 
              onBlur={e => this.onBlur(e)} 
              placeholder="Name" 
              defaultValue={value} 
              disabled={disabled}
              style={this.state[`${key}Back`] || this.state.defaultStyleBack}
            />
          </InputGroup>
        </Col>
        <Col sm={2} >
          <Button onClick={e => this.onXClick(e, key)} disabled={disabled}>X</Button>
        </Col>
      </FormGroup>
    );
  }
  
  getVarFields() {
    const varNames = this.state.varNames;
    const result = varNames.map(e => this.getVarField(e.id, e.text));
    return result;
  }
  
  getVarsStringList() {
    const result = JSON.stringify(this.state.varNames.map(e => e.text));
    return result;
  }
  
  getInputAddonIcon(icon, addonType, style, id, iconstyles) {
    return (
      <InputGroupAddon addonType={addonType} id={id}>
        <InputGroupText style={style}>
          <i className="material-icons" style={iconstyles}>{icon}</i>
        </InputGroupText>
      </InputGroupAddon>
    );
  }
  
  validateField(name, value) {
    if (name === 'dashboardname')
      return !!value;
    if (/^variablename/.test(name))
      return this.state.varNames.filter(e => e.text === value).length < 2;
    return false;
  }
  
  checkState(name, obj) {
    obj[`${name}Back`] = { backgroundColor: colorInputCheck };
    obj[`${name}Side`] = { borderColor: colorBorderCheck, backgroundColor: colorSideInputCheck };
  }
  
  wrongState(name, obj) {
    obj[`${name}Back`] = { backgroundColor: colorInputWrong };
    obj[`${name}Side`] = { borderColor: colorBorderWrong, backgroundColor: colorSideInputWrong };
  }
  
  addVarName(e, id) {
    const varNames = this.state.varNames.slice();
    let varname = varNames.filter(elem => elem.id === id)[0];
    if (!varname) {
      varname = {};
      varname.id = e.target.id;
      varname.text = e.target.value;
      varNames.push(varname);
    } else {
      varname.id = e.target.id;
      varname.text = e.target.value;
    }
    this.setState({ varNames });
  }
  
  back() {
    if (this.props.history) {
      this.props.history.goBack();
      return;
    }
    if (this.props.cancelLink) {
      window.location.assign(this.props.cancelLink);
      return;
    }
    window.history.back();
  }
  
  dashIsMain() {
    const variablesAllowed = !this.state.variablesAllowed;
    const varNames = this.state.varNames.filter(e => !!e.text);
    this.setState({ variablesAllowed, varNames });
  }
  
  render() {
    return (
      <DefaultFrame>
        <div className="createView">
          <h1>New Dashboard</h1>
          <Form className="form" action="/">
            <FormGroup>
              <Label for="dashboardname">Dashboard name:</Label>
              <InputGroup>
                {this.getInputAddonIcon('dashboard', 'prepend', this.state.dashboardnameSide || this.state.defaultStyleSide)}
                <Input 
                  type="text" 
                  name="dashboardname" 
                  id="dashboardname" 
                  onInput={e => this.onInput(e)} 
                  onBlur={e => this.onBlur(e)} 
                  placeholder="Name" 
                  style={this.state.dashboardnameBack || this.state.defaultStyleBack}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup className="inline-checkbox-container">
              <Label id="ismain" for="dashboardmain" check>Is main:</Label>
              <CustomInput type="checkbox" name="dashboardmain" id="dashboardmain" onChange={this.dashIsMain} inline />
            </FormGroup>
            <UncontrolledTooltip placement="bottom" target="ismain">
              If this dashboard will have no parent dashboards but only child dashboards, please check this.
            </UncontrolledTooltip>
            <FormGroup>
              <Label>Variables:</Label>
              {this.getVarFields()}
              <Button onClick={e => this.onVariableAddClick(e)} style={{ display: 'block' }} disabled={!this.state.variablesAllowed}>Add new</Button>
            </FormGroup>
          </Form>
          <Button color="primary" onClick={e => this.onSave(e)}>Save</Button>
          <Button color="secondary" onClick={e => this.onCancel(e)}>Cancel</Button>
        </div>
      </DefaultFrame>
    );
  }
}

export default withAllProps(DashboardCreateView);
