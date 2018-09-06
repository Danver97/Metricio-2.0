import React from 'react';

import { InputGroupAddon, InputGroupText } from 'reactstrap';

const InputGroupIcon = (props) => (
  <InputGroupAddon addonType={props.addonType || 'prepend'}>
    <InputGroupText style={props.style}><i className="material-icons" style={props.iconStyle}>{props.materialIconName}</i></InputGroupText>
    {props.children}
  </InputGroupAddon>
);

export default InputGroupIcon;
