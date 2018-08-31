import React from 'react';
import ReactSelect from 'react-select';
import Async from 'react-select/lib/Async';

import './styles';

export default class DropdownInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      selectedOption: this.props.value || null,
    };
    this.onChange = this.onChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  
  onInputChange(str) {
    const e = {
      name: 'onInputChange',
      target: {
        id: this.props.id,
        name: this.props.name,
        value: str,
      },
    };
    if (this.props.onInputChange)
      this.props.onInputChange(e);
    this.setState({ inputValue: str });
  }
  
  onChange(value) {
    const e = {
      name: 'onChange',
      target: {
        id: this.props.id,
        name: this.props.name,
        data: value,
      },
    };
    if (this.props.onChange)
      this.props.onChange(e);
    this.setState({ selectedOption: value });
  }
  
  render() {
    if (this.props.async) {
      return (
        <Async 
          autoFocus={this.props.autoFocus}
          className={'dropdownInput ' + this.props.className}
          defaultOptions={this.props.defaultOptions}
          inputValue={this.props.inputValue || this.state.inputValue}
          isClearable={this.props.isClearable}
          isDisabled={this.props.isDisabled}
          isMulti={this.props.isMulti}
          isSearchable={this.props.isSearchable}
          loadOptions={this.props.loadOptions}
          name={this.props.name}
          onInputChange={this.onInputChange} 
          onChange={this.onChange} 
          placeholder={this.props.placeholder}
          value={this.state.selectedOption} 
        />
      );
    }
    return (
      <ReactSelect 
        autoFocus={this.props.autoFocus}
        className={'dropdownInput ' + this.props.className}
        inputValue={this.props.inputValue || this.state.inputValue}
        isClearable={this.props.isClearable}
        isDisabled={this.props.isDisabled}
        isMulti={this.props.isMulti}
        isSearchable={this.props.isSearchable}
        name={this.props.name}
        onChange={this.onChange} 
        onInputChange={this.onInputChange} 
        options={this.props.options} 
        placeholder={this.props.placeholder}
        value={this.state.selectedOption} 
      />
    );
  }
}
