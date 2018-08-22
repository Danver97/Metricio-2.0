import React from 'react';
import ReactDOM from 'react-dom';

import '../styles/default.scss';

import DefaultFrame from '../react-elements/default-frame/widget';
import { getSuitesStruct, getUsersStruct } from '../lib/titledTableStructures';

ReactDOM.render(
  <DefaultFrame title="Home" titledTables={[getSuitesStruct('MORE'), getUsersStruct()]} />,
  document.getElementById('content'),
);
