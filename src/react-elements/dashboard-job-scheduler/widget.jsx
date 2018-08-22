import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { UncontrolledDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Dropdown from 'react-dropdown'
// import 'react-dropdown/style.css'

// import '../dropdown/styles.scss';

/*
import { post } from "../../lib/requests";
*/

import BaseWidget from '../base';
import './styles.scss';

export default class DashboardJobScheduler extends BaseWidget {
  constructor(props) {
    super(props);
    this.state.dropdownOpen = false;
    this.submit = this.submit.bind(this);
    this.getDropdownOptions = this.getDropdownOptions.bind(this);
    this.dropdownSelection = this.dropdownSelection.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this.textAreaOnClick = this.textAreaOnClick.bind(this);
    //this.handleClick = this.handleClick.bind(this);
  }

  static get layout() {
    const l = super.layout;
    l.maxW = 8;
    l.minW = l.w;
    l.h += 1;
    l.minH += 1;
    l.maxH = 8;
    l.isDraggable = false;
    return l;
  }

  getDropdownOptions() {
    return ['MySql', 'ElasticSearch'];
  }

  submit(event) {
    //event.preventDefault();
    if (this.state.dropdownSelection === 'Not defined')
      return;
  }

  dropdownSelection(selected) {
    this.setState({ dropdownSelection: selected });
  }
  
  _onSelect(selected) {
    console.log(selected);
    this.setState({dropdownSelection: selected});
  }
  
  dropdown(){
    // <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
    return (
      <Dropdown className="dropdown" options={this.getDropdownOptions()} onChange={this._onSelect} value={this.state.dropdownSelection} />
    );
  }
  
  textAreaOnClick(e){
    e.stopPropagation();
  }

  render() {
    const classList = classNames(
      ...this.classList,
      'job_scheduler',
      'widget--medium',
    );
    return (
      <div className={classList}>
        <h1 className="widget__title">Add New Job</h1>
        <form onSubmit={(e) => this.submit(e)} method="POST" action="/jobs">
          {this.dropdown()}
          <div className="line">
            <div className="label">
              <label htmlFor="jobname">Job Name:</label>
            </div>
            <input type="text" name="jobname" onMouseDown={this.textAreaOnClick} onClick={this.textAreaOnClick} /><br />
          </div>
          <div className="line">
            <div className="label">
              <label htmlFor="jobquery">Job Query:</label>
            </div>
            <textarea key="jobquery2  " name="jobquery" cols="40" rows="5" onMouseDown={this.textAreaOnClick} onClick={this.textAreaOnClick} /><br />
          </div>
          <input type="hidden" name="datasource" value={this.state.dropdownSelection} />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
// <MyDropdown items={this.getDropdownOptions()} dropdownSelection={this.dropdownSelection} />
DashboardJobScheduler.propTypes = {
  title: PropTypes.string.isRequired,
};
