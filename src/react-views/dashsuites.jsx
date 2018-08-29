import React from 'react';

import '../styles/default.scss';

import DefaultFrame from '../react-elements/default-frame/widget';
import { getSuitesStructWithTitle } from '../lib/titledTableStructures';
import urlPaths from '../lib/url_paths';

class Dashsuites extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <DefaultFrame 
        title="Dashsuites" 
        history={this.props.history} 
        titledTables={[
          getSuitesStructWithTitle('All your dashsuites', 'Add New', urlPaths.dashsuites.get.create()),
        ]} 
      />
    );
  }
}

export default Dashsuites;
