import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import BaseWidget from '../base';
import './styles.scss';

export default class BuildStatusWidget extends BaseWidget {
  constructor(props) {
    super(props);
    this.state = {
      outcome: undefined,
      updatedAt: undefined,
    };
  }
  
  static get layout() {
    const l = super.layout;
    l.isResizable = false;
    return l;
  }
  
  /*
  componentDidMount() {
    const script = document.createElement("script");
    const scriptCode = document.createTextNode("fitText(document.querySelector('h2.widget__value'), 0.38)");
    script.appendChild(scriptCode);
    document.body.appendChild(script);
  }
  */

  render() {
    const classList = classNames(
      ...this.classList,
      'widget__buildStatus',
      `widget--${this.state.outcome}`,
    );

    return (
      <div className={classList}>
        <h1 className="widget__title">{this.props.title}</h1>
        <h2 className="widget__value">{this.state.outcome ? this.state.outcome : '---'}</h2>
        {this.state.updatedAt && <p className="widget__updatedAt">{this.state.updatedAt}</p>}
      </div>
    );
  }
}

//<h2 className="widget__value">{this.state.outcome ? this.state.outcome : '---'}</h2>
/*
          <svg viewBox="0 0 150 25">
            <text x="0" y="18" fill="white">{this.state.outcome ? this.state.outcome.toUpperCase() : '---'}</text>
          </svg>
*/

BuildStatusWidget.propTypes = {
  title: PropTypes.string.isRequired,
};
