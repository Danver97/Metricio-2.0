import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { VictoryPie, VictoryAnimation, VictoryLabel } from 'victory';

import BaseWidget from '../base';
import './styles.scss';

export default class ProgressWidget extends BaseWidget {
  constructor(props) {
    super(props);
    this.state = {
      progress: undefined,
      updatedAt: undefined,
    };
  }
  static get layout() {
    return {
      x: 0,
      y: 0,
      w: 4,
      h: 5,
      minH: 5,
      maxH: 5,
      minW: 2,
      maxW: 4,
    };
  }

  parseProgress(percent) {
    return [{ x: 1, y: percent }, { x: 2, y: 100 - percent, fill: '#b57b9b' }];
  }

  renderSVG(progress) {
    return (
      <svg className="round-progress" viewBox="0 0 400 400" width="100%" height="100%">
        <VictoryPie
          standalone={false}
          animate={{ duration: 1000 }}
          data={progress}
          innerRadius={110}
          labels={() => null}
        />
        <VictoryAnimation duration={1000} data={this.state}>
          {newProps => (
            <VictoryLabel
              className="progress__text"
              textAnchor="middle"
              verticalAnchor="middle"
              x={200}
              y={200}
              text={Math.round(newProps.progress)}
              style={{
                fill: '#fff',
                fontSize: 125,
                fontWeight: 700,
                fontFamily: 'Saira',
              }}
            />
          )}
        </VictoryAnimation>
      </svg>
    );
  }

  render() {
    const classList = classNames(...this.classList, 'widget__progress');
    const progress = this.parseProgress(this.state.progress);

    return (
      <div className={classList}>
        <h1 className="widget__title">{this.props.title}</h1>
        {this.state.progress === undefined && <h2 className="widget__value">---</h2>}
        {this.state.progress !== undefined && this.renderSVG(progress)}
        {this.state.updatedAt && <p className="widget__updatedAt">{this.state.updatedAt}</p>}
      </div>
    );
  }
}

ProgressWidget.propTypes = {
  title: PropTypes.string.isRequired,
};
