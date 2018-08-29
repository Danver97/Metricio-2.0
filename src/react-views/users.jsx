import React from 'react';

import '../styles/default.scss';

import DefaultFrame from '../react-elements/default-frame/widget';
import { getUsersStructWithTitle } from '../lib/titledTableStructures';
import urlPaths from '../lib/url_paths';

const userCreatePath = urlPaths.users.get.create();

class Users extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <DefaultFrame 
        history={this.props.history} 
        title="Users" 
        titledTables={[getUsersStructWithTitle('All users', 'Add User', userCreatePath)]} 
      />
    );
  }
}

export default Users;
