import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import Home from '../react-views/home';
import Dashsuite from '../react-views/dashsuites';
import DashsuiteCreate from '../react-views/dashsuiteCreate';
import DashsuiteView from '../react-views/dashsuiteView';
import Dashboard from '../react-views/dashboard';
import Users from '../react-views/users';
import Login from '../react-views/login';
import withAuth from '../react-views/withAuth';

import urlPaths from '../lib/url_paths';

const domain = window.location.host;

const home = () => (<h1>Csioa</h1>);
const dashsuite = withAuth(Dashsuite, domain);
const dashboard = withAuth(Dashboard, domain);
const users = withAuth(Users, domain);
const dashsuiteCreate = withAuth(DashsuiteCreate, domain);
const dashsuiteView = withAuth(DashsuiteView, domain);

const App = () => (
  <div>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/dashsuites">Dashsuite</Link>
      <Link to="/users">Users</Link>
      <Link to="/dashboard/index2">Dashboard</Link>
      <Link to="/dashboard/index3">Dashboard2</Link>
      <Link to="/users/login">Login</Link>
    </nav>
    <div>
      <Switch>
        <Route exact path="/" component={home} />
        <Route exact path="/home" component={Home} />
        <Route exact path={urlPaths.dashboard.get.dashboard()} component={dashboard} />
        <Route exact path="/dashsuites" component={dashsuite} />
        <Route exact path="/dashsuites/create" component={dashsuiteCreate} />
        <Route exact path="/dashsuites/view/:dashsuite" component={dashsuiteView} />
        <Route exact path="/users" component={users} />
        <Route exact path="/users/login" component={Login} />
      </Switch>
    </div>
  </div>
);


ReactDOM.render(
  <Router>
    {App()}
  </Router>,
  document.getElementById('content'),
);

