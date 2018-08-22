import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

export default class DashboardToolbarMenuButton extends React.Component {

  constructor(props) {
    super(props);
    //this.handleClick = this.handleClick.bind(this);
    //console.log(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(){
    this.props.clickHandler();
  }

  render() {
    return (<div className="button menu-button" onClick={this.handleClick}><p>{this.props.title}</p></div>);
  }
}

DashboardToolbarMenuButton.propTypes = {
  title: PropTypes.string.isRequired,
};