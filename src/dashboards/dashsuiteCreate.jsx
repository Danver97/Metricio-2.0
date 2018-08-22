import React from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledTooltip,
} from 'reactstrap';

import '../styles/default.scss';

import DefaultFrame from '../react-elements/default-frame/widget';
import { getSuitesStruct } from '../lib/titledTableStructures';
import DashsuiteCreateView from '../react-views/dashsuiteCreate/index';

ReactDOM.render(
  <DefaultFrame>
    <DashsuiteCreateView />
  </DefaultFrame>,
  document.getElementById('content'),
);
