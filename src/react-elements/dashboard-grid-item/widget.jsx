import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { ContextMenuTrigger } from 'react-contextmenu';

// import DashTreeHandler from '../../lib/dashTreeHandler';
// import GridItem from 'react-grid-layout/lib/GridItem.jsx';

import './styles.scss';

const attributes = {
  className: 'context-menu',
};

export default class DashboardGridItem extends React.Component {
  constructor(props) {
    super(props);
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
    this.onDashLinkClick = this.onDashLinkClick.bind(this);
    this.onDashLinkKeyDown = this.onDashLinkKeyDown.bind(this);
  }
  
  onDashLinkKeyDown(e) {
    if (e.keyCode === 13)
      this.onDashLinkClick();
  }
  
  onDashLinkClick() {
    const struct = this.props.children.props.structure;
    console.log(struct.attrs);
    const subDashLink = struct.getSubdashLink();
    if (this.props.history) {
      this.props.history.push(subDashLink);
      return;
    }
    window.location.assign(subDashLink);
  }

  collect(props) {
    return { name: props.name };
  }

  render() {
    const struct = this.props.children.props.structure;
    let href = '';
    let vars = '';
    if (struct.attrs.subdashLink) {
      href = struct.attrs.subdashLink.href;
      vars = JSON.stringify(struct.attrs.subdashLink.vars);
      if (vars)
        vars = vars.replace(/([:,])"(.)/g, '$1 $2').replace(/[{}"]/g, '');
    }
    return (
      <div className="grid-item" key={this.props.id} data-grid={this.state.layout}>
        <ContextMenuTrigger id="grid-item" holdToDisplay={300} name={this.props.id} collect={this.collect} attributes={attributes}>
          <div />
        </ContextMenuTrigger>
        {this.props.children}
        {this.props.children.props.structure.attrs.subdashLink && 
          <div 
            id={`subdashlink${this.props.id}`} 
            className="dash-link" 
            onClick={this.onDashLinkClick} 
            onKeyDown={e => this.onDashLinkKeyDown(e)} 
            role="link"
          >
            <UncontrolledTooltip placement="top" target={`subdashlink${this.props.id}`}>
              Link: {href} <br />{vars && `Vars: ${vars}`}
            </UncontrolledTooltip>
          </div>}
      </div>
    );
  }
}
// <a href={this.props.children.props.structure.getSubdashLink()}></a>
