import React from 'react';
import ReactDOM from 'react-dom';

import '../styles/default.scss';

import DefaultFrame from '../react-elements/default-frame/widget';
import { getSuitesStruct } from '../lib/titledTableStructures';

ReactDOM.render(
  <DefaultFrame titledTables={[getSuitesStruct('Add New', '/dashsuites/create')]} />,
  document.getElementById('content'),
);
