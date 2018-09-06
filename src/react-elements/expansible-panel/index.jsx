import React from 'react';

import './styles.scss';

export default class ExpansiblePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: this.props.defaultExpanded || false,
      expandIconStyle: { float: 'right', transform: 'rotate(0deg)' },
      expansiblePanelStyle: {
        color: 'black',
        backgroundColor: 'white',
        overflow: 'hidden',
        width: '100%',
        height: 'auto',
        maxHeight: 'auto',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        fontSize: '1rem',
      },
      children: this.props.children,
    };
    this.rotation = {
      expandIconRotation: 'rotate(180deg)',
      expandIconNoRotation: 'rotate(0deg)',
    };
    this.state.expansiblePanelStyle.maxHeight = this.state.expanded ? '200rem' : '3rem';
    this.state.expandIconStyle.transform = this.state.expanded ? 'rotate(180deg)' : 'rotate(0deg)';
    this.expand = this.expand.bind(this);
    this.onClose = this.onClose.bind(this);
  }
  
  shouldComponentUpdate(nextProps) {
    if (this.state.children !== nextProps.children)
      this.setState({ children: nextProps.children });
    return true;
  }
  
  onClose() {
    if (this.props.onClose)
      this.props.onClose();
  }
  
  expand() {
    const expanded = !this.state.expanded;
    const expandIconStyle = Object.assign({}, this.state.expandIconStyle);
    const expansiblePanelStyle = Object.assign({}, this.state.expansiblePanelStyle);
    if (expanded) {
      expandIconStyle.transform = this.rotation.expandIconRotation;
      expansiblePanelStyle.maxHeight = '200rem';
    } else {
      expandIconStyle.transform = this.rotation.expandIconNoRotation;
      expansiblePanelStyle.maxHeight = '3rem';
    }
    this.setState({ expanded, expandIconStyle, expansiblePanelStyle });
    if (this.props.onExpand)
      this.props.onExpand(expanded, this.props);
  }
  
  render() {
    return (
      <div className="expansiblePanel" style={this.state.expansiblePanelStyle}>
        <div 
          className="header" 
          onClick={this.expand} 
          style={{ 
              height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          }}
        >
          <p style={{ display: 'inline-block' }}>{this.props.title}</p>
          <div>
            <i className="material-icons" style={this.state.expandIconStyle}>expand_more</i>
            {this.props.onClose && 
              <div onClick={this.onClose} style={{ float: 'right', marginRight: '0.5rem' }}>
                <i className="material-icons">close</i>
              </div>}
          </div>
        </div>
        <div className="panelContent">
          {this.state.children}
        </div>
      </div>
    );
  }
}
