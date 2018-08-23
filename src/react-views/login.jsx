import React from 'react';
import AuthService from '../lib/authService';

import '../styles/login.scss';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.Auth = new AuthService(window.location.host);
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentWillMount() {
    if (this.Auth.loggedIn())
      this.props.history.replace('/');
  }
  
  onSave(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      this.Auth.login(this.state.username, this.state.password, () => {
        this.props.history.replace('/');
      });
    } catch (err) {
      this.props.history.replace('/login');
    }
  }
  
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  
  render() {
    return (
      <div className="formlogin" onSubmit={e => this.onSave(e)}>
        <h3>Login</h3>
        <form action="/users/login" method="POST">
          <div className="line">
            <div className="label">
              <div className="flex-container">
                <label htmlFor="username">Username:</label>
              </div>
            </div>
            <input type="text" name="username" onChange={e => this.handleChange(e)} />
          </div>
          <div className="line">
            <div className="label">
              <div className="flex-container">
                <label htmlFor="password">Password:</label>
              </div>
            </div>
            <input type="password" name="password" onChange={e => this.handleChange(e)} /><br />
          </div>
          <div className="submit">
            <input type="submit" value="Login" onClick={e => this.onSave(e)} />
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
