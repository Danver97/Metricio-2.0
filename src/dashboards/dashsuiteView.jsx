import React from 'react';
import ReactDOM from 'react-dom';

import '../styles/default.scss';

import DefaultFrame from '../react-elements/default-frame/widget';
import { getBoardsStruct } from '../lib/titledTableStructures';

function getDashsuiteName() {
  return window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
}

ReactDOM.render(
  <DefaultFrame titledTables={[getBoardsStruct(getDashsuiteName(), 'Add New')]} >
    <h1>{getDashsuiteName()}</h1>
  </DefaultFrame>,
  document.getElementById('content'),
);
