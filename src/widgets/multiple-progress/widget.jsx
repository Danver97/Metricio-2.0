import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap'; // Progress
import numeral from 'numeral';
import classNames from 'classnames';

import MyProg from '../../react-elements/graphic-elements/progress/widget';

import BaseWidget from '../base';
import './styles.scss';

export default class MultipleProgressWidget extends BaseWidget {
  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: {},
      data: [
        {
          name: 'Distiller 1',
          actual: 38,
        },
        {
          name: 'Cutter 1',
          actual: 15,
          max: 150,
        },
        {
          name: 'Cutter 2',
          actual: 89,
          max: 150,
          min: 50,
          thresholds: { 50: '#008000', 100: '#ffff00', 120: '#ff0000' },
        },
      ],
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
  
  componentWillMount() {
    super.componentWillMount();
    this.props.socket.on(`widget:update:${this.props.jobName}:${this.props.name}`, data => {
      this.setState({
        data: data.value,
      });
    });
  }

  getValue(actual, max, min, str) {
    const minim = min || 0;
    if (!str)
      return numeral(((actual - minim) / (max - minim)) * 100).format('0.[00]');
    return `${actual} out of ${max}`;
  }

  toggleTooltip(target) {
    const tooltipOpen = this.state.tooltipOpen;
    tooltipOpen[target] = !tooltipOpen[target];
    this.setState({ tooltipOpen });
  }
  
  getProgress(data, i) {
    const id = this.props.id;
    return (
      <div key={i} className="data-element">
        <div className="data-title">
          <span>{data.name || 'Tool 1'}</span><span>-</span><strong>{`${this.getValue(data.actual, data.max, data.min)}%`}</strong>
        </div>
        <a id={`TooltipTrigger${id}${i}`}>
          <MyProg value={data.actual} max={data.max || 100} min={data.min || 0} thresholdsColors={data.thresholds} />
        </a>
        <Tooltip 
          placement="top" 
          isOpen={this.state.tooltipOpen[`TooltipTrigger${id}${i}`]} 
          target={`TooltipTrigger${id}${i}`} 
          toggle={() => this.toggleTooltip(`TooltipTrigger${id}${i}`)} 
        >
          {this.getValue(data.actual, data.max, data.min, true)}
        </Tooltip>
      </div>
    );
  }
  
  getProgresses(dataArr) {
    return dataArr.map((e, i) => {
      if (e.actual && e.name) {
        e.max = e.max || 100;
        return this.getProgress(e, i);
      }
      return null;
    });
  }

  render() {
    const classList = classNames(...this.classList, 'widget', 'widget__multipleprogress', 'notSelectable');
    return (
      <div className={classList}>
        <h1 className="widget__title">{this.props.title}</h1>
        <div className="widget__data">
          {this.getProgresses(this.state.data)}
        </div>
        {this.state.updatedAt && <p className="widget__updatedAt">{this.state.updatedAt}</p>}
      </div>
    );
  }
}

MultipleProgressWidget.propTypes = {
  title: PropTypes.string.isRequired,
};
