import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap'; // Progress
// import classnames from 'classnames';

// import socketIOClient from 'socket.io-client';

import MyProg from '../../react-elements/graphic-elements/progress/widget';
// import ComponentStructure from '../../lib/structures/component';

import BaseWidget from '../base';
import './styles.scss';

export default class MultipleProgressWidget extends BaseWidget {
  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: {},
    };

    this.toggleTooltip = this.toggleTooltip.bind(this);
  }
  
  static get layout() {
    const l = super.layout;
    l.maxW = 12;
    l.maxH = 100;
    return l;
  }
  
  static get className() {
    return 'MultipleProgressWidget';
  }

  getValue(actual, max, str) {
    if (!str)
      return (actual / max) * 100;
    return actual + ' out of ' + max;
  }

  checkIfRGBHexColor(color) {
    const regex = /[A-Fa-f0-9]{6}/;
    return regex.test(color);
  }

  getColorWithAlpha(color, alpha) {
    if (this.checkIfRGBHexColor(color))
      return color + alpha;
    return 'ffffff' + alpha;
  }

  getProgressColor(color) {
    return this.getColorWithAlpha(color, '77');
  }

  getProgressBackColor(color) {
    return this.getColorWithAlpha(color, '44');
  }

  toggleTooltip(target) {
    const tooltipOpen = this.state.tooltipOpen;
    tooltipOpen[target] = !tooltipOpen[target];
    this.setState({ tooltipOpen });
  }
  
  getProgress(data, i) {
    const id = this.props.id;
    return (
      <div className="data-element">
        <div className="data-title"><span>Tool 1</span><span>-</span><strong>{this.getValue(data.actual, data.max) + '%'}</strong></div>
        <a id={'TooltipTrigger' + id + i}><MyProg value={data.actual} max={data.max || 100}/></a>
        <Tooltip placement="top" isOpen={this.state.tooltipOpen['TooltipExample' + id + i]} target={'TooltipTrigger' + id + i} toggle={this.toggleTooltip.bind(this, 'TooltipExample' + id + i)}>
          {this.getValue(data.actual, data.max, true)}
        </Tooltip>
      </div>
    );
  }

  render() {
    return (
      <div className="widget widget_multipleprogress">
        <h1 className="widget__title">{this.props.title}</h1>
        <div className="widget__data">
          <div className="data-element">
            <div className="data-title"><span>Tool 1</span><span>-</span><strong>{this.getValue(38, 100) + '%'}</strong></div>
            <a id="TooltipExample"><MyProg value={38} max={100} /></a>
            <Tooltip placement="top" isOpen={this.state.tooltipOpen['TooltipExample']} target="TooltipExample" toggle={this.toggleTooltip.bind(this, 'TooltipExample')}>
              {this.getValue(38, 100, true)}
            </Tooltip>
          </div>
          <div className="data-element">
            <div className="data-title"><span>Tool 2</span><span>-</span><strong>{this.getValue(13, 100) + '%'}</strong></div>
            <a id="TooltipExample2"><MyProg value={13} max={100} /></a>
            <Tooltip placement="top" isOpen={this.state.tooltipOpen['TooltipExample2']} target="TooltipExample2" toggle={this.toggleTooltip.bind(this, 'TooltipExample2')}>
              {this.getValue(13, 100, true)}
            </Tooltip>
          </div>
          
        </div>
        {this.state.updatedAt && <p className="widget__updatedAt">{this.state.updatedAt}</p>}
      </div>
    );
  }
}

MultipleProgressWidget.propTypes = {
  title: PropTypes.string.isRequired,
};
