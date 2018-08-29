import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
// import _ from 'lodash';

import DynamicComponents from '../../dynamic_components';
import DashboardGridItem from '../dashboard-grid-item/widget';

import './styles.scss';

const ResponsiveGridLayout = WidthProvider(Responsive);


export default class DashboardGrid extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      layout: this.props.layout,
      itemCallbacks: {},
    };
    // console.log('layout');
    // console.log(this.state.layout);
    if (!this.state.layout || !Array.isArray(this.state.layout))
      this.state.layout = [];

    // this.onAddItem = this.onAddItem.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.itemCallback = this.itemCallback.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onResizeStop = this.onResizeStop.bind(this);
  }

  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint,
      cols,
    });
  }

  onResize(layout, oldItem, newItem, placeholder, e, element) {
    if (this.state.itemCallbacks[oldItem.i])
      this.state.itemCallbacks[oldItem.i]();
  }

  onResizeStop(layout, oldItem, newItem, placeholder, e, element) {
    if (this.state.itemCallbacks[oldItem.i] && typeof this.state.itemCallbacks[oldItem.i] === 'function')
      this.state.itemCallbacks[oldItem.i]();
  }
  
  itemCallback(id, cb) {
    const cbs = this.state.itemCallbacks;
    cbs[id] = cb;
    this.setState({ itemCallbacks: cbs });
  }
  
  gridItemFromStructure(key, layout, structure) {
    let k = key;
    if (typeof k === 'number') {
      k = k.toString();
    }
    const l = layout || DynamicComponents.layout(structure);
    const child = (new DynamicComponents({ structure })).render();
    const dg = new DashboardGridItem({ id: k, layout: l, children: child });
    return dg.render();
  }

  gridItem(key, layout, child) {
    let k = key;
    if (typeof k === 'number') {
      k = k.toString();
    }
    // console.log(child);
    // console.log(layout);
    let l = layout;
    if (!l) l = undefined;
    /*
    l.maxW = 12;
    l.minH = 1;
    */
    
    child.props.structure.itemCallback = this.itemCallback;
    
    const dg = new DashboardGridItem({
      id: k,
      layout: l,
      children: child,
      history: this.props.history,
    });
    return dg.render();
  }

  render() {
    // {lg: layout1, md: layout2, ...}
    const l = this.state.layout;
    let layouts;
    if (!this.state.layouts) {
      layouts = {
        lg: l,
        md: l,
        sm: l,
        xs: l,
        xxs: l,
      };
    }
    return (
      <ResponsiveGridLayout className="layout" layouts={layouts} breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }} cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} onLayoutChange={this.props.onLayoutChange} onBreakpointChange={this.onBreakpointChange} rowHeight={40} isResizable={true} onResize={this.onResize}>
        {this.props.children && 
          this.props.children.map((c) => this.gridItem(c.props.id, c.props.layout, c))}
      </ResponsiveGridLayout>
    );
  }

  // {this.state.items.map(e => this.createElement(e))}
  /*
  render() {
    return (
      <ReactGridLayout layout={this.state.layout}
      onLayoutChange={this.onLayoutChange} {...this.props}>
        {this.state.layout.map(e => this.createElement(e))}
        <div className="item" key="5" data-grid={this.state.layout[0]}>ciao</div>
      </ReactGridLayout>
    );
  }
  */
}
