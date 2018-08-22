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
  
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  onSave(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      this.Auth.login(this.state.username, this.state.password, (token) => {
        this.props.history.replace('/');
      });
    } catch(e) {
      this.props.history.replace('/login');
    }
  }
  
  componentWillMount() {
    if (this.Auth.loggedIn())
      this.props.history.replace('/');
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
            <input type="text" name="username" onChange={e => this.handleChange(e)}></input>
          </div>
          <div className="line">
            <div className="label">
              <div className="flex-container">
                <label htmlFor="password">Password:</label>
              </div>
            </div>
            <input type="password" name="password" onChange={e => this.handleChange(e)}></input><br></br>
          </div>
          <div className="submit">
            <input type="submit" value="Login" onClick={e => this.onSave(e)}></input>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;