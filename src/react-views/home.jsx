import React from 'react';

import '../styles/default.scss';

import DefaultFrame from '../react-elements/default-frame/widget';
import { getSuitesStruct, getUsersStruct, getAllBoardsStruct, getJobsStruct } from '../lib/titledTableStructures';
import urlPaths from '../lib/url_paths';

const suitePath = urlPaths.dashsuites.get.dashsuites();
const usersPath = urlPaths.users.get.users();
const jobsPath = urlPaths.jobs.get.jobs();

class Home extends React.Component {
  render() {
    return (
      <DefaultFrame 
        title="Home" 
        history={this.props.history} 
        titledTables={[ 
            getSuitesStruct('MORE', suitePath), 
            getUsersStruct('MORE', usersPath), 
            getAllBoardsStruct(), 
            getJobsStruct('MORE', jobsPath), 
          ]} 
      />
    );
  }
}

export default Home;
