import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { HighchartsChart, Chart, Tooltip, XAxis, YAxis, Legend, SplineSeries } from 'react-jsx-highcharts';

import logger from '../../../lib/logger';
import BaseWidget from '../base';

import './styles.scss';

/*
DATA STRUCTURE:

data = [{
    name: string,
    data: [number],
    // categories: [string],
  }
  ...
]

or

data = {
  // categories: [string],
  series : [
    {
      name: string,
      data: [number],
    },
    ...
  ]
}

*/

const plotOptions = {
  series: {
    borderColor: 'none',
    tooltip: {
      useHTML: true,
      headerFormat: '<small>{point.key}</small><table>',
      pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
        '<td style="text-align: right"><b>{point.y}</b></td></tr>',
      footerFormat: '</table>',
      valueDecimals: 2,
    },
  },
};

export default class SplinegraphWidget extends BaseWidget {
  constructor(props) {
    super(props);
    const { dataP } = this.props;
    const data = dataP || {
      series: [
        {
          name: 'John',
          data: [2, 3, 4],
        },
        {
          name: 'Carl',
          data: [5, 1, 2],
        },
        {
          name: 'Susan',
          data: [3, 4, 1],
        },
      ],
    };
    
    this.state = {
      data: this.getData(data),
      aggregators: this.props.aggregators || [],
    };
    
    this.getChart = this.getChart.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }
  
  getData(data) {
    let dataArray;
    if (typeof data === 'object')
      dataArray = data.series;
    else if (Array.isArray(data)) {
      dataArray = data.map(d => {
        let points;
        if (typeof d.data === 'object')
          points = this.state.categories.map(c => d.data[c] || 0);
        else if (Array.isArray(d.data)) {
          points = this.state.categories.map((c, i) => {
            if (d.categories[i] !== c)
              return 0;
            return d.data[i];
          });
        }
        const ret = JSON.parse(JSON.stringify(d));
        ret.data = points;
        return ret;
      });
    }
    return dataArray;
  }
  
  getAggregatorSerie(aggregator) {
    switch (aggregator.type) {
      case 'avg':
        return this.average(this.state.data);
      default:
        return [];
    }
  }
  
  average(series) {
    const serie = [];
    if (series.length === 1) {
      const avg = series[0].data.reduce((a, b) => a + b) / series[0].data.length;
      const res = [];
      for (let i = 0; i < series[0].data.length; i++)
        res.push(avg);
      return res;
    }
    const length = series[0].data.length;
    for (let i = 0; i < length; i++) {
      let counter = 0;
      series.forEach(s => {
        counter++;
        if (!serie[i])
          serie[i] = 0;
        serie[i] += s.data[i];
      });
      serie[i] /= counter;
    }
    return serie;
  }
  
  getChart(chart) {
    this.chart = chart;
    this.props.structure.itemCallback(this.props.structure.attrs.key, this.handleResize);
  }
  
  handleResize() {
    this.chart.reflow();
  }
  
  componentWillMount() {
    super.componentWillMount();
    this.props.socket.on(`widget:update:${this.props.jobName}:${this.props.name}`, datas => {
      logger('info', `updating widget: ${this.props.jobName}:${this.props.name}`, datas);
      this.setState({
        data: this.getData(datas.value),
      });
    });
  }
  
  render() {    
    // const colors = ['#DB2763', '#0B7A75', '#645DD7', '#FF4242', '#F2FF49'];
    const classList = classNames(...this.classList, 'widget', 'widget__splinegraph', 'notSelectable');
    
    return (
      <div className={classList}>
        <h1 className="widget__title">{this.props.title}</h1>
        <HighchartsChart plotOptions={plotOptions} callback={this.getChart}>
          <Chart backgroundColor="none" style={{ width: '100%' }} />
          
          <Tooltip useHTML headerFormat={'<small>{point.key}</small><table>'} pointFormat={'<tr><td style="color: {series.color}">{series.name}: </td><td style="text-align: right"><b>{point.y}</b></td></tr>'} footerFormat="</table>" valueDecimals={2} />

          <Legend itemStyle={{ color: 'white' }} />

          <XAxis labels={{ style: { color: 'white' } }} />

          <YAxis labels={{ style: { color: 'white' } }}>
            {
              this.state.data.map(d => <SplineSeries name={d.name} data={d.data} />)
            }
            {
              this.state.aggregators.map(a => 
                <SplineSeries name={a.name} data={this.getAggregatorSerie(a)} />)
            }
            
            
          </YAxis>
        </HighchartsChart>

      </div>
    );
  }
}

SplinegraphWidget.propTypes = {
  title: PropTypes.string.isRequired,
};
