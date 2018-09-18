import { getSync } from '../lib/requests';
import urlPaths from '../lib/url_paths';

export function getUsers() {
  let users;
  getSync(urlPaths.users.get.list(), { Accept: 'application/json' }, xhttp => { users = xhttp.responseText; });
  try {
    users = JSON.parse(users);
    return users;
  } catch (e) {
    return [];
  }
}

export function getDashsuites() {
  let dashsuites;
  getSync(urlPaths.dashsuites.get.list(), [], xhttp => { dashsuites = xhttp.responseText; });
  try {
    dashsuites = JSON.parse(dashsuites);
    return dashsuites;
  } catch (e) {
    return [];
  }
}

export function getDashboardsFromDashsuite(dashsuiteName) {
  let dashsuiteRes;
  getSync(urlPaths.dashsuites.get.dashboards(dashsuiteName), { Accept: 'application/json' }, xhttp => { dashsuiteRes = xhttp.responseText; });
  try {
    dashsuiteRes = JSON.parse(dashsuiteRes);
    return dashsuiteRes.dashboards;
  } catch (e) {
    return [];
  }
}

export function getAllDashboards() {
  let dashboards;
  getSync(urlPaths.dashboard.get.listAll(), { Accept: 'application/json' }, xhttp => { dashboards = xhttp.responseText; });
  try {
    dashboards = JSON.parse(dashboards);
    return dashboards;
  } catch (e) {
    return [];
  }
}

export function getJobs(dashboard) {
  let dashboards;
  const path = dashboard ? urlPaths.jobs.get.list(dashboard) : urlPaths.jobs.get.listAll();
  getSync(path, { Accept: 'application/json' }, xhttp => { dashboards = xhttp.responseText; });
  try {
    dashboards = JSON.parse(dashboards);
    return dashboards;
  } catch (e) {
    return [];
  }
}
