import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './styles.scss';

export default class DashboardWidgetSelector extends React.Component {

  constructor(props) {
    super(props);
    //this.handleClick = this.handleClick.bind(this);
    //console.log(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(){
    // console.log(this.props.parentKey);
    this.props.clickHandler(this.props.title, this.props.parentKey);
  }

  render() {
    return (<div className="widget__selector" onClick={this.handleClick}><p>{this.props.title}</p></div>);
  }
}

DashboardWidgetSelector.propTypes = {
  title: PropTypes.string.isRequired,
};