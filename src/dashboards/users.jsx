import React from 'react';
import ReactDOM from 'react-dom';

import '../styles/default.scss';

import DefaultFrame from '../react-elements/default-frame/widget';
import { getUsersStruct } from '../lib/titledTableStructures';

ReactDOM.render(
  <DefaultFrame title="Users" titledTables={[getUsersStruct('Add User', '/users/create')]} />,
  document.getElementById('content'),
);
