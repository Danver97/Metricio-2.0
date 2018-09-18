import React from 'react';
import socketIOClient from 'socket.io-client';
import qs from 'query-string';
import { Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Chip from '@material-ui/core/Chip';


// React Elements
// rst
import DashboardGrid from '../react-elements/dashboard-grid/widget';
import ToolbarButton from '../react-elements/dashboard-elements/toolbar/button/widget';
import DefaultFrame from '../react-elements/default-frame/widget';
import DashTreeList from '../react-elements/dashboard-tree-list/widget';
// rcl

// Utils
// rst
// import Widgets from './Widgets';
import ComponentStructure from '../lib/structures/component';
import DynamicComponents from '../dynamic_components';
import { getSync, get } from '../lib/requests';
import AuthService from '../lib/authService';
import { gridItemCM } from './context-menu-holder';
import urlPaths from '../lib/url_paths';
import Styles from '../react-elements/styles';
// rcl

function renderWidgets(props, socket) {
  return React.Children.map(props.children, child => React.cloneElement(child, { socket }));
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.Auth = new AuthService(window.location.host);
    this.state = {
      title: this.props.title,
      showMenu: false,
      isSaved: false,
      childrenStructure: this.props.childrenStructure || [],
      children: this.props.children ? this.props.children.slice() : [],
      modal: {},
    };
    
    this.socket = socketIOClient(`http://${window.location.host}`);
    this.dashStructure = {};
    this.varsValues = this.props.query || {};

    if (this.props.title) {
      this.getSavedDashboard();
    }

    this.saveOnClick = this.saveOnClick.bind(this);
    this.addPanel = this.addPanel.bind(this);
    this.addJob = this.addJob.bind(this);
    this.addVariable = this.addVariable.bind(this);
    this.removeChildStructure = this.removeChildStructure.bind(this);
    this.removeChild = this.removeChild.bind(this);
    this.getReactComponent = this.getReactComponent.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onVarChipClick = this.onVarChipClick.bind(this);
    this.getModal = this.getModal.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.editChild = this.editChild.bind(this);
    this.refreshDashboard = this.refreshDashboard.bind(this);
    this.refreshStateStruct = this.refreshStateStruct.bind(this);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.title !== nextProps.title && this.state.title === nextState.title) {
      this.refreshDashboard(nextProps.title);
      this.varsValues = nextProps.query;
      this.setState({ title: nextProps.title });
    }
    return true;
  }
  
  componentWillUnmount() {
    this.socket.disconnect();
  }
  
  /* componentDidMount() {
    console.log('componentDidMount');
    get(urlPaths.dashboard.get.getStructure(this.props.title), { Authorization: `'Bearer ${this.Auth.getToken()}` }, (xhttp) => {
      const structure = JSON.parse(xhttp.responseText);
      console.log(JSON.stringify(structure.layouts));
      structure.children = structure.children
        .map(c => new ComponentStructure(c.type, c.attrs, c.children));
      this.dashStructure = structure;
      this.refreshStateStruct();
    });
  } */

  onLayoutChange(layout) {
    this.dashStructure.layouts = layout;
    this.setState({ layout, isSaved: false });
  }
  
  onVarChipClick(id, name, value) {
    const body = (
      <div>
        <Label for={name} style={{ float: 'none' }}>Value:</Label>
        <Input 
          type="text" 
          id="editVar" 
          name={name} 
          onChange={e => this.setState({ modalVar: { id, name, value: e.target.value } })} 
          defaultValue={value !== 'no value' ? value : ''} 
          placeholder="no value" 
          style={Object.assign({ marginLeft: 0 }, Styles.InputDark)}
        />
      </div>
    );
    this.toggleModal({
      title: `Edit value of variable "${name}"`,
      body,
      confirmButton: 'Confirm',
      cancelButton: 'Cancel',
      confirmAction: () => {
        const modalVar = this.state.modalVar;
        if (id !== modalVar.id)
          return;
        const vars = this.state.vars.slice();
        const idx = vars.findIndex(e => e.id === id);
        vars[idx] = modalVar;
        this.varsValues[modalVar.name] = modalVar.value;
        this.setState({ vars });
        this.refreshDashboard(this.props.title);
      },
    });
  }

  getReactComponent(componentStructure) {
    return (new DynamicComponents({ structure: componentStructure })).render();
  }

  getSavedDashboard() {
    getSync(urlPaths.dashboard.get.getStructure(this.props.title), { Authorization: `'Bearer ${this.Auth.getToken()}` }, (xhttp) => {
      const structure = JSON.parse(xhttp.responseText);
      structure.children = structure.children
        .map(c => new ComponentStructure(c.type, c.attrs, c.children));
      this.dashStructure = structure;
      this.refreshStateStruct(true);
    });
  }
  
  getDashboardGrid() {
    return (
      <DashboardGrid 
        key="dash" 
        layout={this.state.layout} 
        history={this.props.history} 
        childrenStructure={this.state.childrenStructure} 
        onLayoutChange={this.onLayoutChange} 
      >
        {renderWidgets(this.state, this.socket)}
      </DashboardGrid>
    );
  }
  
  getVarsChips() {
    const vars = this.state.vars || ['Var 1', 'Var 2', 'Var 3'];
    return vars.map(el => (
      <Chip 
        key={el.id} 
        id={el.id} 
        label={`${el.name}: ${el.value}`} 
        color="secondary" 
        onClick={() => this.onVarChipClick(el.id, el.name, el.value)}
        style={{ marginRight: '0.5rem' }}
      />
    ));
    // onDelete={() => console.log({ target: { id: el.id, data: el.name } })}
  }
  
  getModal() {
    return (
      <Modal isOpen={this.state.modalShow} toggle={this.toggleModal} className={this.props.className} style={{ color: 'black' }}>
        <ModalHeader toggle={this.toggleModal}>{this.state.modal.title}</ModalHeader>
        <ModalBody style={{ fontSize: '1rem' }}>
          {this.state.modal.body}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => this.toggleModal(null, this.state.modal.confirmAction)} style={{ marginRight: '0.5rem' }}>
            {this.state.modal.confirmButton || 'Confirm'}
          </Button>
          {this.state.modal.cancelButton && <Button color="secondary" onClick={() => this.toggleModal()}>{this.state.modal.cancelButton}</Button>}
        </ModalFooter>
      </Modal>
    );
  }
  
  toggleModal(modal, callback) {
    if (callback)
      callback();
    this.setState(prevState => ({
      modalShow: !prevState.modalShow,
      modal: modal || prevState.modal,
    }));
  }
  
  refreshDashboard(title) {
    if (!title)
      return;
    get(urlPaths.dashboard.get.getStructure(title), { Authorization: `'Bearer ${this.Auth.getToken()}` }, (xhttp) => {
      const structure = JSON.parse(xhttp.responseText);
      structure.children = structure.children
        .map(c => new ComponentStructure(c.type, c.attrs, c.children));
      this.dashStructure = structure;
      if (this.props.onRefresh) 
        this.props.onRefresh(title, this.state.vars);
      this.socket = socketIOClient(`http://${window.location.host}`);
      this.refreshStateStruct();
    });
  }
  
  refreshStateStruct(notMount) {
    const varsValues = this.varsValues || {}; // this.props.query
    const vars = this.dashStructure.vars.map((v, i) => ({
      id: i,
      name: v.name,
      type: v.type,
      value: varsValues[v.name] || 'no value',
    }));
    if (notMount) {
      this.state.layout = this.dashStructure.layouts;
      this.state.childrenStructure = this.dashStructure.children;
      this.state.children = this.dashStructure.children.map(c => this.getReactComponent(c));
      this.state.vars = vars;
      return;
    }
    this.setState({
      layout: this.dashStructure.layouts,
      childrenStructure: this.dashStructure.children,
      children: this.dashStructure.children.map(c => this.getReactComponent(c)),
      vars,
    });
  }

  addToDashStructure(childStructure) {
    const dashStr = this.dashStructure;
    dashStr.children.push(childStructure);
    dashStr.layouts.push(Object.assign({}, {
      id: childStructure.attrs.id.toString(),
    }, childStructure.attrs.layout));
  }

  removeFromDashStructure(childStructure) {
    const dashStr = this.dashStructure;
    dashStr.children = dashStr.children.filter(x => x.attrs.id !== childStructure.attrs.id);
    dashStr.layouts = dashStr.layouts.filter(x => x.id !== childStructure.attrs.id.toString());
  }

  saveOnClick() {
    if (this.state.isSaved) {
      return;
    }
    if (this.props.onSave) {
      this.dashStructure.children = this.state.childrenStructure;
      this.props.onSave(this.dashStructure);
      this.setState({ isSaved: true });
    }
  }

  addPanel() {
    if (this.props.onAddPanel)
      this.props.onAddPanel();
  }

  addJob() {
    if (this.props.onJob)
      this.props.onJob();
  }
  
  addVariable() {
    if (this.props.onVariable)
      this.props.onVariable();
  }
  
  removeChildStructure(childKey) {
    // console.log('REMOVING CHILD STRUCTURE');

    const childStructure = this.state.childrenStructure.filter(x => x.attrs.key === childKey)[0];

    let childrenStructure = this.state.childrenStructure.slice();
    childrenStructure = childrenStructure.filter(x => x.attrs.key !== childKey);

    this.removeFromDashStructure(childStructure);
    this.setState({ childrenStructure });
    this.removeChild(childStructure);
  }

  removeChild(childStructure) {
    // console.log('REMOVING CHILD ELEMENT');
    let children = this.state.children.slice();
    children = children.filter(x => childStructure.attrs.id !== x.props.id);
    this.setState({ children });
  }
  
  editChild(id) {
    const endpoint = `${this.props.editUrl}?${qs.stringify({ compId: id })}`;
    if (this.props.history) {
      this.props.history.push(endpoint);
      return;
    }
    window.location.assign(endpoint);
  }
  
  render() {
    const toolbarChildren = [
      <DashTreeList key="dashtreelist" history={this.props.history} onNavigate={this.refreshDashboard} />,
      <ToolbarButton key="toolbarbutton1" icon="save" title="Save" clickHandler={this.saveOnClick} />,
      <ToolbarButton key="toolbarbutton2" icon="code" title="Varibles" clickHandler={this.addVariable} />,
      <ToolbarButton key="toolbarbutton3" icon="library_add" title="Add Panel" clickHandler={this.addPanel} />,
      <ToolbarButton key="toolbarbutton4" icon="build" title="Jobs" clickHandler={this.addJob} />,
    ];
    return (
      <DefaultFrame history={this.props.history} toolbarChildren={toolbarChildren} containerStyle={{ padding: '0' }}>
        {this.state.vars && this.state.vars.length > 0 && 
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '1rem',
            padding: '0.5rem',
            paddingBottom: '0',
          }}
          >
            <span style={{ marginRight: '0.5rem' }}>Variables:</span>
            {this.getVarsChips()}
          </div>}
        {this.getDashboardGrid()}
        {
          gridItemCM(
            (e, data) => this.editChild(data.name),
            (e, data) => this.removeChildStructure(data.name)
          )
        }
        {this.getModal()}
      </DefaultFrame>
    );
  }
}

export default Dashboard;
