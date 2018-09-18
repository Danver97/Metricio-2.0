import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

export default class DashboardToolbarButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    this.props.clickHandler();
  }

  render() {
    return (
      <div className="notSelectable toolbar-button button" onClick={this.handleClick}>
        <i className="material-icons">{this.props.icon}</i>
        <p className={this.props.icon ? 'text' : ''}>{this.props.title}</p>
      </div>
    );
  }
}

DashboardToolbarButton.propTypes = {
  title: PropTypes.string.isRequired,
};
