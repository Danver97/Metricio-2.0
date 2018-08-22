import React from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';

import DashTreeHandler from '../../lib/dashTreeHandler';
// import GridItem from 'react-grid-layout/lib/GridItem.jsx';

import './styles.scss';

const attributes = {
  className: 'context-menu',
};

export default class DashboardGridItem extends React.Component {
  constructor(props) {
    super(props);
    // this.props = props;
    // console.log(this.props.id);
    // console.log(this.props.layout);
    this.state = {
      layout: this.props.layout || {
        x: 4,
        y: 0,
        w: 4,
        h: 5,
        minH: 5,
        maxH: 5,
        minW: 2,
        maxW: 4,
      },
    };
  }
  
  onDashLinkClick() {
    const dth = new DashTreeHandler();
    dth.addElement();
  }

  collect(props) {
    return { name: props.name };
  }

  render() {
    return (
      <div className="grid-item" key={this.props.id} data-grid={this.state.layout}>
        <ContextMenuTrigger id="grid-item" holdToDisplay={300} name={this.props.id} collect={this.collect} attributes={attributes}>
          <div />
        </ContextMenuTrigger>
        {this.props.children}
        {this.props.children.props.structure.attrs.subdashLink && <a href={this.props.children.props.structure.getSubdashLink()}><div className="dash-link" /></a>}
      </div>
    );
  }
}
