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
// import _ from 'lodash';
import socketIOClient from 'socket.io-client';

import NumberWidget from '../../widgets/number/widget';
import DynamicComponents from '../../dynamic_components';
import ComponentStructure from '../../lib/structures/component';

import './styles.scss';

export default class DashboardEdit extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    console.log(this.props.childStructure);
    this.state = {
      activeTab: '1',
      childStructure: this.props.childStructure || new ComponentStructure('NumberWidget', {
        id: 'e',
        name: 'ReasonPRs',
        title: 'Conversion',
        socket: socketIOClient(`http://${window.location.host}`),
        layout: NumberWidget.layout,
        metric: '',
        format: '0.0a',
      }),
    };
    
    this.state.childStructure.attrs.socket = socketIOClient(`http://${window.location.host}`);
    this.state.initialChildStructure = JSON.parse(this.state.childStructure.stringify());
    
    // per forzare il rerendering da parte di React del native DOM
    // si sfrutta la riassegnazione della proprietà "key" del React.Component
    // facendo ciò si perde il riferimento alla structure originaria
    // su cui effettuare l'update sul db.
    // state.chilStrReferenceId salva quindi il riferimento
    // che viene ripristinato al momento del salvataggio.
    this.state.chilStrReferenceId = this.state.childStructure.attrs.id;
    this.state.child = this.props.child || this.getElemFromStructure(this.state.childStructure);

    this.idToProperty = {
      title: 'title',
      jobName: 'name',
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
    
    this.onInput = this.onInput.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }
  
  shouldComponentUpdate(nextProps) {
    console.log('shouldComponentUpdate');
    console.log(nextProps);
    if (!this.props.childStructure && nextProps.childStructure !== this.state.childStructure) {
      nextProps.childStructure.attrs.socket = socketIOClient(`http://${window.location.host}`);
      this.setState({
        childStructure: nextProps.childStructure,
        initialChildStructure: JSON.parse(nextProps.childStructure.stringify()),
        chilStrReferenceId: nextProps.childStructure.attrs.id,
        child: this.getElemFromStructure(nextProps.childStructure),
      });
    }
    return true;
  }
  
  componentWillUnmount() {
    super.componentWillUnmount();
    console.log('componentWillUnmount');
  }
  
  getElemFromStructure(structure) {
    return (new DynamicComponents({ structure })).render();
  }
  
  isRequiredAttrs(key, options) {
    const required = ['key', 'id', 'name', 'socket', 'title', 'layout', 'size', 'subdashLink'];
    if (!options)
      return required.includes(key);
    return !options.includes(key);
  }
  
  firstUppercase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }
  
  onInput(e, data, target, other) {
    // console.log(e.target.id);
    // console.log(data);
    let childStructure = this.state.childStructure;
    childStructure = childStructure || {};
    childStructure.attrs = childStructure.attrs || {};
    if (e.target.id === 'subdashboard') {
      childStructure.setSubdashLinkName(data);
    } else {
      const prop = this.idToProperty[e.target.id];
      childStructure.attrs[prop] = data || this.state.initialChildStructure.attrs[prop];
    }
    
    childStructure.attrs.socket = socketIOClient(`http://${window.location.host}`);
    childStructure.newKey();

    this.setState({
      childStructure,
      child: this.getElemFromStructure(childStructure),
    });
  }
  
  onBlur(e, data, target, other) {
    console.log(data);
    const childStructure = this.state.childStructure || {};
    childStructure.attrs = childStructure.attrs || {};
    if (target.id === 'vars') {
      try {
        childStructure.attrs.subdashLink = childStructure.attrs.subdashLink || {};
        childStructure.attrs.subdashLink.vars = this.getSubdashLinkVars(childStructure, data);
      } catch (err) {
        console.log(err);
      }
    } else {
      const prop = this.idToProperty[e.target.id];
      childStructure.attrs[prop] = data || this.state.initialChildStructure.attrs[prop];
    }
    if (target.id === 'subdashboard') {
      childStructure.attrs.subdashLink = childStructure.attrs.subdashLink || { name: '', vars: {} };
      childStructure.setSubdashLinkName(data);
    }
    childStructure.attrs.socket = socketIOClient(`http://${window.location.host}`);
    childStructure.newKey();
    
    this.setState({
      childStructure,
      child: this.getElemFromStructure(childStructure),
    });
  }
  
  onSave(e) {
    console.log('onSave!');
    const childStr = this.state.childStructure;
    childStr.newKey(this.state.chilStrReferenceId);
    if (this.validateAll(childStr) && this.props.saveHandler && typeof this.props.saveHandler === 'function')
      this.props.saveHandler(childStr);
    console.log(childStr);
    window.location.assign(window.location.href);
  }
  
  onCancel(e) {
    if (this.props.cancelHandler && typeof this.props.cancelHandler === 'function')
      this.props.cancelHandler();
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
  
  toggleModal(modal) {
    this.setState((prevState) => {
      return {
        modalShow: !prevState.modalShow,
        modal: modal || prevState.modal,
      };
    });
  }
  
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

  render(){
    const cStr = this.state.childStructure;
    let vars = this.state.childStructure.attrs.subdashLink ? JSON.stringify(this.state.childStructure.attrs.subdashLink.vars) : '';
    vars = vars || '';
    vars = vars.replace(/"|{|}/g, '');
    return(
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
                {cStr.attrs.title && 
                  <FormGroup>
                    <Label for="title">Title</Label>
                    <Input type="text" name="title" id="title" onInput={e => this.onInput(e, e.target.value)} placeholder="Title" defaultValue={this.state.childStructure.attrs.title} />
                  </FormGroup>
                }
                <FormGroup>
                  <Label for="jobName">Job</Label>
                  <Input type="text" name="jobName" id="jobName" placeholder="Job" />
                </FormGroup>
                <FormGroup>
                  <Label for="taskName">Task</Label>
                  <Input type="text" name="taskName" id="taskName" onInput={e => this.onInput(e, e.target.value)} placeholder="Task" defaultValue={this.state.childStructure.attrs.name} />
                </FormGroup>
              </TabPane>
              {
                Object.keys(cStr.attrs).filter(k => !this.isRequiredAttrs(k)).length > 0 && 
                <TabPane tabId="2">
                  {Object.keys(cStr.attrs)
                    .filter(k => !this.isRequiredAttrs(k, cStr.options))
                    .map((k, i) => (
                      <FormGroup key={i*-3 +2}>
                        <Label key={i*-3 +1} for={k}>{this.firstUppercase(k)}</Label>
                        <Input 
                          key={i*-3} 
                          type="text" 
                          name={k} 
                          id={k} 
                          placeholder={this.firstUppercase(k)} 
                          onInput={e => this.onInput(e, e.target.value)}
                          defaultValue={this.state.childStructure.attrs[k]} />
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
                    onInput={e => this.onInput(e, e.target.value)} 
                    placeholder="Subdashboard"
                    defaultValue={this.state.childStructure.attrs.subdashLink && this.state.childStructure.attrs.subdashLink.name}
                  />
                </FormGroup>
                <FormGroup>
                  <Label id="labelvars" for="vars">Variables</Label>
                  <Input 
                    type="text" 
                    name="vars" 
                    id="vars" 
                    placeholder="Variables" 
                    disabled={!this.state.childStructure.attrs.subdashLink || !this.state.childStructure.attrs.subdashLink.name}
                    onBlur={e => this.onBlur(e, e.target.value, e.target)}
                    defaultValue={vars}
                  />
                  <UncontrolledTooltip placement="left" target="labelvars">
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

// <NumberWidget name="ReasonPRs" title={this.state.title || "Pull Requests"} socket={socketIOClient(`http://${window.location.host}`)} />

/*
                  <FormGroup>
                    <Label for="format">Format</Label>
                    <Input type="text" name="format" id="format" onInput={e => this.onInput(e, e.target.value)} placeholder="Format" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="metric">Metric</Label>
                    <Input type="text" name="metric" id="metric" onInput={e => this.onInput(e, e.target.value)} placeholder="Metric" />
                  </FormGroup>
*/
