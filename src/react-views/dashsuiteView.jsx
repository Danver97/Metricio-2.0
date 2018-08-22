import React from 'react';

import '../styles/default.scss';

import DefaultFrame from '../react-elements/default-frame/widget';
import { getBoardsStruct } from '../lib/titledTableStructures';

class Dashsuites extends React.Component {
  constructor(props) {
    super(props);
    this.dashsuite = this.props.match.params.dashsuite;
  }
  
  render() {
    return (
      <DefaultFrame history={this.props.history} titledTables={[getBoardsStruct(this.dashsuite, 'Add New')]} >
        <h1>{this.dashsuite}</h1>
      </DefaultFrame>
    );
  }
}

export default Dashsuites;
