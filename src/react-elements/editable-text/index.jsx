import React from 'react';

import './styles.scss';

export default class EditableText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modifyTitleMode: false,
      initialText: this.props.text || this.props.children,
      currentText: this.props.text || this.props.children,
      type: this.props.type,
    };
    this.onModifyClick = this.onModifyClick.bind(this);
    this.onModifyConfirmClick = this.onModifyConfirmClick.bind(this);
    this.onModifyCancelClick = this.onModifyCancelClick.bind(this);
  }
  
  onModifyClick() {
    this.setState({ modifyTitleMode: true });
  }
  
  onModifyConfirmClick() {
    this.props.onConfirm(this.state.currentText);
    this.setState({ modifyTitleMode: false });
  }
  
  onModifyCancelClick() {
    const initText = this.state.initialText;
    this.setState({ modifyTitleMode: false, currentText: initText });
  }
  
  getNormal() {
    return (
      <div className="nomodify">
        { this.props.type === 'paragraph' ? <p>{this.state.currentText}</p> : <h1>{this.state.currentText}</h1> }
        <div className="iconbutton" style={{ marginLeft: '0.5rem' }}>
          <i className="material-icons md-36" onClick={this.onModifyClick}>create</i>
        </div>
      </div>
    );
  }
  
  getModifyMode() {
    return (
      <div>
        <input 
          type="text"
          onInput={e => this.setState({ currentText: e.target.value })} 
          defaultValue={this.state.currentText} 
          style={{ margin: '0' }}
          autoFocus
        />
        <div className="controlIcons">
          <div className="iconbutton small" style={{ margin: '0' }}>
            <i className="material-icons md-light md-30" onClick={this.onModifyConfirmClick}>check</i>
          </div>
          <div className="iconbutton small">
            <i className="material-icons md-light md-30" onClick={this.onModifyCancelClick}>close</i>
          </div>
        </div>
      </div>
    );
  }
  
  render() {
    return (
      <div className="editable-text">
        {this.state.modifyTitleMode ? this.getModifyMode() : this.getNormal()}
      </div>
    );
  }
}