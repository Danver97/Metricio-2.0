import React from 'react';
import Toolbar from '../dashboard-elements/toolbar/widget';
import Menu from '../dashboard-elements/toolbar/menu/widget';
import MenuElement from '../dashboard-elements/toolbar/menu/menu-element/widget';
import MenuButton from '../dashboard-elements/toolbar/menu-button/widget';

import Table from '../dashboard-elements/table/widget';

import './styles.scss';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  
  static get className() {
    return 'Home';
  }
  
  getUsers() {
    // request...
    const keyOrder = ['name', 'role'];
    const users = [{
      name: 'Christian',
      role: 'Admin',
      password: 'Christian',
    }, {
      name: 'Germano',
      role: 'Moderator',
    }];
    
    // return ['pinco', 'pallo'];
    return this.getCollectionOfOrderedByKeyObjects(users, keyOrder);
  }
  
  getCollectionOfOrderedByKeyObjects(collection, keyOrder) {
    const orderedCollection = [];
    collection.forEach(elem => {
      const newElem = {};
      keyOrder.forEach(k => newElem[k] = elem[k]);
      orderedCollection.push(newElem);
    });
    return orderedCollection;
  }
  
  toggleMenu() {
    this.setState((prevState) => {
      return {
        showMenu: !prevState.showMenu,
      };
    });
  }
  
  render() {
    return (
      <div className="home">
        <Toolbar name="toolbar">
          {this.state.showMenu && 
            <Menu clickHandler={this.toggleMenu} >
              <MenuElement link="/suites">Dashboard Suites</MenuElement>
              <MenuElement link="/users">Users</MenuElement>
            </Menu>
          }
          <MenuButton name="Menu" title="Menu" clickHandler={this.toggleMenu} />
        </Toolbar>
        <div className="title">
          <h4>{this.props.title || 'Users'}</h4>
          {
            this.props.titleLink && typeof this.props.titleLink === 'string' && this.props.titleLink !== ''
             && <div className="link" onClick={this.onLinkClick}>{this.props.titleButton || 'Add User'}</div>
          }
        </div>
        <Table elements={this.getUsers()} />  
      </div>
    );
  }
}
// [{name: 'tizio', type: 'admin'}, {name: 'caio', type: 'user'}]
