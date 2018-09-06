import React from 'react';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledTooltip,
} from 'reactstrap';
import classnames from 'classnames';
import fetch from 'node-fetch';
// import _ from 'lodash';
import socketIOClient from 'socket.io-client';

import urlPaths, { addQuery } from '../../lib/url_paths';
import DropdownInput from '../../react-elements/dropdown-input';
import NumberWidget from '../../widgets/number/widget';
import Widgets from '../../widgets/Widgets';
import DynamicComponents from '../../dynamic_components';
import ComponentStructure from '../../lib/structures/component';

import './styles.scss';

export default class DashboardEdit extends React.Component {
  constructor(props) {
    super(props);
    this.defaultChildStructure = new ComponentStructure('NumberWidget', {
      id: Date.now(),
      name: 'ReasonPRs',
      title: 'Conversion',
      socket: socketIOClient(`http://${window.location.host}`),
      layout: NumberWidget.layout,
      metric: '',
      format: '0.0a',
    });
    this.state = {
      isNewWidget: this.props.newWidget,
      activeTab: '1',
      childStructure: this.props.childStructure || this.defaultChildStructure,
    };
    /* console.log('constructor');
    console.log(this.props.childStructure);
    console.log(this.props.child);
    console.log('constructor end'); */
    
    this.state.childStructure.attrs.socket = socketIOClient(`http://${window.location.host}`);
    this.state.initialChildStructure = JSON.parse(this.state.childStructure.stringify());
    
    // per forzare il rerendering da parte di React del native DOM
    // si sfrutta la riassegnazione della proprietà "key" del React.Component
    // facendo ciò si perde il riferimento alla structure originaria
    // su cui effettuare l'update sul db.
    // state.chilStrReferenceId salva quindi il riferimento
    // che viene ripristinato al momento del salvataggio su db.
    this.state.chilStrReferenceId = this.state.childStructure.attrs.id;
    this.state.child = this.props.child || this.getElemFromStructure(this.state.childStructure);

    this.idToProperty = {
      title: 'title',
      jobName: 'jobName',
      taskName: 'name',
      format: 'format',
      size: 'size',
      metric: 'metric',
    };
    
    this.propertyToLabel = {
      title: 'Title',
      name: 'Task',
      format: 'Format',
      size: 'Size',
      metric: 'Metric',
    };
    
    // Method binding
    // rst
    this.toggle = this.toggle.bind(this);
    this.getJobNamesLike = this.getJobNamesLike.bind(this);
    this.getTaskNamesLike = this.getTaskNamesLike.bind(this);
    this.getTaskNamesOptionsState = this.getTaskNamesOptionsState.bind(this);
    this.onDropdownInputChange = this.onDropdownInputChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    // rcl
  }
  
  shouldComponentUpdate(nextProps) {
    if (!this.props.childStructure && nextProps.childStructure !== this.state.childStructure && !this.state.isNewWidget) {
      if (nextProps.childStructure)
        nextProps.childStructure.attrs.socket = socketIOClient(`http://${window.location.host}`);
      const nextStructure = nextProps.childStructure || this.defaultChildStructure;
      this.setState({
        isNewWidget: nextProps.newWidget,
        childStructure: nextStructure,
        initialChildStructure: JSON.parse(nextStructure.stringify()),
        chilStrReferenceId: nextStructure.attrs.id,
        child: this.getElemFromStructure(nextStructure),
      });
    }
    return true;
  }
  
  componentWillUnmount() {
    // console.log('componentWillUnmount');
  }
  
  // On Event Methods
  // rst
  onDropdownInputChange(e) {
    const data = e.target.data ? e.target.data.value : null;
    this.sendChangeOnChildStruct(e, data);
  }
  
  onChange(e, data) {
    this.sendChangeOnChildStruct(e, data);
  }
  
  onBlur(e, data) {
    this.sendChangeOnChildStruct(e, data, true);
  }
  
  onSave() {
    const childStr = this.state.childStructure;
    childStr.newKey(this.state.chilStrReferenceId);
    if (this.validateAll(childStr) && this.props.saveHandler && typeof this.props.saveHandler === 'function')
      this.props.saveHandler(childStr); 
    console.log(childStr);
  }
  
  onCancel() {
    if (this.props.cancelHandler && typeof this.props.cancelHandler === 'function')
      this.props.cancelHandler();
  }
  // rcl
  
