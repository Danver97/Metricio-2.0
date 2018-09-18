import React from 'react';

import { post } from '../../../lib/requests';
import Auth from '../../../lib/authService';

import './styles.scss';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: this.props.elements,
    };
    this.keycounter = 0;
    // this.onClick = this.onClick.bind(this);
  }
  
  onClick(element) {
    if (element.link) {
      if (this.props.history) {
        this.props.history.push(element.link);
        return;
      }
      window.location.assign(element.link);
    }
  }
  
  onDelete(e, element) {
    e.stopPropagation();
    if (element.data.deleteLink) {
      const auth = new Auth();
      post(element.data.deleteLink, { Authorization: `Bearer ${auth.getToken()}` }, null, () => {
        if (this.props.history) {
          this.props.history.replace(window.location.pathname);
          return;
        }
        window.location.assign(window.location.pathname);
      });
    }
  }
  
  getElements() {
    const elements = this.state.elements;
    if (elements && elements.length > 0) {
      if (typeof elements[0] === 'string')
        return elements.map((e) => {
          const key = this.keycounter++;
          return (<tr key={key}><td className="elem">{e.data}</td></tr>);
        });
      else if (typeof elements[0] === 'object') {
        return elements.map((e, i) => {
          const key = this.keycounter++;
          return (
            <tr onClick={() => this.onClick(e)} key={key}>
              {
                Object.keys(e.data).map(k => {
                  if (k === 'deleteLink' && e.data[k]) {
                    const subkey = this.keycounter++;
                    return (
                      <td className="elem" key={subkey}>
                        <i className="material-icons" onClick={(ev) => this.onDelete(ev, e)} style={{ color: 'red', float: 'right' }}>
                          cancel
                        </i>
                      </td>
                    );
                  }
                  if (typeof e.data[k] !== 'object') {
                    const subkey = this.keycounter++;
                    return (<td className="elem" key={subkey}>{e.data[k]}</td>);
                  }
                  return null;
                })
              }
            </tr>
          );
        });
      }
    }
    return null;
  }
  
  render() {
    return (
      <div className="table_holder">
        <table style={{ width: '100%' }}>
          <tbody>
            {this.getElements()}
          </tbody>
        </table>
      </div>
    );
  }
}
