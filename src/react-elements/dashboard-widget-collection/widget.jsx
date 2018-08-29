import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DashboardWidgetSelector from '../dashboard-widget-selector/widget';
import Widgets from "../../widgets/Widgets";

import BaseWidget from '../../widgets/base';
import './styles.scss';

export default class DashboardWidgetCollection extends BaseWidget {

  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    //this.handleClick = this.handleClick.bind(this);
    //console.log(props);
  }
  
  static get layout() {
    const l = super.layout;
    l.minH = 3;
    return l;
  }
  
  static get className() {
    return 'DashboardWidgetCollection';
  }

  render() {
    const classList = classNames(
      ...this.classList,
      'widget__collection'
    );
    return (
      <div className={classList}>
        <h1 className="widget__title title">Add new widget</h1>
        <div className="collection">
          {Object.keys(Widgets).filter(k => !k.includes('Dashboard')).map((k) => React.createElement(DashboardWidgetSelector, { parentKey: this.props.id.toString(), title: k, clickHandler: this.props.selectorClickHandler }))}
        </div>
      </div>);
  }
}

DashboardWidgetCollection.propTypes = {
  title: PropTypes.string.isRequired
};