  // Get Methods
  // rst
  getModal() {
    return (
      <Modal isOpen={this.state.modalShow} toggle={this.toggleModal} className={this.props.className}>
        <ModalHeader toggle={this.toggleModal}>{ this.state.modal && this.state.modal.title}</ModalHeader>
        <ModalBody>
          {this.state.modal && this.state.modal.body}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.toggleModal}>Ok</Button>
        </ModalFooter>
      </Modal>
    );
  }
  
  getElemFromStructure(structure) {
    return (new DynamicComponents({ structure })).render();
  }
  
  getWidgetTypes() {
    return Object.keys(Widgets)
      .filter(k => k !== 'DashboardWidgetCollection' && k !== 'DashboardJobScheduler')
      .map(k => ({ label: k.replace(/Widget/, ''), value: k }));
  }
  
  getJobNamesLike(like) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await fetch(addQuery(urlPaths.jobs.get.getJobNamesLike(), { jobNameLike: like }));
        const json = await result.json();
        result = json.map(e => ({ label: e.jobName, value: e.jobName }));
        resolve(result);
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }
  
  getTaskNamesLike(like) {
    const stateStruct = this.state.childStructure;
    return new Promise(async (resolve, reject) => {
      try {
        let result = await fetch(addQuery(urlPaths.jobs.get.getTaskNamesLike(), {
          jobName: stateStruct.attrs.jobName,
          taskNameLike: like,
        }));
        const json = await result.json();
        result = json.map(e => ({ label: e.taskName, value: e.taskName }));
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }
  
  getTaskNamesOptionsState(/* jobName */) {
    this.getTaskNamesLike('').then(result => {
      this.setState({ taskOptions: result });
    });
  }
  
  getSubdashLinkVars(childStructure, data) {
    if (!data)
      return undefined; 
    const rgx = /\w+(?:(?=\s?:))/g;
    const rgx2 = /,\s*$/;
    let vars = `${data.trim().replace(rgx, (match) => `"${match}"`)}`;
    vars = vars.replace(rgx2, '').split('').reverse().join('');
    vars = vars.replace(rgx, (match) => `"${match}"`).split('').reverse().join('');
    vars = JSON.parse(`{${vars}}`);
    return vars;
  }
  // rcl
  
  sendChangeOnChildStruct(e, data, isOnBlur) {
    const childStructure = this.state.childStructure || {};
    childStructure.attrs = childStructure.attrs || {};
    if (e.target.name === 'widgettype') {
      childStructure.type = data || childStructure.type;
    }
    if (isOnBlur && e.target.name === 'vars') {
      try {
        childStructure.attrs.subdashLink = childStructure.attrs.subdashLink || {};
        childStructure.attrs.subdashLink.vars = this.getSubdashLinkVars(childStructure, data);
      } catch (err) {
        // console.log(err);
      }
    } else if (e.target.name === 'subdashboard') {
      childStructure.attrs.subdashLink = childStructure.attrs.subdashLink || { name: '', vars: {} };
      childStructure.setSubdashLinkName(data);
    } else {
      const prop = this.idToProperty[e.target.name];
      childStructure.attrs[prop] = data || this.state.initialChildStructure.attrs[prop];
    }
    /* childStructure.attrs.removeAllListeners(`widget:update:${childStructure.attrs.name}`);
    childStructure.attrs.socket.disconnect(); */
    childStructure.attrs.socket = socketIOClient(`http://${window.location.host}`);
    childStructure.newKey();
    
    this.setState({
      childStructure,
      child: this.getElemFromStructure(childStructure),
    });
  }
  
  isRequiredAttrs(key, options) {
    const required = ['key', 'id', 'name', 'jobName', 'socket', 'title', 'layout', 'size', 'subdashLink'];
    if (!options)
      return required.includes(key);
    return !options.includes(key);
  }
  
  firstUppercase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  validateAll(childStr) {
    let validated = true;
    Object.keys(childStr.attrs).forEach(k => {
      if (k === 'subdashLink') {
        childStr.attrs[k] = childStr.attrs[k] || Object.assign({}, this.state.initialChildStructure[k]);
      } else
        childStr.attrs[k] = childStr.attrs[k] || this.state.initialChildStructure[k];
      
      if (this.isRequiredAttrs(k) && !childStr.attrs[k] && childStr.attrs[k] !== 0) {
        this.toggleModal({
          title: `Missing ${this.propertyToLabel[k]} property!`,
          body: `Missing ${this.propertyToLabel[k]} field.`,
        });
        validated = false;
      } else if (k === 'subdashLink' && !childStr.attrs.subdashLink.name && childStr.attrs.subdashLink.vars) {
        this.toggleModal({
          title: 'Missing Subdashboard property!',
          body: 'Missing Subdashboard field.',
        });
        validated = false;
      }
    });
    
    return validated;
  }
  
  toggleModal(modal) {
    this.setState(prevState => ({
      modalShow: !prevState.modalShow,
      modal: modal || prevState.modal,
    }));
  }
  
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }
  
  render() {
    const cStr = this.state.childStructure;
    let vars = this.state.childStructure.attrs.subdashLink ? JSON.stringify(this.state.childStructure.attrs.subdashLink.vars) : '';
    vars = vars || '';
    vars = vars.replace(/"|{|}/g, '');
    return (
      <div className="widget_edit">
        {this.getModal()}
        <div className="widget_viewport">
          <div className="widget_container">
            {this.state.child}
          </div>
        </div>
        <div className="widget_settings">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '1' })}
                onClick={() => { this.toggle('1'); }}
              >
                General
              </NavLink>
            </NavItem>
            {Object.keys(cStr.attrs).filter(k => !this.isRequiredAttrs(k)).length > 0 && 
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2'); }}
                >
                  Options
                </NavLink>
              </NavItem>
            }
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '3' })}
                onClick={() => { this.toggle('3'); }}
              >
                Subdashboard
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <Form className="form">
              <TabPane tabId="1">
                {this.state.isNewWidget && 
                  <FormGroup>
                    <Label for="widgettype">Widget type</Label>
                    <DropdownInput 
                      name="widgettype"
                      onChange={this.onDropdownInputChange}
                      options={this.getWidgetTypes()}
                      placeholder={this.state.initialChildStructure.type.replace(/Widget/, '')}
                    />
                  </FormGroup>
                }
                {cStr.attrs.title && 
                  <FormGroup>
                    <Label for="title">Title</Label>
                    <Input 
                      type="text" 
                      name="title" 
                      id="title" 
                      onChange={e => this.onChange(e, e.target.value)} 
                      placeholder={this.state.childStructure.attrs.title} 
                    />
                  </FormGroup>
                }
                <FormGroup>
                  <Label for="jobName" style={{ display: 'flex' }}>Job
                    <i className="material-icons" id="iconJobName" style={{ fontSize: '16px', marginLeft: '0.25rem' }}>info</i>
                  </Label>
                  <UncontrolledTooltip placement="right" target="iconJobName">
                    If the job searched is not found, probably is not defined yet.
                  </UncontrolledTooltip>
                  <DropdownInput 
                    async
                    defaultOptions
                    isClearable
                    loadOptions={this.getJobNamesLike}
                    name="jobName"
                    onChange={this.onDropdownInputChange}
                    onInputChange={this.getTaskNamesOptionsState}
                    placeholder={this.state.childStructure.attrs.jobName}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="taskName" style={{ display: 'flex' }}>Task 
                    <i className="material-icons" id="iconTaskName" style={{ fontSize: '16px', marginLeft: '0.25rem' }}>info</i>
                  </Label>
                  <UncontrolledTooltip placement="right" target="iconTaskName">
                    {'If no options are shown, try to set \'Job\' before this and then search for the task name.'}
                  </UncontrolledTooltip>
                  <DropdownInput 
                    defaultOptions
                    isClearable
                    name="taskName"
                    onChange={this.onDropdownInputChange}
                    options={this.state.taskOptions}
                    placeholder={this.state.childStructure.attrs.name}
                  />
                </FormGroup>
              </TabPane>
              {
                Object.keys(cStr.attrs).filter(k => !this.isRequiredAttrs(k)).length > 0 && 
                <TabPane tabId="2">
                  {Object.keys(cStr.attrs)
                    .filter(k => !this.isRequiredAttrs(k, cStr.options))
                    .map((k, i) => (
                      <FormGroup key={(i * -1) + 2}>
                        <Label key={(i * -1) + 1} for={k}>{this.firstUppercase(k)}</Label>
                        <Input 
                          key={i * -1} 
                          type="text" 
                          name={k} 
                          id={k} 
                          placeholder={this.firstUppercase(k)} 
                          onChange={e => this.onChange(e, e.target.value)}
                          value={this.state.childStructure.attrs[k]} 
                        />
                      </FormGroup>
                    ))}
                </TabPane>
              }
              <TabPane tabId="3">
                <FormGroup>
                  <Label for="subdashboard">Subdashboard</Label>
                  <Input 
                    type="text" 
                    name="subdashboard" 
                    id="subdashboard" 
                    onChange={e => this.onChange(e, e.target.value)} 
                    placeholder="Subdashboard"
                    defaultValue={this.state.childStructure.attrs.subdashLink && this.state.childStructure.attrs.subdashLink.name}
                  />
                </FormGroup>
                <FormGroup>
                  <Label id="labelvars" for="vars" style={{ display: 'flex' }}>Variables
                    <i className="material-icons"  id="iconVars" style={{ fontSize: '16px', marginLeft: '0.25rem' }}>info</i>
                  </Label>
                  <Input 
                    type="text" 
                    name="vars" 
                    id="vars" 
                    placeholder="Variables" 
                    disabled={!this.state.childStructure.attrs.subdashLink || !this.state.childStructure.attrs.subdashLink.name}
                    onBlur={e => this.onBlur(e, e.target.value, e.target)}
                    defaultValue={vars}
                  />
                  <UncontrolledTooltip placement="right" target="iconVars">
                    This format is allowed: varname1: varvalue1, 
                    varname2: varvalue2, ... , varnameN: varvalueN
                  </UncontrolledTooltip>
                </FormGroup>
              </TabPane>
            </Form>
            <Button color="primary" onClick={e => this.onSave(e)}>Save</Button>
            <Button color="secondary" onClick={e => this.onCancel(e)}>Cancel</Button>
          </TabContent>
        </div>
      </div>
    );
  }
}
/*
  <Input type="text" name="jobName" id="jobName" placeholder="Job" />
*/
/*
  <Input 
    type="text" 
    name="taskName" 
    id="taskName" 
    onChange={e => this.onChange(e, e.target.value)} 
    placeholder="Task" 
    value={this.state.childStructure.attrs.name} 
  />
*/
