import React from 'react';

import '../styles/default.scss';

import DefaultFrame from '../react-elements/default-frame/widget';
import { getSuitesStruct, getUsersStruct } from '../lib/titledTableStructures';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (<DefaultFrame title="Home" titledTables={[getSuitesStruct('MORE'), getUsersStruct()]} />);
  }
}

export default Home;