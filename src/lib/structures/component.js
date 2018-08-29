import qs from 'query-string';
import urlPaths from '../url_paths';

export default class ComponentStructure {
  constructor(type, attrs, children) {
    if (!type || !attrs)
      throw new Error('Invalid ComponentStructure constructor parameters.');
    if (typeof type !== 'string')
      throw new Error('Invalid ComponentStructure constructor parameters: type must be a string.');
    this.type = type;
    this.attrs = attrs;
    this.attrs.id = this.attrs.id === 0 ? '0' : this.attrs.id;
    /* if(!this.attrs.id)
      this.attrs.id = (new Date()).valueOf();
    this.attrs.key = this.attrs.id.toString(); */
    this.newKey(this.attrs.id);
    this.children = children;
    if (!children)
      this.children = undefined;
    else if (!Array.isArray(children))
      throw new Error('Invalid ComponentStructure constructor parameters: children must be an array.');
    else if (!(children[0] instanceof ComponentStructure)) {
      throw new Error('Invalid ComponentStructure constructor parameters: children must be an array of ComponentStructure.');
    }
  }
  
  newKey(key) {
    this.attrs.id = key || (new Date()).valueOf();
    this.attrs.key = this.attrs.id.toString();
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
  
  stringifyVars(params) {
    // let result = '';
    if (!params)
      return '';
    /* result += '?';
    Object.keys(params).forEach(p => {
      if (p)
        result += `${p}=${params[p]}&`;
    });
    return result.slice(0, -1); */
    Object.keys(params).forEach(p => {
      if (p)
        params[p] = JSON.stringify(params[p]);
    });
    return `?${qs.stringify(params)}`;
  }
  
  setSubdashLinkName(name) {
    if (!name)
      return;
    if (!this.attrs.subdashLink)
      this.attrs.subdashLink = {};
    this.attrs.subdashLink.name = name;
    this.attrs.subdashLink.href = urlPaths.dashboard.get.dashboard(name);
  }
  
  getSubdashLink() {
    if (this.attrs.subdashLink) {
      // return '/dashboard/' + this.attrs.subdashLink.name + '?'
      // + stringifyParams(this.attrs.subdashLink.vars);
      return `${this.attrs.subdashLink.href}${this.stringifyVars(this.attrs.subdashLink.vars)}`;
    }
    return '';
  }

  is(component) {
    if (!component)
      return false;
    const type = typeof component;
    if (type !== 'function' && type !== 'string')
      throw new Error('Invalid component parameter: should be a function or string.');
    if (typeof component === 'function')
      return this.type === component.name;
    return this.type === component;
  }
  
  stringify() {
    return JSON.stringify(this, (k, v) => (k === 'socket' ? undefined : v));
  }
}
