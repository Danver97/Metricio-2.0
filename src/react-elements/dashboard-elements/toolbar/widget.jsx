import React from 'react';

import './styles.scss';

export default class DashboardToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isSaved: true };
    // this.saveOnClick = this.saveOnClick.bind(this);
  }

  render() {
    return (
      <div className="toolbar" >
        {this.props.children}
      </div>
    );
  }
}
