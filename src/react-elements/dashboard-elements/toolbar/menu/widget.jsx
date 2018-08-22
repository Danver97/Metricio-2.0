import React from 'react';
import Element from './menu-element/widget';

import './styles.scss';

export default class ToolbarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  /* toggleMenu() {
    this.setState((prevState) => {
      return {
        showMenu: !prevState.showMenu,
      };
    });
  } */

  render() {
    return (
      <div className="menu-holder">
        <div className="menu">
          <h1>My Menu</h1>
          <p>Home</p>
          <Element link="/">Home</Element>
          {this.props.children}
        </div>
        <div className="side-overlay" onClick={this.props.clickHandler} />
      </div>
    );
  }
}
