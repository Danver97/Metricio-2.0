import React from 'react';

import Toolbar from '../dashboard-elements/toolbar/widget';
import Menu from '../dashboard-elements/toolbar/menu/widget';
import MenuElement from '../dashboard-elements/toolbar/menu/menu-element/widget';
import MenuButton from '../dashboard-elements/toolbar/menu-button/widget';

import Table from '../dashboard-elements/table/widget';
import TitledTableStructure from '../../lib/structures/titledTable';

import './styles.scss';

export default class DefaultFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.keycounter = 0;
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  
  onLinkClick(link) {
    window.location.assign(link);
  }
  
  getTitledTable(t) {
    const key = this.keycounter++;
    return (
      <div key={key}>
        <div className="title">
          <h4>{t.title || 'No title'}</h4>
          {
            t.titleLink && typeof t.titleLink === 'string' && t.titleLink !== ''
             && <div className="link" onClick={this.onLinkClick.bind(this, t.titleLink)}>{t.titleButton || 'Add User'}</div>
          }
        </div>
        <Table elements={t.elements} />
      </div>
    );
  }
  
  getTitledTables() {
    if (!this.props.titledTables)
      return [];
    if (!Array.isArray(this.props.titledTables)) {
      if (!(this.props.titledTables instanceof TitledTableStructure))
        throw new Error('Expected an instance of TitledTableStructure');
      const titledTable = this.props.titledTables;
      return this.getTitledTable(titledTable);
    }
    const titledTables = this.props.titledTables;
    return titledTables.map(t => this.getTitledTable(t));
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
      <div className="frame">
        <Toolbar name="toolbar">
          {this.state.showMenu && 
            <Menu clickHandler={this.toggleMenu} >
              <MenuElement link="/dashsuites">Dashboard Suites</MenuElement>
              <MenuElement link="/users">Users</MenuElement>
            </Menu>
          }
          <MenuButton name="Menu" title="Menu" clickHandler={this.toggleMenu} />
          {this.props.toolbarChildren}
        </Toolbar>
        <div className="default_container" style={this.props.containerStyle}>
          <h1>{this.props.title}</h1>
          {this.props.children}
          {this.getTitledTables()}
        </div>
      </div>
    );
  }
}
