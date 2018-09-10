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

export default class GraphWidget extends BaseWidget {
  constructor(props) {
    super(props);
    const { data } = this.props;
    const data2 = data || {
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
      categories: this.getCategories(data2),
      data: this.getData(data2),
      aggregators: this.props.aggregators || [],
    };
    
    this.colors = ['#DB2763', '#0B7A75', '#645DD7', '#FF4242'/* , '#F2FF49' */];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    
    this.getChart = this.getChart.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }
  
  static get layout() {
    const l = super.layout;
    l.minH = 10;
    l.h = 10;
    l.maxH = 12;
    l.maxW = 12;
    return l;
  }
  
  componentWillMount() {
    super.componentWillMount();
    this.props.socket.on(`widget:update:${this.props.jobName}:${this.props.name}`, datas => {
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
    let dataArray = [];
    try {
      if (typeof data === 'object')
        dataArray = data.series || this.state.data || [];
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
    } catch (e) {
      dataArray = [];
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
    return (
      <div className="widget widget__graph" style={{ backgroundColor: this.color }}>
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

          <XAxis 
            labels={{ style: { color: 'white' } }} 
            categories={this.props.type === 'histogram' && (this.state.categories || ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums'])} 
          />

          <YAxis labels={{ style: { color: 'white' } }}>
            { this.props.type === 'histogram' && 
              this.state.data.map((d, i) => <ColumnSeries key={'columnserie'+i} name={d.name} data={d.data} />)} 
            { this.props.type !== 'histogram' && 
              this.state.data.map((d, i) => <SplineSeries key={'splineserie'+i} name={d.name} data={d.data} />)}
            {
              this.state.aggregators.map((a, i) => 
                <SplineSeries key={'splineserie'+i} name={a.name} data={this.getAggregatorSerie(a)} />)
            }
            
            
          </YAxis>
        </HighchartsChart>

      </div>
    );
  }
}
// <Title style={{ color: 'white' }}>Combination chart</Title>

GraphWidget.propTypes = {
  title: PropTypes.string.isRequired,
};
