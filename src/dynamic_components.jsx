import React from 'react';
import Widgets from './widgets/Widgets';

// let key = 0;

class DynamicComponents {
  constructor(props) {
    this.items = props.structure;
    // this.items = props;
    this.renderElement = this.renderElement.bind(this);
    this.recurseElements = this.recurseElements.bind(this);
  }

  static layout(structure) {
    return Widgets[structure.type].layout;
  }

  renderElement(item, childrenElem) {
    if (!item.attrs)
      item.attrs = {};
    // item.attrs.structure = item;
    console.log('dynamicComponents');
    console.log(Widgets);
    console.log(Widgets[item.type]);
    console.log(item.type);
    const elem = React.createElement(
      Widgets[item.type],
      Object.assign({}, item.attrs, { structure: item }),
      childrenElem
    );
    return elem;
  }

  recurseElements(item) {
    let childrenElem;
    if (Object.prototype.toString.call(item.children) === '[object Array]') {
      childrenElem = item.children.map(this.recurseElements);
    }
    const elem = this.renderElement(item, childrenElem);
    // elem = React.cloneElement(elem, Object.assign({}, elem.props, {key: key++}, childrenElem));
    // console.log(elem);
    return elem;
  }

  render(options) {
    const content = [];
    if (!Array.isArray(this.items))
      this.items = [this.items];
    for (let i = 0; i < this.items.length; i++) {
      content.push(this.recurseElements(this.items[i]));
    }
    // return this.recurseElements(this.items[0]);
    if (content.length === 1)
      if (!options || !options.toArray)
        return (content[0]);
    return (content);
  }
}

/*
function convertToReact(json) {
  let objs = JSON.parse(json);
  let components = [];
  objs.forEach((obj) => {
    const component = Widgets[obj.componentName];
    components.push(React.createElement(component, obj.attrs));
  });
  return (<Dashboard>{components}
  </Dashboard>);
}
*/

export default DynamicComponents;
