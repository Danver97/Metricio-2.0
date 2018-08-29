import React from 'react';

import DashboardToolbarDashboardList from '../dashboard-elements/toolbar/dashboard-list/widget';
import DashboardToolbarDashboardListTitle from '../dashboard-elements/toolbar/dashboard-list/dashboard-title/widget';
import DashTreeHandler from '../../lib/dashTreeHandler';

class DashTreeList extends React.Component {
  constructor(props) {
    super(props);
    this.history = this.props.history;
    this.dashListItemClick = this.dashListItemClick.bind(this);
  }

  getDashboardToolbarTree() {
    const Title = (e, i) => <DashboardToolbarDashboardListTitle key={`toollistelem${i}`} title={e.name} clickHandler={this.dashListItemClick} />;
    const TitleDisabled = (e, i) => <DashboardToolbarDashboardListTitle key={`toollistelem${i}`} title={e.name} clickHandler={this.dashListItemClick} disabled />;
    const Separator = (i) => <DashboardToolbarDashboardListTitle key={`separator${i}`} separator />;

    const dth = new DashTreeHandler();

    return dth.getAll().map((e, i) => {
      if (i === 0 && i === window.dashTree.length - 1)
        return (TitleDisabled(e, i));
      else if (i === 0)
        return (Title(e, i));
      else if (i === window.dashTree.length - 1)
        return (
          <div key={`tooltreeelem${i}`} style={{ display: 'inline-block' }}>
            {Separator(i)}
            {TitleDisabled(e, i)}
          </div>
        );
      return (
        <div key={`tooltreeelem${i}`} style={{ display: 'inline-block' }}>
          {Separator(i)}
          {Title(e, i)}
        </div>
      );
    });
  }
  
  dashListItemClick(name) {
    const dth = new DashTreeHandler(this.history);
    const current = dth.popAllUntil(name);
    if (this.history && this.props.onNavigate)
      this.props.onNavigate();
    if (!this.history)
      window.location.assign(current.href);
  }

  render() {
    return (
      <DashboardToolbarDashboardList key="dashtreetoolbarlist">
        {this.getDashboardToolbarTree()}
      </DashboardToolbarDashboardList>
    );
  }
}


export default DashTreeList;
