import React from 'react';
import AuthService from '../lib/authService';

export default function withAuth(AuthComponent, domain) {
  const Auth = new AuthService(domain);
  return class AuthWrapped extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          user: null
      }
    }
    
    componentWillMount() {
      if (!Auth.loggedIn()) {
        this.props.history.replace('/users/login');
      } else {
        try {
          const profile = Auth.getProfile();
          this.setState({
            user: profile,
          });
        } catch (err) {
          Auth.logout();
          this.props.history.replace('/users/login');
        }
      }
    }
    
    render() {
      if (this.state.user) {
        return (
          <AuthComponent history={this.props.history} match={this.props.match} user={this.state.user} />
        );
      } else {
        return null;
      }
    }
  }
}