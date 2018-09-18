import React from 'react';
import qs from 'query-string';
import { Input, Button } from 'reactstrap';

import DefaultFrame from '../react-elements/default-frame/widget';
import DropdownInput from '../react-elements/dropdown-input';
import urlPaths from '../lib/url_paths';
import { get, post } from '../lib/requests';
import Auth from '../lib/authService';

import Styles from '../react-elements/styles';

export default class VarsEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variables: [{ id: 1, name: 'Var1', type: 'String' }, { id: 2, name: 'Var2', type: 'String' }],
    };
    this.keycounter = 3;
    this.dashboard = this.props.match.params.dashboard;
    this.auth = new Auth();
    this.onCancel = this.onCancel.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }
  
  componentDidMount() {
    get(urlPaths.dashboard.get.getVars(this.dashboard), { Authorization: `Bearer ${this.auth.getToken()}` }, xhttp => {
      const response = JSON.parse(xhttp.responseText);
      if (typeof response[0] === 'string')
        this.setState({ variables: response.map(v => ({ id: this.keycounter++, name: v, type: '' })) || [] });
      else if (typeof response[0] === 'object')
        this.setState({ variables: response.map(v => ({ id: this.keycounter++, name: v.name, type: v.type })) || [] });
      else
        this.setState({ variables: [] });
    });
  }
  
  onSave() {
    const body = qs.stringify({
      variables: JSON.stringify(this.state.variables.map(v => v.name)),
    });
    post(
      urlPaths.dashboard.post.saveVars(this.dashboard), 
      { Authorization: `Bearer ${this.auth.getToken()}`, 'Content-Type': 'application/x-www-form-urlencoded' }, 
      body,
      () => {
        this.back();
      }
    );
  }
  
  onCancel() {
    this.back();
  }
  
  onChange(e, varId) {
    const variables = this.state.variables.slice();
    const variable = this.state.variables.find(v => v.id === varId);
    variable[e.target.name] = e.target.value;
    this.setState({ variables });
  }
  
  onAdd() {
    const variables = this.state.variables.slice();
    variables.push({ id: this.keycounter++, name: '', type: 'String' });
    this.setState({ variables });
  }
  
  onDelete(id) {
    let variables = this.state.variables.slice();
    variables = variables.filter(v => v.id !== id);
    this.setState({ variables });
  }
  
  getVarElems(variable) {
    const tdStyle = { border: '0', padding: '0.5rem', minWidth: '10rem' };
    return (
      <tr key={`tr${variable.id}`}>
        <td style={tdStyle}>
          <Input 
            type="text" 
            name="name" 
            id={`name${variable.id}`} 
            placeholder="Var Name"
            onChange={e => this.onChange(e, variable.id)}
            defaultValue={variable.name}
            style={Object.assign({}, Styles.Input, { margin: 0, width: 'auto', display: 'inline-block' })}
          />
        </td>
        <td style={tdStyle}>
          <DropdownInput 
            name="type" 
            id={`type${variable.id}`} 
            options={this.getOptions()}
            placeholder={variable.type || 'Type'}
            onChange={e => this.onChange(e, variable.id)}
            style={{ minWidth: '8rem', marginBottom: '1rem' }}
          />
        </td>
        <td style={tdStyle}>
          <Button 
            color="danger" 
            onClick={() => this.onDelete(variable.id)} 
            style={{ marginRight: '0.5rem', padding: '0.375rem', borderRadius: '10000px' }}
          >
            <i className="material-icons">clear</i>
          </Button>
        </td>
      </tr>
    );
  }
  
  getOptions() {
    return [{ label: 'String', value: 'String' }, { label: 'Number', value: 'Number' }];
  }
  
  back() {
    if (this.props.history) {
      this.props.history.goBack();
      this.props.history
        .replace(urlPaths.dashboard.get.dashboard(this.dashboard));
      return;
    }
    window.location.assign(urlPaths.dashboard.get.dashboard(this.dashboard));
  }
  
  render() {
    return (
      <DefaultFrame history={this.props.history}>
        <h1>Manage Vars</h1>
        <table>
          <thead>
            <tr>
              <th style={{ border: '0', padding: '0.5rem' }}>Variable Name</th>
              <th style={{ border: '0', padding: '0.5rem' }}>Variable Type</th>
            </tr>
          </thead>
          <tbody>
            {this.state.variables.map(v => this.getVarElems(v))}
          </tbody>
        </table>
        <Button onClick={this.onAdd} style={{ margin: '0.5rem', padding: '0.375rem', borderRadius: '10000px' }}>
          <i className="material-icons">add</i>
        </Button>
        <div style={{ marginTop: '0.5rem' }}>
          <Button color="primary" onClick={this.onSave} style={{ marginRight: '0.5rem' }}>Save</Button>
          <Button onClick={this.onCancel}>Cancel</Button>
        </div>
      </DefaultFrame>
    );
  }
}
