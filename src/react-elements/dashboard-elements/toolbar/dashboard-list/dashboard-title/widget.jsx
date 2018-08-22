import React from 'react';

import './styles.scss';

export default class DashboardToolbarDashboardListTitle extends React.Component {
  constructor(props) {
    super(props);
    // this.handleClick = this.handleClick.bind(this);
    // console.log(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    if (!this.props.disabled)
      this.props.clickHandler(this.props.title);
  }

  render() {
    let classNames = 'toolbar-dashboard-title';
    if (this.props.separator) {
      classNames += ' separator';
    } else if (!this.props.disabled) {
      classNames += ' hoverable activable';
    }
    return (
      <div className={classNames} onClick={this.handleClick}>
        {!this.props.separator && <p>{this.props.title}</p>}
        {this.props.separator && <i className="material-icons">chevron_right</i>}
      </div>
    );
  }
}
