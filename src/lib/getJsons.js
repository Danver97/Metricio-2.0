import { getSync } from '../lib/requests';

export function getUsers() {
  // ... request
}

export function getDashsuites() {
  let dashsuites;
  getSync('/dashsuites/list', [], (xhttp) => dashsuites = xhttp.responseText);
  try {
    dashsuites = JSON.parse(dashsuites);
    return dashsuites;
  } catch (e) {
    return [];
  }
}

export function getDashboardsFromDashsuite(dashsuiteName) {
  let dashsuiteRes;
  getSync('/dashsuites/dashboards/' + dashsuiteName, [{tag: 'Accept', value:'application/json'}], xhttp => dashsuiteRes = xhttp.responseText);
  try {
    dashsuiteRes = JSON.parse(dashsuiteRes);
    return dashsuiteRes.dashboards;
  } catch(e) {
    return [];
  }
}
