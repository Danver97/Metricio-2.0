import ComponentStructure from './component';

export default class DashboardStructure {
  constructor(type, name, attrs, layouts, children, subdashboard) {
    if (!name)
      throw new Error('Invalid DashboardStructure constructor parameters.');
    if (typeof type !== 'string')
      throw new Error('Invalid DashboardStructure constructor parameters: type must be a string.');
    this.type = type;
    this.attrs = attrs || {};
    this.attrs.title = this.attrs.title || name;
    this.layouts = layouts || [];
    
    if (children && !Array.isArray(children))
      throw new Error('Invalid DashboardStructure constructor parameters: children must be an array.');
    else if (!(children[0] instanceof ComponentStructure))
      throw new Error('Invalid DashboardStructure constructor parameters: children must be an array of ComponentStructure.');
    this.children = children || [];
    
    if (subdashboard && !Array.isArray(subdashboard))
      throw new Error('Invalid DashboardStructure constructor parameters: subdashboard must be an array.');
    else if (!(subdashboard[0] instanceof DashboardStructure))
      throw new Error('Invalid DashboardStructure constructor parameters: subdashboard must be an array of DashboardStructure.');
    this.subdashboard = subdashboard || [];
  }

  addLayoutProp(layout) {
    this.attrs.layout = layout;
  }

  addChild(child) {
    if (!child)
      throw new Error('Invalid child parameters: child can\'t be null.');
    if (!(child instanceof ComponentStructure))
      throw new Error('Invalid child parameters: child must be an instace of ComponentStructure.');
    if (!this.children)
      this.children = [];
    this.children.push(child);
  }
  
  addSubDashboard(subDashboard) {
    if (!subDashboard)
      throw new Error('Invalid child parameters: child can\'t be null.');
    if (!(subDashboard instanceof DashboardStructure))
      throw new Error('Invalid child parameters: child must be an instace of DashboardStructure.');
    if (!this.subdashboard)
      this.subdashboard = [];
    this.subdashboard.push(subDashboard);
  }
  
  stringify() {
    return JSON.stringify(this, (k, v) => { return k === 'socket' ? undefined : v; });
  }
}
