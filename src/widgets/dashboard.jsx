import React from 'react';
import socketIOClient from 'socket.io-client';
import qs from 'query-string';

// React Elements
// rst
// import DashboardFrame from '../react-elements/dashboard-frame/widget';
import DashboardGrid from '../react-elements/dashboard-grid/widget';
import DashboardEdit from '../react-views/dashboard-edit/widget';
import Button from '../react-elements/dashboard-elements/toolbar/button/widget';
import DefaultFrame from '../react-elements/default-frame/widget';
import DashTreeList from '../react-elements/dashboard-tree-list/widget';
// rcl

// Utils
// rst
import Widgets from './Widgets';
import ComponentStructure from '../lib/structures/component';
import DynamicComponents from '../dynamic_components';
import { post, getSync, get } from '../lib/requests';
import AuthService from '../lib/authService';
import { gridItemCM } from './context-menu-holder';
// import checker from '../lib/checkers';
// rcl

// import WidgetCollection from './dashboard-widget-collection/widget';
import JobScheduler from './job-scheduler/widget';

const CollectionName = 'DashboardWidgetCollection';

function renderWidgets(props) {
  const socket = socketIOClient(`http://${window.location.host}`);
  return React.Children.map(props.children, child => React.cloneElement(child, {
    socket,
  }));
}

