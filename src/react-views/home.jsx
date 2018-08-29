import React from 'react';

import '../styles/default.scss';

import DefaultFrame from '../react-elements/default-frame/widget';
import { getSuitesStruct, getUsersStruct, getAllBoardsStruct } from '../lib/titledTableStructures';
import urlPaths from '../lib/url_paths';

const suitePath = urlPaths.dashsuites.get.dashsuites();
const usersPath = urlPaths.users.get.users();

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <DefaultFrame 
        title="Home" 
        history={this.props.history} 
        titledTables={[
            getSuitesStruct('MORE', suitePath), 
            getUsersStruct('MORE', usersPath), 
            getAllBoardsStruct(),
          ]}
      />
    );
  }
}

export default Home;
