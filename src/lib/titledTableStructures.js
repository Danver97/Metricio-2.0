import { getCollectionOfOrderedByKeyObjects } from './utils';
import TitledTableStructure from './structures/titledTable';
import { getDashsuites, getUsers, getDashboardsFromDashsuite, getAllDashboards } from './getJsons';
import urlPaths from './url_paths';


function getTitledTableStructure(title, coll, titleBut, link, defLink) {
  let buttonLink;
  if (titleBut)
    buttonLink = link || defLink;
  return new TitledTableStructure(title, coll, titleBut, buttonLink);
}

export function getDashSuitesCollection() {
  const response = getDashsuites();
  // console.log(response);
  const keyOrder = ['name', 'dashNumber', 'lastModified'];
  const dashSuites = [];
  response.forEach(r => dashSuites.push({ data: r, link: r.link, original: r }));
  /* const dashSuites = [{
    data: {
      user: 'Christian',
      name: 'Dash Suite 1',
      dashboards: ['dash1', 'dash2'],
      lastModified: 'Christian',
    },
  }, {
    data: {
      user: 'Christian',
      name: 'Dash Suite 2',
      dashboards: ['dash1', 'dash2', 'dash3'],
      lastModified: 'Germano',
    },
  }];// */
  dashSuites.forEach(d => {
    d.data.name = d.original.name;
    d.data.dashNumber = `Number of dashboards: ${d.original.dashboards.length}`;
    d.data.lastModified = `Last modified: ${d.original.lastModified}`;
  });

  return getCollectionOfOrderedByKeyObjects(dashSuites, keyOrder, 'data');
}

export function getDashboardsCollection(dashsuiteName) {
  const response = getDashboardsFromDashsuite(dashsuiteName);
  const dashboards = [];
  response.forEach(r => dashboards.push({ data: r, link: urlPaths.dashboard.get.dashboard(r.name), original: r }));
  const keyOrder = ['name', 'children', 'subdashboards'];
  dashboards.forEach(d => {
    d.data.name = d.original.name;
    d.data.children = `Number of children: ${d.original.children.length}`;
    d.data.subdashboards = `Number of subdashboards: ${d.original.subdashboard.length}`;
  });

  return getCollectionOfOrderedByKeyObjects(dashboards, keyOrder, 'data');
}

export function getAllDashboardsCollection() {
  const response = getAllDashboards();
  const dashboards = [];
  response.forEach(r => dashboards.push({ data: r, link: urlPaths.dashboard.get.dashboard(r.name), original: r }));
  const keyOrder = ['name', 'children', 'subdashboards'];
  dashboards.forEach(d => {
    d.data.name = d.original.name;
    d.data.children = `Number of children: ${d.original.children.length}`;
    d.data.subdashboards = `Number of subdashboards: ${d.original.subdashboard.length}`;
  });
  return getCollectionOfOrderedByKeyObjects(dashboards, keyOrder, 'data');
}
  
export function getUsersCollection() {
  // request...
  getUsers();
  const keyOrder = ['name', 'role'];
  const users = [
    {
      data: {
        name: 'Christian',
        role: 'Admin',
        password: 'Christian',
      },
    }, {
      data: {
        name: 'Germano',
        role: 'Moderator',
      },
    },
  ];

  return getCollectionOfOrderedByKeyObjects(users, keyOrder, 'data');
}

// Suites
// rst
function getSuitesStructUtil(title, titleButton, link) {
  const coll = getDashSuitesCollection();
  return getTitledTableStructure(title, coll, titleButton, link, urlPaths.dashsuites.get.dashsuites());
}

export function getSuitesStruct(titleButton, link) {
  return getSuitesStructUtil('Dashboard Suites', titleButton, link);
}

export function getSuitesStructNoTitle(titleButton, link) {
  return getSuitesStructUtil('', titleButton, link);
}

export function getSuitesStructWithTitle(title, titleButton, link) {
  return getSuitesStructUtil(title, titleButton, link);
}
// rcl

// Boards
// rst
function getBoardsStructUtil(title, dashsuiteName, titleButton, link) {
  const coll = getDashboardsCollection(dashsuiteName);
  return getTitledTableStructure(title, coll, titleButton, link, urlPaths.dashsuites.get.dashboards(dashsuiteName));
}

export function getBoardsStruct(dashsuiteName, titleButton, link) {
  return getBoardsStructUtil('Dashboards', dashsuiteName, titleButton, link);
}

export function getBoardsStructNoTitle(dashsuiteName, titleButton, link) {
  return getBoardsStructUtil('', dashsuiteName, titleButton, link);
}

export function getBoardsStructWithTitle(title, dashsuiteName, titleButton, link) {
  return getBoardsStructUtil(title, dashsuiteName, titleButton, link);
}
// rcl

// All dashboard
// rst
export function getAllBoardsStructUtil(title, titleButton, link) {
  const coll = getAllDashboardsCollection();
  return getTitledTableStructure(title, coll, titleButton, link, urlPaths.dashboard.get.listAll());
}

export function getAllBoardsStruct(titleButton, link) {
  return getAllBoardsStructUtil('Dashboards', titleButton, link);
}

export function getAllBoardsStructNoTitle(titleButton, link) {
  return getAllBoardsStructUtil('', titleButton, link);
}

export function getAllBoardsStructWithTitle(title, titleButton, link) {
  return getAllBoardsStructUtil(title, titleButton, link);
}
// rcl

// Users
// rst
export function getUsersStructUtil(title, titleButton, link) {
  const coll = getUsersCollection();
  return getTitledTableStructure(title, coll, titleButton, link, urlPaths.users.get.users);
}

export function getUsersStruct(titleButton, link) {
  return getUsersStructUtil('Users', titleButton, link);
}

export function getUsersStructNoTitle(titleButton, link) {
  return getUsersStructUtil('', titleButton, link);
}

export function getUsersStructWithTitle(title, titleButton, link) {
  return getUsersStructUtil(title, titleButton, link);
}
// rcl
