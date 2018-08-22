import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

export default class DashboardToolbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isSaved: true};
    //this.saveOnClick = this.saveOnClick.bind(this);
  }
  
  /*saveOnClick(){
    console.log("Save on click");
    if(this.state.isSaved){
      return;
    }
    var structure = JSON.stringify(window.dashStructure);
    this.setState({isSaved: true});
    console.log(structure); //api.post(structure); //Server save structure.
  }*/

  render() {

    return (<div className="toolbar" >
        {this.props.children}
      </div>);
  }
}
