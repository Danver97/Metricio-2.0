import React from 'react';

import '../styles/default.scss';

import DefaultFrame from '../react-elements/default-frame/widget';
import { getSuitesStruct } from '../lib/titledTableStructures';

class Dashsuites extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (<DefaultFrame history={this.props.history} titledTables={[getSuitesStruct('Add New', '/dashsuites/create')]} />);
  }
}

export default Dashsuites;
