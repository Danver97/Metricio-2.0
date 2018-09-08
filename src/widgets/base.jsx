import React from 'react';
import PropTypes from 'prop-types';

import logger from '../../lib/logger';

export default class BaseWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.children = this.props.children;
    this.state.structure = props.structure;
    this.classList = ['widget', `widget__${this.props.name}`];
    if (this.props.size) this.classList.push(`widget--${this.props.size}`);
  }
  
  static get requiredProp() {
    return ['id', 'key', 'layout', 'name', 'socket'];
  }
  
  static get allProp() {
    return ['id', 'key', 'layout', 'name', 'socket', 'color'];
  }
  
  static get layout() {
    return {
      x: 0,
      y: 0,
      w: 4,
      h: 5,
      minH: 5,
      maxH: 7,
      minW: 2,
      maxW: 4,
      static: false,
      isDraggable: true,
      isResizable: true,
    };
  }

  componentWillMount() {
    this.props.socket.on(`widget:update:${this.props.jobName}:${this.props.name}`, data => {
      logger('info', `updating widget: ${this.props.jobName}:${this.props.name}`, data);
      this.setState(data);
    });
  }
  
  componentWillUnmount() {
    this.props.socket.removeAllListeners(`widget:update:${this.props.jobName}:${this.props.name}`);
    this.props.socket.disconnect();
  }
}

BaseWidget.defaultProps = {
  size: 'small',
};

BaseWidget.propTypes = {
  size: PropTypes.string,
  name: PropTypes.string.isRequired,
  socket: PropTypes.shape.isRequired,
  // children: PropTypes.node,
};
