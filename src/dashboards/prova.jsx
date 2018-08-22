import React from 'react';
import ReactDOM from 'react-dom';

import socketIOClient from 'socket.io-client';

// import MultipleProgress from '../widgets/multiple-progress/widget';
import Histogram from '../widgets/histogram/widget';

import '../styles/default.scss';

const socket = socketIOClient(`http://${window.location.host}`);

ReactDOM.render(
  <Histogram title="histogram" name="DemoHistogram" socket={socket} />,
  document.getElementById('content'),
);


// <MultipleProgress title="Tool life" name="tools" socket={socket}/>,


/*
import React from 'react';
import ReactDOM from 'react-dom';

import DashboardEdit from '../widgets/dashboard-edit/widget';
import { post } from '../lib/requests';

import '../styles/default.scss';

function saveAll(childStr) {
  const structure = childStr.stringify();
  console.log(structure);
  post('http://localhost:3000/dashboard/index2/edit', [{ tag: 'Content-Type', value: 'application/x-www-form-urlencoded' }],
      `structure=${structure}`, (xhttp) => console.log(xhttp.responseText));
}

ReactDOM.render(
  <DashboardEdit saveHandler={saveAll}/>,
  document.getElementById('content'),
);

*/

/*
import React from 'react';
import ReactDOM from 'react-dom';
import socketIOClient from 'socket.io-client';

import '../styles/default.scss';

import DashboardGrid from '../widgets/dashboard-grid/widget';
import ComponentStructure from '../lib/structures/component';
import DynamicComponents from '../dynamic_components';

const socket = socketIOClient(`http://${window.location.host}`);

window.dashStructure = [{
  type: 'Dashboard',
  attrs: {
    name: 'dash',
  },
  children: [
    new ComponentStructure('SparklineWidget', {
      id: 0,
      name: 'DemoUsers',
      title: 'Users Structure',
      socket,
      format: '0.00a',
    }),
    new ComponentStructure('PingWidget', {
      id: 1,
      name: 'GooglePing',
      socket,
      title: 'API',
    }),
    new ComponentStructure('BuildStatusWidget', {
      id: 2,
      name: 'DemoMaster',
      title: 'Build - Master',
      socket,
      size: 'medium',
    }),
    new ComponentStructure('ProgressWidget', {
      id: 3,
      name: 'DemoProgress',
      title: 'Sales Target',
      socket,
    }),
    new ComponentStructure('NumberWidget', {
      id: 4,
      name: 'DemoConversion',
      title: 'Conversion',
      socket,
      metric: '%',
      format: '0.0a',
    }),
    new ComponentStructure('BuildStatusWidget', {
      id: 5,
      name: 'DemoDevelop',
      title: 'Build - Develop',
      socket,
      size: 'medium',
    }),
    new ComponentStructure('GraphWidget', {
      id: 6,
      name: 'DemoHistogram',
      type: 'histogram',
      title: 'Build by Developer',
      aggregators: [{ name: 'Average', type: 'avg' }],
      socket,
      layout: {
        x: 0,
        y: 0,
        w: 4,
        h: 10,
        minH: 10,
        maxH: 10,
        minW: 4,
        maxW: 12,
      },
    }),
  ],
}];


ReactDOM.render(
  <DashboardGrid key="dash" isResizable={true} childrenStructure={window.dashStructure[0].children}>
    {window.dashStructure[0].children.map(c => (new DynamicComponents({ structure: c })).render())}
  </DashboardGrid>,
  document.getElementById('content'),
);

*/

/*
import React from 'react';
import ReactDOM from 'react-dom';

import '../styles/default.scss';

import Dashboard from '../widgets/dashboard';
import NumberWidget from '../widgets/number/widget';
import PingWidget from '../widgets/ping/widget';
import BuildStatusWidget from '../widgets/build-status/widget';
import SparklineWidget from '../widgets/sparkline/widget';
import ProgressWidget from '../widgets/progress/widget';

ReactDOM.render(
  <Dashboard>
    <SparklineWidget name="DemoUsers" title="Users" format="0.00a" />
    <PingWidget name="GooglePing" title="API" />
    <NumberWidget name="ReasonPRs" title="Pull Requests" />
    <BuildStatusWidget name="DemoMaster" title="Build - Master" size="medium" />
    <ProgressWidget name="DemoProgress" title="Sales Target" />
    <NumberWidget name="DemoConversion" title="Conversion" metric="%" format="0.0a" />
    <BuildStatusWidget name="DemoDevelop" title="Build - Develop" size="medium" />
  </Dashboard>,
  document.getElementById('content'),
);

*/
