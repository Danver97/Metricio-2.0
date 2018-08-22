import React from 'react';
import ReactDOM from 'react-dom';
import socketIOClient from 'socket.io-client';

import DashTreeHandler from '../lib/dashTreeHandler';

import '../styles/default.scss';

import Dashboard from '../widgets/dashboard';
import ComponentStructure from '../lib/structures/component';
import SparklineWidget from '../widgets/sparkline/widget';
import PingWidget from '../widgets/ping/widget';
import BuildStatusWidget from '../widgets/build-status/widget';
import ProgressWidget from '../widgets/progress/widget';
import NumberWidget from '../widgets/number/widget';
/*
import DynamicComponents from '../dynamic_components';
*/

const socket = socketIOClient(`http://${window.location.host}`);

window.dashStructure = [{
  type: 'Dashboard',
  name: 'index2',
  href: '/dashboard/index2',
  dashTree: ['index2'],
  attrs: { name: 'dash' },
  layouts: [],
  children: [
    new ComponentStructure('SparklineWidget', {
      id: 'a',
      name: 'DemoUsers',
      title: 'Users',
      socket,
      layout: SparklineWidget.layout,
      format: '0.00a',
    }),
    new ComponentStructure('PingWidget', {
      id: 'b',
      name: 'GooglePing',
      socket,
      layout: PingWidget.layout,
      title: 'API',
    }),
    new ComponentStructure('BuildStatusWidget', {
      id: 'c',
      name: 'DemoMaster',
      title: 'Build - Master',
      socket,
      layout: BuildStatusWidget.layout,
      size: 'medium',
    }),
    new ComponentStructure('ProgressWidget', {
      id: 'd',
      name: 'DemoProgress',
      title: 'Sales Target',
      socket,
      layout: ProgressWidget.layout,
    }),
    new ComponentStructure('NumberWidget', {
      id: 'e',
      name: 'DemoConversion',
      title: 'Conversion',
      socket,
      layout: NumberWidget.layout,
      metric: '%',
      format: '0.0a',
    }),
    new ComponentStructure('BuildStatusWidget', {
      id: 'f',
      name: 'DemoDevelop',
      title: 'Build - Develop',
      socket,
      layout: BuildStatusWidget.layout,
      size: 'medium',
    }),
  ],
}];

/*window.dashTree = [{
  name: 'Dashboard',
  href: `http://${window.location.host}/dashboard/index2`,
}, {
  name: 'Subdashboard',
  href: `http://${window.location.host}/dashboard/subdashboard`,
}];*/

(new DashTreeHandler()).addElement();

ReactDOM.render(
  <Dashboard title={window.location.href.substr(window.location.href.lastIndexOf('/') + 1) || 'index2'} name="dash" key="dash" childrenStructure={window.dashStructure[0].children} />,
  document.getElementById('content'),
);
/*
{React.createElement(DynamicComponents, {structure: window.dashStructure[0].children})}
*/

/*
  <Dashboard name="dash">
    {(new DynamicComponents({structure: window.dashStructure[0].children})).render()}
  </Dashboard>
*/
/*
React.createElement(DynamicComponents, {items:JSON.stringify(i)});
/*
    <SparklineWidget name="DemoUsers" title="Users" format="0.00a" />
    <PingWidget name="GooglePing" title="API" />
    <BuildStatusWidget name="DemoMaster" title="Build - Master" size="medium" />
    <ProgressWidget name="DemoProgress" title="Sales Target" />
    <NumberWidget name="DemoConversion" title="Conversion" metric="%" format="0.0a" />
    <BuildStatusWidget name="DemoDevelop" title="Build - Develop" size="medium" />
*/
