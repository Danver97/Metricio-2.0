import React from 'react';
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip,
} from 'reactstrap';
import fetch from 'node-fetch';
import cronValidator from 'sancronos-validator';

// Components
// rst
import Divider from '@material-ui/core/Divider';
import ExpansiblePanel from '../../react-elements/expansible-panel';
import DropdownInput from '../../react-elements/dropdown-input';
import DefaultFrame from '../../react-elements/default-frame/widget';
import InputGroupIcon from '../../react-elements/input-prepend-icon';
import urlPaths from '../../lib/url_paths';
// rcl

import './styles.scss';

import Styles from '../../react-elements/styles';

export default class CreateView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobStructure: this.props.jobStructure || {},
      jobName: '',
      tasks: [],
      taskHeaders: {},
      taskBodyParams: {},
      panelExpanded: {},
      parameters: false,
      modal: {
        title: 'Error',
        body: 'Error',
      },
    };
    this.taskCounter = 0;
    this.headerCounter = 0;
    this.bodyParamCounter = 0;
    
    this.mapJobStructureToState(this.props.jobStructure, true);
    
    this.addTask = this.addTask.bind(this);
    this.addNewTask = this.addNewTask.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onDeleteConfirm = this.onDeleteConfirm.bind(this);
    this.onDeleteTaskClick = this.onDeleteTaskClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onHeaderChange = this.onHeaderChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }
  
  shouldComponentUpdate(nextProps) {
    if (nextProps.jobStructure &&
        nextProps.jobStructure !== undefined &&
        nextProps.jobStructure !== null &&
        this.state.jobStructure !== nextProps.jobStructure) {
      // const jobStructure = nextProps.jobStructure || {};
      this.mapJobStructureToState(nextProps.jobStructure);
    }
    return true;
  }
  
  onPanelExpanded(id, expanded) {
    const panelExpanded = Object.assign({}, this.state.panelExpanded);
    panelExpanded[id] = expanded;
    this.setState({ panelExpanded });
  }
  
  onHeadersXClick(e, id, key) {
    e.preventDefault();
    const taskHeaders = this.state.taskHeaders;
    let headers = taskHeaders[id];
    headers = headers.filter(el => el.id !== key);
    taskHeaders[id] = headers;
    this.setState({ taskHeaders });
  }
  
  onBodyParamsXClick(e, id, key) {
    e.preventDefault();
    const taskBodyParams = this.state.taskBodyParams;
    let bodyParams = taskBodyParams[id];
    bodyParams = bodyParams.filter(el => el.id !== key);
    taskBodyParams[id] = bodyParams;
    this.setState({ taskBodyParams });
  }
  
  onDeleteTaskClick(e, id) {
    if (e)
      e.stopPropagation();
    const tasks = this.state.tasks.filter(el => el.id !== id);
    this.setState({ tasks });
  }
  
  onHeaderChange(e, id, key) {
    const taskHeaders = this.state.taskHeaders;
    let toPush = false;
    taskHeaders[id] = taskHeaders[id] || [];
    let header = this.state.taskHeaders[id].filter(el => el.id === key)[0];
    if (!header) {
      header = { id: key };
      toPush = true;
    }
    header[e.target.name] = e.target.value;
    if (toPush) taskHeaders[id].push(header);
    this.setState({ taskHeaders });
  }
  
  onBodyParamChange(e, id, key) {
    const taskBodyParams = this.state.taskBodyParams;
    let toPush = false;
    taskBodyParams[id] = taskBodyParams[id] || [];
    let bodyParam = this.state.taskBodyParams[id].filter(el => el.id === key)[0];
    if (!bodyParam) {
      bodyParam = { id: key };
      toPush = true;
    }
    bodyParam[e.target.name] = e.target.value;
    if (toPush) taskBodyParams[id].push(bodyParam);
    this.setState({ taskBodyParams });
  }
  
  onChange(e) {
    const obj = {};
    if (e.target.name === 'type')
      obj[e.target.name] = e.target.data.value;
    else if (e.target.name === 'parameters')
      obj[e.target.name] = e.target.data.value;
    else
      obj[e.target.name] = e.target.value;
    this.setState(obj);
  }
  
  onSave(e) {
    e.preventDefault();
    const taskBodyParams = this.state.taskBodyParams;
    const tasksHeaders = this.state.taskHeaders;
    let tasks = this.state.tasks.filter(el => !!el.taskName);
    tasks.forEach(t => {
      const body = {};
      taskBodyParams[t.id]
        .filter(p => p.bodyParamName && p.bodyParamValue)
        .forEach(p => { body[p.bodyParamName] = p.bodyParamValue; });
      t.options.body = body;
      const headers = {};
      tasksHeaders[t.id]
        .filter(h => h.headerName && h.headerValue)
        .forEach(h => { headers[h.headerName] = h.headerValue; });
      t.options.headers = headers;
    });
    tasks = tasks.map(t => ({ taskName: t.taskName, task: t }));
    // console.log(tasks);
    const modalBody = this.convalidateAll();
    if (modalBody.length === 0) {
      /* post(
        // '/jobs/create',
        urlPaths.jobs.post.create(),
        { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${this.auth.getToken()}` }, 
        `jobName=${this.state.jobName}&interval=${this.state.interval}&type=${this.state.type}&tasks=${this.getTasksStringList(tasks)}`
      );
      this.back(); */
      if (this.props.onSave)
        this.props.onSave({
          jobName: this.state.jobName,
          interval: this.state.interval,
          type: this.state.type,
          parameters: this.state.parameters,
          tasks,
        });
    } else {
      this.toggleModal({
        title: 'Error',
        body: modalBody,
        confirmButton: false,
        cancelButton: false,
        confirmAction: false,
      });
    }
  }
  
  onDelete(e) {
    e.preventDefault();
    this.toggleModal({
      title: 'Confirm deletion',
      body: 'Are you sure to delete this job and all its tasks?',
      confirmButton: 'I\'m sure',
      cancelButton: 'Cancel',
      confirmAction: this.onDeleteConfirm,
    });
  }
  
  onDeleteConfirm() {
    /* post(
      urlPaths.jobs.post.delete(),
      { Authorization: `Bearer ${this.auth.getToken()}` },
    ); */
    if (this.props.onDelete)
      this.props.onDelete();
  }
  
  onCancel(e) {
    e.preventDefault();
    // this.back();
    if (this.props.onCancel)
      this.props.onCancel();
  }
  
  getTasksStringList(tasks) {
    return JSON.stringify(tasks);
  }
  
  getTasksElem() {
    // const inputStyle = { backgroundColor: '#efefef', boxShadow: 'none' };
    const inputGroupStyle = { marginBottom: '1rem' };
    // const inputGroupIconStyle = { border: '0', backgroundColor: '#e4e4e4' };
    return this.state.tasks.map((e, i) => {
      const id = e.id;
      const children = this.getTaskHeadersElems(id);
      return (
        <div key={id}>
          {i !== 0 && <div style={{ backgroundColor: 'white' }}><Divider style={{ marginLeft: '1rem', marginRight: '1rem' }} /></div> }
          <ExpansiblePanel 
            key={id} 
            id={id} 
            defaultExpanded={this.state.panelExpanded[id]}
            className="fontSaira" 
            title={e.taskName || `Task ${id}`} 
            onExpand={exp => this.onPanelExpanded(id, exp)} 
            onClose={() => this.onDeleteTaskClick(null, id)} 
          >
            <Label className="labelDark" for={`taskName${id}`}>Task name</Label>
            <InputGroup style={inputGroupStyle}>
              <InputGroupIcon style={Styles.InputAppendDark} materialIconName="assignment" />
              <Input 
                type="text" 
                name="taskName" 
                id={`taskName${id}`} 
                onChange={ev => this.addTask(ev, id)} 
                placeholder="Name" 
                value={e.taskName}
                style={Styles.InputDark} 
              />
            </InputGroup>
            <Label className="labelDark" for={`method${id}`}>Task method</Label>
            <DropdownInput 
              className="marginBottom"
              name="method"
              id={`method${id}`} 
              options={[{ label: 'GET', value: 'GET' }, { label: 'POST', value: 'POST' }]}
              placeholder={e.options.method || 'Method'}
              style={{ marginBottom: '1rem' }}
              onChange={ev => this.addTask(ev, id)} 
              value="GET"
            />
            <Label className="labelDark" for={`endpoint${id}`}>Task endpoint</Label>
            <InputGroup style={inputGroupStyle}>
              <InputGroupIcon style={Styles.InputAppendDark} materialIconName="http" />
              <Input 
                type="url" 
                name="endpoint" 
                id={`endpoint${id}`} 
                onChange={ev => this.addTask(ev, id)} 
                placeholder="Endpoint" 
                value={e.endpoint}
                style={Styles.InputDark} 
              />
            </InputGroup>
            <Label className="labelDark" for={`endpoint${id}`} style={{ display: 'flex' }}>Json fields to select
              <i className="material-icons" id="iconProjection" style={{ fontSize: '16px', marginLeft: '0.25rem' }}>info</i>
            </Label>
            <UncontrolledTooltip placement="right" target="iconProjection">
              Please insert the JSON field separated by commas, spaces or carriage returns.
            </UncontrolledTooltip>
            <Input 
              type="textarea" 
              name="projection" 
              id={`projection${id}`} 
              onChange={ev => this.addTask(ev, id)} 
              placeholder="Field" 
              defaultValue={e.options.projection}
              style={Styles.InputDark} 
            />
            {e.options.method === 'POST' && 
              <div style={{ marginBottom: '1rem' }}>
                <Label className="labelDark" for={`headers${id}`}>Body parameters:</Label>
                {this.getTaskBodyParamsElems(id)}
                <div />
                <Button color="secondary" onClick={() => this.addNewBodyParam(id)}>Add parameter</Button>
              </div>}
            <Label className="labelDark" for={`headers${id}`}>Headers:</Label>
            {children}
            <div />
            <Button color="secondary" onClick={() => this.addNewHeader(id)}>Add header</Button>
          </ExpansiblePanel>
        </div>
      );
    });
  }
  
  getTaskHeadersElems(id) {
    const inputStyle = Object.assign({}, { marginBottom: '1rem' }, Styles.InputDark);
    const taskHeaders = this.state.taskHeaders;
    taskHeaders[id] = taskHeaders[id] || [];
    return taskHeaders[id].map(e => {
      const key = e.id;
      return (
        <FormGroup key={`header${key}`} row style={{ marginBottom: '0' }}>
          <Col sm={4}>
            <Input 
              type="text" 
              key={`headerName${key}`} 
              id={`headerName${key}`} 
              name="headerName" 
              onChange={ev => this.onHeaderChange(ev, id, key)} 
              placeholder="Header" 
              value={e.headerName}
              style={inputStyle} 
            />
          </Col>
          <Col sm={6}>
            <Input 
              type="text" 
              key={`headerValue${key}`} 
              id={`headerValue${key}`} 
              name="headerValue" 
              onChange={ev => this.onHeaderChange(ev, id, key)} 
              placeholder="Value" 
              value={e.headerValue}
              style={inputStyle} 
            />
          </Col>
          <Col sm={1}>
            <Button color="secondary" onClick={ev => this.onHeadersXClick(ev, id, key)}>X</Button>
          </Col>
        </FormGroup>
      );
    });
  }
  
  getTaskBodyParamsElems(id) {
    const inputStyle = Object.assign({}, { marginBottom: '1rem' }, Styles.InputDark);
    const taskBodyParams = this.state.taskBodyParams;
    taskBodyParams[id] = taskBodyParams[id] || [];
    return taskBodyParams[id].map(e => {
      const key = e.id;
      return (
        <FormGroup key={`bodyParam${key}`} row style={{ marginBottom: '0' }}>
          <Col sm={4}>
            <Input 
              type="text" 
              key={`bodyParamName${key}`} 
              id={`bodyParamName${key}`} 
              name="bodyParamName" 
              onChange={ev => this.onBodyParamChange(ev, id, key)} 
              placeholder="Name" 
              value={e.bodyParamName}
              style={inputStyle} 
            />
          </Col>
          <Col sm={6}>
            <Input 
              type="text" 
              key={`bodyParamValue${key}`} 
              id={`bodyParamValue${key}`} 
              name="bodyParamValue" 
              onChange={ev => this.onBodyParamChange(ev, id, key)} 
              placeholder="Value" 
              value={e.bodyParamValue}
              style={inputStyle} 
            />
          </Col>
          <Col sm={1}>
            <Button color="secondary" onClick={ev => this.onBodyParamsXClick(ev, id, key)}>X</Button>
          </Col>
        </FormGroup>
      );
    });
  }
  
  getModal() {
    return (
      <Modal isOpen={this.state.modalShow} toggle={() => this.toggleModal()} className={this.props.className} style={{ color: 'black' }}>
        <ModalHeader toggle={() => this.toggleModal()}>{ this.state.modal && this.state.modal.title}</ModalHeader>
        <ModalBody style={{ fontSize: '1rem' }}>
          {this.state.modal && this.state.modal.body}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => this.toggleModal(null, this.state.modal.confirmAction)}>
            {this.state.modal.confirmButton || 'Ok'}
          </Button>
          {this.state.modal.cancelButton && <Button color="secondary" onClick={() => this.toggleModal()}>{this.state.modal.cancelButton}</Button>}
        </ModalFooter>
      </Modal>
    );
  }
  
  async getJobTypeOptions() {
    const response = await fetch(urlPaths.jobs.get.types());
    const types = await response.json();
    return types.map(t => ({ label: t, value: t }));
  }
  
  addTask(e, id) {
    const tasks = this.state.tasks.slice();
    let toPush = false;
    let task = tasks.filter(el => el.id === id)[0];
    if (!task) {
      task = { id, options: {} };
      toPush = true;
    }
    if (e.target.name === 'method')
      task.options.method = e.target.data.value;
    else if (e.target.name === 'projection') {
      if (/^\$/.test(e.target.value))
        task.options.projection = e.target.value.replace(/^\$/g, '');
      else {
        const projection = e.target.value
          .replace(/[^\w-,\s\n]/g, '')
          .replace(/,+/g, ' ')
          .replace(/[\n\s]+/g, ' ')
          .replace(/([\w-]+)/g, '"$1" ')
          .replace(/\s+(?="|\w)/g, ', ')
          .replace(/"\s+/g, '"');
        task.options.projection = `[${projection}]`;
      }
    } else
      task[e.target.name] = e.target.value;
    if (toPush) tasks.push(task);
    this.setState({ tasks });
  }
  
  addNewTask() {
    const tasks = this.state.tasks.slice();
    const taskHeaders = Object.assign({}, this.state.taskHeaders);
    const taskBodyParams = Object.assign({}, this.state.taskBodyParams);
    const task = {
      id: this.taskCounter++,
      options: {},
    };
    tasks.push(task);
    taskHeaders[task.id] = [];
    taskBodyParams[task.id] = [];
    this.setState({ tasks, taskHeaders, taskBodyParams });
  }
  
  addNewHeader(id) {
    const taskHeaders = this.state.taskHeaders;
    taskHeaders[id] = taskHeaders[id] || [];
    const header = { id: this.headerCounter++ };
    taskHeaders[id].push(header);
    this.setState({ taskHeaders });
  }
  
  addNewBodyParam(id) {
    const taskBodyParams = this.state.taskBodyParams;
    taskBodyParams[id] = taskBodyParams[id] || [];
    const bodyParam = { id: this.bodyParamCounter++ };
    taskBodyParams[id].push(bodyParam);
    this.setState({ taskBodyParams });
  }
  
  back() {
    if (this.props.history)
      this.props.history.goBack();
    if (this.props.cancelLink)
      window.location.assign(this.props.cancelLink);
  }
  
  convalidateAll() {
    const stringErrors = [];
    if (!/^\w+$/.test(this.state.jobname))
      stringErrors.push('Missing job name.', <br key="1" />);
    if (!this.state.interval)
      stringErrors.push('Missing interval.', <br key="2" />);
    try {
      cronValidator.isValid(this.state.interval, true);
      // console.log('success');
    } catch (e) {
      stringErrors.push('Interval is not a valid cron string.', <br key="3" />);
      // console.log('fail');
    }
    if (!this.state.type)
      stringErrors.push('Missing job type.', <br key="4" />);
    return stringErrors;
  }
  
  mapJobStructureToState(jobStr, sync) {
    const jobStructure = jobStr || {};
    const taskHeaders = this.state.taskHeaders || {};
    const taskBodyParams = this.state.taskBodyParams || {};
    let tasks = jobStructure.tasks || [];
    this.taskCounter = 0;
    this.headerCounter = 0;
    this.bodyParamCounter = 0;
    tasks = tasks.map(t => {
      const taskId = this.taskCounter++;
      const task = t.task;
      const options = task.options || {};
      taskHeaders[taskId] = [];
      if (options.headers) {
        Object.keys(options.headers).forEach(k => {
          const id = this.headerCounter++;
          taskHeaders[taskId].push({ id, headerName: k, headerValue: options.headers[k] });
        });
      }
      taskBodyParams[taskId] = [];
      if (options.body) {
        Object.keys(options.body).forEach(k => {
          const id = this.bodyParamCounter++;
          taskBodyParams[taskId].push({ id, bodyParamName: k, bodyParamValue: options.body[k] });
        });
      }
      return {
        id: taskId,
        taskName: t.taskName,
        endpoint: task.endpoint,
        options: task.options || {},
      };
    });
    if (sync) {
      this.state.jobStructure = jobStructure || {};
      this.state.jobName = this.state.jobStructure.jobName || '';
      this.state.interval = this.state.jobStructure.interval || '';
      this.state.type = this.state.jobStructure.type || '';
      this.state.tasks = tasks;
      this.state.taskHeaders = taskHeaders;
      this.state.taskBodyParams = taskBodyParams;
    } else {
      this.setState({
        jobStructure,
        jobName: jobStructure.jobName || '',
        interval: jobStructure.interval || '',
        type: jobStructure.type || '',
        tasks,
        taskHeaders,
        taskBodyParams,
      });
    }
  }
  
  toggleModal(modal, callback) {
    if (callback)
      callback();
    this.setState(prevState => ({
      modalShow: !prevState.modalShow,
      modal: modal || prevState.modal,
    }));
  }
  
  render() {
    return (
      <DefaultFrame>
        <div className="createView" style={Styles.fontSaira}>
          <h1>{(this.state.jobStructure.jobName && 'Edit Job') || 'New Job'}</h1>
          <Form className="form" action="/" style={Styles.fontSaira}>
            <FormGroup>
              <Label for="jobname">Job name:</Label>
              <InputGroup>
                <InputGroupIcon style={Styles.InputAppend} materialIconName="build" />
                <Input 
                  type="text" 
                  name="jobName" 
                  id="jobName" 
                  onChange={e => this.onChange(e)} 
                  placeholder="Name" 
                  style={Styles.Input}
                  value={this.state.jobName}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="interval">Interval:</Label>
              <InputGroup>
                <InputGroupIcon style={Styles.InputAppend} materialIconName="schedule" />
                <Input 
                  type="text" 
                  name="interval" 
                  id="interval" 
                  onChange={e => this.onChange(e)} 
                  placeholder="Cron Interval" 
                  style={Styles.Input}
                  value={this.state.interval}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="type">Type:</Label>
              <DropdownInput 
                async
                className="marginBottom"
                id="type"
                name="type"
                loadOptions={this.getJobTypeOptions}
                defaultOptions
                placeholder={this.state.jobStructure.type || 'Type'} 
                style={{ marginBottom: '1rem' }}
                onChange={e => this.onChange(e)}
                value={this.state.type}
              />
            </FormGroup>
            <FormGroup>
              <Label for="type">Parametrized:</Label>
              <DropdownInput 
                className="marginBottom"
                id="parameters"
                name="parameters"
                options={[{ label: 'True', value: true }, { label: 'False', value: false }]}
                placeholder={this.state.jobStructure.parameters || 'Parametrized'} 
                style={{ marginBottom: '1rem' }}
                onChange={e => this.onChange(e)}
                value={this.state.parameters}
              />
            </FormGroup>
            <FormGroup>
              <Label>Tasks:</Label>
              <div className="panelContainer">
                {this.getTasksElem()}
              </div>
              <Button onClick={e => this.addNewTask(e)} style={{ display: 'block' }}>Add new task</Button>
            </FormGroup>
          </Form>
          <Button color="primary" onClick={e => this.onSave(e)}>Save</Button>
          {this.props.jobStructure && <Button color="danger" onClick={e => this.onDelete(e)}>Delete</Button>}
          <Button color="secondary" onClick={e => this.onCancel(e)}>Cancel</Button>
        </div>
        {this.getModal()}
      </DefaultFrame>
    );
  }
}
