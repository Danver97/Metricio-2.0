import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

export default class DashboardToolbarButton extends React.Component {

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
    return (<div className="toolbar-button button" onClick={this.handleClick}><p>{this.props.title}</p></div>);
  }
}

DashboardToolbarButton.propTypes = {
  title: PropTypes.string.isRequired,
};