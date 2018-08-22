import React from 'react';

import './styles.scss';

export default class DashboardFrame extends React.Component {
  constructor(props) {
    super(props);
    // this.saveOnClick = this.saveOnClick.bind(this);
  }

  render() {
    return (<div className="dashboardFrame">
        {this.props.children}
      </div>);
  }
}
