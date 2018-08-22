import React from 'react';

import '../styles/default.scss';

import DefaultFrame from '../react-elements/default-frame/widget';
import { getUsersStruct } from '../lib/titledTableStructures';

class Users extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (<DefaultFrame title="Users" titledTables={[getUsersStruct('Add User', '/users/create')]} />);
  }
}

export default Users;