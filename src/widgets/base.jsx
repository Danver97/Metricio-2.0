import React from 'react';
import PropTypes from 'prop-types';

import logger from '../../lib/logger';

export default class BaseWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.children = this.props.children;
    this.state.structure = props.structure;
    this.state.socketListener = {};
    this.classList = ['widget', `widget__${this.props.name}`];
    if (this.props.size) this.classList.push(`widget--${this.props.size}`);
  }
  
  static get requiredProp() {
    return ['size', 'name', 'socket'];
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
    const socketListener = this.props.socket.on(`widget:update:${this.props.name}`, data => {
      logger('info', `updating widget: ${this.props.name}`, data);
      this.setState(data);
    });
    this.setState({ socketListener });
  }
  
  componentWillUnmount() {
    this.props.socket.removeAllListeners(`widget:update:${this.props.name}`);
    this.props.socket.disconnect();
  }
  
  addChild(childStructure) {
    const structure = Object.assign(this.state.structure);
    structure.addChild(childStructure);
    this.setState(this.state.children.concat([React.createComponent(DynamicComponent, childStructure.attrs)]));
  }
}

BaseWidget.defaultProps = {
  size: 'small',
};

BaseWidget.propTypes = {
  size: PropTypes.string,
  name: PropTypes.string.isRequired,
  socket: PropTypes.shape.isRequired,
};
