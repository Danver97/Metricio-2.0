import React from 'react';
import PropTypes from 'prop-types';
import { HighchartsChart, Chart, Tooltip, XAxis, YAxis, Legend, ColumnSeries, SplineSeries } from 'react-jsx-highcharts';
import logger from '../../../lib/logger';

import BaseWidget from '../base';

import './styles.scss';

/*
DATA STRUCTURE:

data = [
  {
    name: string,
    data: {
      cat1: number,
      cat2: number,
      ...
      catN: number,
    }
  },
  or
  {
    name: string,
    data: [number],
    categories: [string],
  }
  ...
]

or

data = {
  categories: [string],
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

export default class HistogramWidget extends BaseWidget {
  constructor(props) {
    super(props);
    const dataP = this.props.data;
    const data = dataP || {
      categories: ['Apples', 'Oranges', 'Bananas'],
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
      categories: this.getCategories(data),
      data: this.getData(data),
      aggregators: this.props.aggregators || [],
    };
    
    this.getChart = this.getChart.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }
  
  componentWillMount() {
    super.componentWillMount();
    this.props.socket.on(`widget:update:${this.props.jobName}:${this.props.name}`, datas => {
      logger('info', `updating widget: ${this.props.jobName}:${this.props.name}`, datas);
      console.log(this.getCategories(datas.value));
      this.setState({
        categories: this.getCategories(datas.value),
        data: this.getData(datas.value),
      });
    });
  }
  
  getCategories(data) {
    let categories;
    if (typeof data === 'object')
      categories = data.categories.slice();
    else if (Array.isArray(data)) {
      categories = [];
      // this.state.categories = this.getCategories(data);
      data.forEach(s => {
        if (s.categories)
          s.categories.forEach(c => this.addCatToCatArray(categories, c));
        if (typeof s.data === 'object')
          Object.keys(s.data).forEach(k => this.addCatToCatArray(categories, k));
      });
    }
    return categories;
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
  
  addCatToCatArray(array, cat) {
    if (!array.includes(cat))
      array.push(cat);
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
  
  render() {    
    // const colors = ['#DB2763', '#0B7A75', '#645DD7', '#FF4242', '#F2FF49'];
    
    return (
      <div className="widget widget__histogram">
        <h1 className="widget__title">{this.props.title}</h1>
        <HighchartsChart plotOptions={plotOptions} callback={this.getChart}>
          <Chart backgroundColor="none" style={{ width: '100%' }} />
          
          <Tooltip 
            useHTML 
            headerFormat={'<small>{point.key}</small><table>'} 
            pointFormat={'<tr><td style="color: {series.color}">{series.name}: </td><td style="text-align: right"><b>{point.y}</b></td></tr>'} 
            footerFormat="</table>" 
            valueDecimals={2} 
          />

          <Legend itemStyle={{ color: 'white' }} />

          <XAxis labels={{ style: { color: 'white' } }} categories={this.state.categories || ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']} />

          <YAxis labels={{ style: { color: 'white' } }}>
            {
              this.state.data.map(d => <ColumnSeries name={d.name} data={d.data} />)
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
// <Title style={{ color: 'white' }}>Combination chart</Title>

HistogramWidget.propTypes = {
  title: PropTypes.string.isRequired,
};