// let keys = 15;

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
      collectionIsShown: false,
      collectionId: NaN,
      jobPanelIsShown: false,
      jobPanelId: NaN,
    };

    if (this.props.title) {
      this.getSavedDashboard();
    }

    /*
    TODO: togliere il supporto alla prop "childrenStructure" e
    implementare una dashStructure di default
    if (false && checker.checkArray(this.props.childrenStructure, ComponentStructure))
      this.state.children = this.state.children
        .concat((new DynamicComponents({ structure: this.state.childrenStructure }))
          .render({ toArray: true }));
    */

    this.saveOnClick = this.saveOnClick.bind(this);
    this.widgetSelectorClickHandler = this.widgetSelectorClickHandler.bind(this);
    this.addPanel = this.addPanel.bind(this);
    this.addJob = this.addJob.bind(this);
    this.addChildStructure = this.addChildStructure.bind(this);
    this.removeChildStructure = this.removeChildStructure.bind(this);
    this.addChild = this.addChild.bind(this);
    this.removeChild = this.removeChild.bind(this);
    this.getReactComponent = this.getReactComponent.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.editChild = this.editChild.bind(this);
    this.refreshDashboard = this.refreshDashboard.bind(this);
    this.refreshStateStruct = this.refreshStateStruct.bind(this);
    // this.dashListItemClick = this.dashListItemClick.bind(this);
    // this.toggleMenu = this.toggleMenu.bind(this);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.title !== nextProps.title && this.state.title === nextState.title) {
      this.refreshDashboard(nextProps.title);
      this.setState({ title: nextProps.title });
    }
    return true;
  }

  onLayoutChange(layout) {
    window.dashStructure[0].layouts = layout;
    this.setState({ layout, isSaved: false });
  }

  getReactComponent(componentStructure) {
    return (new DynamicComponents({ structure: componentStructure })).render();
  }

  getSavedDashboard() {
    getSync(this.dashboardReqUrl(this.props.title, 'getStructure'), { Authorization: `'Bearer ${this.Auth.getToken()}` }, (xhttp) => {
      const structure = JSON.parse(xhttp.responseText);
      structure.children = structure.children
        .map(c => new ComponentStructure(c.type, c.attrs, c.children));
      window.dashStructure = [structure];
      this.refreshStateStruct(true);
    });
  }
  
  getDashboardGrid() {
    return (
      <DashboardGrid key="dash" layout={this.state.layout} childrenStructure={this.state.childrenStructure} onLayoutChange={this.onLayoutChange}>
        {renderWidgets(this.state)}
      </DashboardGrid>
    );
  }

  getDashboardEdit() {
    return (<DashboardEdit childStructure={this.state.editChild} className="widget__edit" saveHandler={this.saveEdit} cancelHandler={this.cancelEdit} />);
  }
  
  refreshDashboard(title) {
    if (!title)
      return;
    get(this.dashboardReqUrl(title, 'getStructure'), { Authorization: `'Bearer ${this.Auth.getToken()}` }, (xhttp) => {
      const structure = JSON.parse(xhttp.responseText);
      structure.children = structure.children
        .map(c => new ComponentStructure(c.type, c.attrs, c.children));
      window.dashStructure = [structure];
      this.refreshStateStruct();
    });
  }
  
  refreshStateStruct(notMount) {
    if (notMount) {
      this.state.layout = window.dashStructure[0].layouts;
      this.state.childrenStructure = window.dashStructure[0].children;
      this.state.children = window.dashStructure[0].children.map(c => this.getReactComponent(c));
      return;
    }
    this.setState({
      layout: window.dashStructure[0].layouts,
      childrenStructure: window.dashStructure[0].children,
      children: window.dashStructure[0].children.map(c => this.getReactComponent(c)),
    });
  }
  
  postStructure() {
    const structure = JSON.stringify(window.dashStructure, (k, v) => { return k === 'socket' ? undefined : v; });
    post(this.dashboardReqUrl(window.dashStructure[0].name, 'save'), { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${this.Auth.getToken()}` }, `layout=${structure}`);
  }

  dashboardReqUrl(dashName, end) {
    return `http://${window.location.host}/dashboard/${dashName}/${end}`;
  }

  addToDashStructure(childStructure) {
    const dashStr = window.dashStructure[0];
    if (!childStructure.is(CollectionName) && !childStructure.is(JobScheduler)) {
      dashStr.children.push(childStructure);
      dashStr.layouts.push(Object.assign({}, {
        id: childStructure.attrs.id.toString(),
      }, childStructure.attrs.layout));
    }
  }

  removeFromDashStructure(childStructure) {
    const dashStr = window.dashStructure[0];
    if (!childStructure.is(CollectionName) && !childStructure.is(JobScheduler)) {
      dashStr.children = dashStr.children.filter(x => x.attrs.id !== childStructure.attrs.id);
      dashStr.layouts = dashStr.layouts.filter(x => x.id !== childStructure.attrs.id.toString());
    }
  }

  saveOnClick() {
    console.log('Save on click');
    if (this.state.isSaved) {
      return;
    }
    this.postStructure();
    this.setState({ isSaved: true });
  }

  addPanel(newChild, collectionKey) {
    const cn = newChild || CollectionName;
    if (cn === CollectionName && this.state.collectionIsShown) {
      this.removeChildStructure(CollectionName, collectionKey);
      this.setState({ collectionIsShown: false });
      return null;
    }
    if (cn === CollectionName)
      this.setState({ collectionIsShown: true });

    return this.addChildStructure(cn, null, null, (id) => {
      if (cn === CollectionName)
        this.setState({ collectionId: id });
      if (cn === JobScheduler.name)
        this.setState({ jobPanelId: id });
    });
  }

  addJob() {
    if (this.state.jobPanelIsShown) {
      this.removeChildStructure(JobScheduler.name);
      this.setState({ jobPanelIsShown: false });
      return;
    }
    this.setState({ jobPanelIsShown: true });
    this.addPanel(JobScheduler.name);
  }

  addChildStructure(childName, attrs, children, cb) {
    // console.log('ADDING CHILD STRUCTURE');
    const childrenStructure = this.state.childrenStructure.slice();
    const childStructure =
      new ComponentStructure(
        childName,
        attrs || {
          name: 'none',
          title: childName,
          layout: Widgets[childName].layout,
          socket: socketIOClient(`http://${window.location.host}`),
          selectorClickHandler: this.widgetSelectorClickHandler,
        }, children
      );

    let index = childrenStructure.findIndex(x => x.is(CollectionName));
    const index2 = childrenStructure.findIndex(x => x.is(JobScheduler));
    index = index > index2 ? index : index2;
    index += 1;
    childrenStructure.splice(index, 0, childStructure);

    this.addToDashStructure(childStructure);
    this.setState({
      childrenStructure,
      layout: this.state.layout.concat([childStructure.attrs.layout]),
    });

    if (cb && typeof cb === 'function') cb(childStructure.attrs.key.toString());
    return this.addChild(childStructure, index);
  }

  removeChildStructure(childName, childKey) {
    const cn = childName || CollectionName;
    let ck = childKey;
    if (cn === JobScheduler.name)
      ck = this.state.jobPanelId;
    ck = ck || this.state.collectionId;

    // console.log('REMOVING CHILD STRUCTURE');

    const childStructure = this.state.childrenStructure.filter(x => x.attrs.key === ck)[0];

    let childrenStructure = this.state.childrenStructure.slice();
    childrenStructure = childrenStructure.filter(x => /* !x.is(cn) && */ x.attrs.key !== ck);

    this.removeFromDashStructure(childStructure);
    this.setState({ childrenStructure });
    this.removeChild(childStructure);
  }

  addChild(childStructure, index) {
    // console.log('ADDING CHILD ELEMENT');

    const children = this.state.children.slice();
    const component = this.getReactComponent(childStructure);
    children.splice(index, 0, component);
    return this.setState({ children });
  }

  removeChild(childStructure) {
    // console.log('REMOVING CHILD ELEMENT');
    let children = this.state.children.slice();
    children = children.filter(x => childStructure.attrs.id !== x.props.id);
    this.setState({ children });
  }

  async widgetSelectorClickHandler(newChild, collectionKey) {
    await this.addPanel(newChild);
    await this.addPanel('DashboardWidgetCollection', collectionKey);
  }
  
  saveEdit(childStr) {
    const structure = childStr.stringify();
    post(
      this.dashboardReqUrl(window.dashStructure[0].name, 'edit'), [{
        tag: 'Content-Type',
        value: 'application/x-www-form-urlencoded',
      }],
      `structure=${structure}`
    );
    this.setState({ editMode: false });
  }
  
  cancelEdit() {
    this.setState({ editMode: false });
  }
  
  editChild(id) {
    // const cStr = this.state.childrenStructure.filter(c => c.attrs.key === id)[0] || null;
    const endpoint = `${this.props.editUrl}?${qs.stringify({ compId: id })}`;
    if (this.props.history) {
      this.props.history.push(endpoint);
    }
    window.location.assign(endpoint);
    // this.setState({ editChild: cStr, editMode: true });
  }
  
  /*
  toggleMenu() {
    this.setState((prevState) => {
      return {
        showMenu: !prevState.showMenu,
      };
    });
  }
  */
  
  render() {
    const toolbarChildren = [
      <DashTreeList history={this.props.history} onNavigate={this.refreshDashboard} />,
      <Button key="toolbarbutton1" name="Save" title="Save" clickHandler={this.saveOnClick} />,
      <Button key="toolbarbutton2" name="Add Panel" title="Add Panel" clickHandler={this.addPanel} />,
      <Button key="toolbarbutton3" name="Add Job" title="Add Job" clickHandler={this.addJob} />,
    ];
    return (
      <DefaultFrame history={this.props.history} toolbarChildren={toolbarChildren} containerStyle={{ padding: '0' }}>
        {this.state.editMode ? this.getDashboardEdit() : this.getDashboardGrid()}
        {
          gridItemCM(
            (e, data) => this.editChild(data.name),
            (e, data) => this.removeChildStructure(null, data.name)
          )
        }
      </DefaultFrame>
    );
  }
/*

      <DashboardFrame>
        <Toolbar name="toolbar">
          {this.state.showMenu && 
            <Menu clickHandler={this.toggleMenu}/>
          }
          <MenuButton name="Menu" title="Menu" clickHandler={this.toggleMenu} />
          {toolbarChildren}
        </Toolbar>
        {this.state.editMode ? this.getDashboardEdit() : this.getDashboardGrid()}
        {
          gridItemCM(
            (e, data) => this.editChild(data.name),
            (e, data) => this.removeChildStructure(null, data.name)
          )
        }
      </DashboardFrame>
*/

// {editMode ? this.getDashboardEdit() : null}
// <div className="dashboard"> {renderWidgets(this.state)}</div>
// {renderWidgets(this.props)}
}

export default Dashboard;
