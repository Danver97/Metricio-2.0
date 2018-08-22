import React from 'react';

import './styles.scss';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: this.props.elements,
    };
    this.keycounter = 0;
    //this.onClick = this.onClick.bind(this);
  }
  
  onClick(element) {
    console.log(element);
    if (element.link)
      window.location.assign(element.link);
  }
  
  getElements() {
    const elements = this.state.elements;
    if (elements && elements.length > 0) {
      if (typeof elements[0] === 'string')
        return elements.map((e) => {
          const key = this.keycounter++;
          return (<tr key={key}><td  className="elem">{e.data}</td></tr>);
        });
      else if(typeof elements[0] === 'object') {
        return elements.map((e, i) => {
          const key = this.keycounter++;
          return (
            <tr onClick={this.onClick.bind(this, e, i)} key={key}>
              {
                Object.keys(e.data).map(k => {
                  if (typeof e.data[k] !== 'object') {
                    const key = this.keycounter++;
                    return (<td className="elem" key={key}>{e.data[k]}</td>);
                  }
                })
              }
            </tr>
          );
        });
      }
    }
    return (<div />);
  }
  
  render() {
    return (
      <div className="table_holder">
        <table style={{width: '100%'}}>
          <tbody>
            {this.getElements()}
          </tbody>
        </table>
      </div>
    );
  }
}
