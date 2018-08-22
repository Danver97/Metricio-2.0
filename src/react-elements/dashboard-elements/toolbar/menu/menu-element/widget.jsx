import React from 'react';

import './styles.scss';

export default class MenuElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
  }
  
  onClick() {
    window.location.assign(this.props.link);
  }
  
  render() {
    return (
      <div className="menu-element" onClick={this.onClick} >
        {this.props.children}
      </div>
    );
  }
}
