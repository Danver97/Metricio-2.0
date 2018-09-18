import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

export default class DashboardToolbarMenuButton extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(){
    this.props.clickHandler();
  }

  render() {
    return (
      <div className="notSelectable button menu-button" onClick={this.handleClick}>
        <i className="notSelectable material-icons">menu</i>
        <p>{this.props.title}</p>
      </div>
    );
  }
}

DashboardToolbarMenuButton.propTypes = {
  title: PropTypes.string.isRequired,
};