import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

// Components
// rst
import Home from '../react-views/home';
import Dashsuite from '../react-views/dashsuites';
import DashsuiteCreate from '../react-views/dashsuiteCreate';
import DashsuiteView from '../react-views/dashsuiteView';
import Dashboard from '../react-views/dashboard';
import DashboardCreate from '../react-views/dashboardCreate';
import DashboardEdit from '../react-views/dashboardEdit';
import DashboardNewWidget from '../react-views/dashboardNewWidget';
import VarsEdit from '../react-views/varsEdit';
import JobsList from '../react-views/jobsList';
import JobsCreate from '../react-views/jobsCreate';
import JobsEdit from '../react-views/jobsEdit';
import Users from '../react-views/users';
import UsersCreate from '../react-views/usersCreate';
import Login from '../react-views/login';
import withAuth from '../react-views/withAuth';
import withDashTreeClear from '../react-views/withDashTreeClear';
// rcl

import urlPaths from '../lib/url_paths';

const domain = window.location.host;

// Components withAuth
// rst
const notFound = () => (<h1>Error 404</h1>);
const home = withDashTreeClear(withAuth(Home, domain));
const dashsuite = withDashTreeClear(withAuth(Dashsuite, domain));
const dashboard = withAuth(Dashboard, domain);
const dashboardCreate = withDashTreeClear(withAuth(DashboardCreate, domain));
const dashboardEdit = withAuth(DashboardEdit, domain);
const dashboardNewWidget = withAuth(DashboardNewWidget, domain);
const users = withDashTreeClear(withAuth(Users, domain));
const usersCreate = withDashTreeClear(withAuth(UsersCreate, domain));
const dashsuiteCreate = withDashTreeClear(withAuth(DashsuiteCreate, domain));
const dashsuiteView = withDashTreeClear(withAuth(DashsuiteView, domain));
const varsEdit = withDashTreeClear(withAuth(VarsEdit, domain));
const jobsList = withDashTreeClear(withAuth(JobsList, domain));
const jobsCreate = withDashTreeClear(withAuth(JobsCreate, domain));
const jobsEdit = withDashTreeClear(withAuth(JobsEdit, domain));
// rcl

const Nav = () => (
  <nav>
    <Link to={urlPaths.home.get.home()}>Home</Link>
    <Link to={urlPaths.dashsuites.get.dashsuites()}>Dashsuite</Link>
    <Link to={urlPaths.users.get.users()}>Users</Link>
    <Link to={urlPaths.jobs.get.jobsAll()}>Jobs</Link>
    <Link to={urlPaths.dashboard.get.dashboard('index2')}>Dashboard</Link>
    <Link to={urlPaths.dashboard.get.dashboard('index3')}>Dashboard2</Link>
    <Link to={urlPaths.users.get.login()}>Login</Link>
  </nav>
);

const App = () => (
  <div>
    <div>
      <Switch>
        <Route exact path={urlPaths.home.get.home()} component={home} />
        <Route exact path={urlPaths.dashboard.get.dashboard()} component={dashboard} />
        <Route exact path={urlPaths.dashboard.get.create()} component={dashboardCreate} />
        <Route exact path={urlPaths.dashboard.get.edit()} component={dashboardEdit} />
        <Route exact path={urlPaths.dashboard.get.newWidget()} component={dashboardNewWidget} />
        <Route exact path={urlPaths.dashboard.get.editVars()} component={varsEdit} />
        <Route exact path={urlPaths.dashsuites.get.dashsuites()} component={dashsuite} />
        <Route exact path={urlPaths.dashsuites.get.create()} component={dashsuiteCreate} />
        <Route exact path={urlPaths.dashsuites.get.view()} component={dashsuiteView} />
        <Route exact path={urlPaths.users.get.users()} component={users} />
        <Route exact path={urlPaths.users.get.create()} component={usersCreate} />
        <Route exact path={urlPaths.jobs.get.jobs()} component={jobsList} />
        <Route exact path={urlPaths.jobs.get.jobsAll()} component={jobsList} />
        <Route exact path={urlPaths.jobs.get.create()} component={jobsCreate} />
        <Route exact path={urlPaths.jobs.get.edit()} component={jobsEdit} />
        <Route exact path={urlPaths.users.get.login()} component={Login} />
        <Route exact path="*" component={notFound} />
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

