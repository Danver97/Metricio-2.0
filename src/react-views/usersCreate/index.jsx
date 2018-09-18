import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip,
} from 'reactstrap';

import { post } from '../../lib/requests';
import urlPaths from '../../lib/url_paths';
import DefaultFrame from '../../react-elements/default-frame/widget';

import './styles.scss';

const defBack = '#ffffff';
const defSide = '#e9ecef';
const defBorder = '#ced4da';

// const colorCheck = '#2ccc4b';
const colorInputCheck = '#ccffc4';
const colorBorderCheck = '#9cc395';
const colorSideInputCheck = '#aad4a3';

// const colorWrong = '#c92216';
const colorInputWrong = '#ffc4c4';
const colorBorderWrong = '#cc9595';
const colorSideInputWrong = '#e0a3a3';

export default class UsersCreateView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalheader: 'Form error',
      username: '',
      password: '',
      role: '',
      confirmpassword: '',
      defaultStyleBack: { backgroundColor: defBack },
      defaultStyleSide: { backgroundColor: defSide, borderColor: defBorder },
      // defaultStyleBorder: { borderColor: defBorder },
    };
    this.keycounter = 0;
    this.onSave = this.onSave.bind(this);
    this.onInput = this.onInput.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }
  
  onInput(e) {
    const obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  }
  
  onBlur(e) {
    const obj = {};
    if (this.validateField(e.target.name, e.target.value))
      this.checkState(e.target.name, obj);
    else
      this.wrongState(e.target.name, obj);
    this.setState(obj);
  }
  
  onSave(e) {
    e.preventDefault();
    const username = this.state.username;
    const password = this.state.password;
    const role = this.state.role;
    const confirmpassword = this.state.confirmpassword;
    const modalbody = [];
    let err = false;
    const stateUpdate = {};
    if (!this.validateField('username', username)) {
      modalbody.push('Username missing.');
      modalbody.push(<br />);
      err = true;
      this.wrongState('username', stateUpdate);
    }
    if (!this.validateField('password', password)) {
      modalbody.push('Password missing.');
      modalbody.push(<br />);
      err = true;
      this.wrongState('password', stateUpdate);
    }
    if (!this.validateField('confirmpassword', confirmpassword)) {
      modalbody.push('Password not confirmed.');
      modalbody.push(<br />);
      err = true;
      this.wrongState('confirmpassword', stateUpdate);
    }
    if (!this.validateField('role', role)) {
      modalbody.push('Role missing.');
      modalbody.push(<br />);
      err = true;
      this.wrongState('role', stateUpdate);
    }
    if (err) {
      stateUpdate.modalbody = modalbody;
      this.setState(stateUpdate);
      this.toggleModal();
    } else {
      post(
        urlPaths.users.post.create(),
        { 'Content-Type': 'application/x-www-form-urlencoded' }, 
        `name=${this.state.username}&password=${this.state.password}&role=${this.state.role}`
      ); 
      this.back();
    }
  }
  
  onCancel(e) {
    e.preventDefault();
    this.back();
  }
  
  getInputAddonIcon(icon, addonType, style, id, iconstyles) {
    return (
      <InputGroupAddon addonType={addonType} id={id}>
        <InputGroupText style={style}>
          <i className="material-icons" style={iconstyles}>{icon}</i>
        </InputGroupText>
      </InputGroupAddon>
    );
  }
  
  getModal() {
    const ok = () => (<Button color="primary" onClick={this.toggleModal}>Ok</Button>);
    return (
      <Modal 
        isOpen={this.state.modal} 
        toggle={this.toggleModal}
      >
        <ModalHeader className="modalheader" toggle={this.toggleModal}>{this.state.modalheader}</ModalHeader>
        <ModalBody className="modalbody">{this.state.modalbody}</ModalBody>
        <ModalFooter>
          {this.state.modaloptions && this.state.modaloptions.map((e, i) => {
            if (i === 0)
              return (<Button color={e.color} onClick={e.handler}>{e.text}</Button>);
            return (<span>{' '}<Button color={e.color} onClick={e.handler}>{e.text}</Button></span>);
          })}
          {!this.state.modaloptions && ok()}
        </ModalFooter>
      </Modal>
    );
  }
  
  validateField(name, value) {
    if (name === 'username')
      return !!value;
    if (name === 'password')
      return /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[\w!@#$%^&*.]{8,}/.test(value);
    if (name === 'confirmpassword')
      return (new RegExp(`^${this.state.password}$`)).test(value);
    if (name === 'role')
      return !!value;
    return false;
  }
  
  checkState(name, obj) {
    obj[`${name}Back`] = { backgroundColor: colorInputCheck };
    obj[`${name}Side`] = { borderColor: colorBorderCheck, backgroundColor: colorSideInputCheck };
    // obj[`${e.target.name}styleSideBack`] = { backgroundColor: colorSideInputCheck };
  }
  
  wrongState(name, obj) {
    obj[`${name}Back`] = { backgroundColor: colorInputWrong };
    obj[`${name}Side`] = { borderColor: colorBorderWrong, backgroundColor: colorSideInputWrong };
    // obj[`${e.target.name}styleSideBack`] = { backgroundColor: colorSideInputWrong };
  }
  
  toggleModal() {
    const modal = !this.state.modal;
    this.setState({ modal });
  }
  
  back() {
    if (this.props.history)
      this.props.history.goBack();
    if (this.props.cancelLink)
      window.location.assign(this.props.cancelLink);
  }
  
  render() {
    return (
      <DefaultFrame>
        <div className="userCreateView">
          <h1>New User</h1>
          <Form className="form" action="/">
            <FormGroup>
              <Label for="username">Username:</Label>
              <InputGroup>
                {this.getInputAddonIcon('person', 'prepend', this.state.usernameSide || this.state.defaultStyleSide)}
                <Input 
                  type="text" 
                  name="username" 
                  id="username" 
                  onInput={e => this.onInput(e)} 
                  onBlur={e => this.onBlur(e)} 
                  placeholder="Username" 
                  style={this.state.usernameBack || this.state.defaultStyleBack}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password:</Label>
              <InputGroup>
                {this.getInputAddonIcon('lock', 'prepend', this.state.passwordSide || this.state.defaultStyleSide)}
                <Input 
                  type="password" 
                  name="password" 
                  id="password" 
                  onInput={e => this.onInput(e)} 
                  onBlur={e => this.onBlur(e)} 
                  placeholder="Password" 
                  style={this.state.passwordBack || this.state.defaultStyleBack}
                />
                {this.getInputAddonIcon('info', 'append', this.state.passwordSide || this.state.defaultStyleSide, 'passwordinfo')}
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="confirmpassword">Confirm password:</Label>
              <InputGroup>
                {this.getInputAddonIcon('done_all', 'prepend', this.state.confirmpasswordSide || this.state.defaultStyleSide)}
                <Input 
                  type="password" 
                  name="confirmpassword" 
                  id="confirmpassword" 
                  onInput={e => this.onInput(e)} 
                  onBlur={e => this.onBlur(e)} 
                  placeholder="Confirm password" 
                  style={this.state.confirmpasswordBack || this.state.defaultStyleBack}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="role">Confirm password:</Label>
              <InputGroup>
                {this.getInputAddonIcon('security', 'prepend', this.state.roleSide || this.state.defaultStyleSide)}
                <Input 
                  type="text" 
                  name="role" 
                  id="role" 
                  onInput={e => this.onInput(e)} 
                  onBlur={e => this.onBlur(e)} 
                  placeholder="Role" 
                  style={this.state.roleBack || this.state.defaultStyleBack}
                />
              </InputGroup>
            </FormGroup>
          </Form>
          <UncontrolledTooltip placement="right" target="passwordinfo">
            Password should be at least 8 characters long and must contain letters and numbers.
          </UncontrolledTooltip>
          <Button color="primary" onClick={e => this.onSave(e)}>Save</Button>
          <Button color="secondary" onClick={e => this.onCancel(e)}>Cancel</Button>
          {this.getModal()}
        </div>
      </DefaultFrame>
    );
  }
}
