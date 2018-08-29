import React from 'react';
import DashTreeHandler from '../lib/dashTreeHandler';

export default function withDashTreeClear(Component) {
  return class ComponentWrapped extends React.Component {
    render() {
      const dth = new DashTreeHandler();
      dth.clear();
      return (
        <Component 
          history={this.props.history} 
          match={this.props.match} 
          location={this.props.location} 
        />
      );
    }
  };
}
