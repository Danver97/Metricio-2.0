import { getCollectionOfOrderedByKeyObjects } from './utils';
import TitledTableStructure from './structures/titledTable';
import { getDashsuites, getUsers, getDashboardsFromDashsuite } from './getJsons';

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
    d.data.lastModified = `Number of dashboards: ${d.original.lastModified}`;
  });

  return getCollectionOfOrderedByKeyObjects(dashSuites, keyOrder, 'data');
}

export function getDashboardsCollection(dashsuiteName) {
  const response = getDashboardsFromDashsuite(dashsuiteName);
  const dashboards = [];
  response.forEach(r => dashboards.push({data: r, original: r}));
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

export function getSuitesStruct(titleButton, link) {
  const coll = getDashSuitesCollection();
  return getTitledTableStructure('Dashboard Suites', coll, titleButton, link, '/dashsuites');
}

export function getBoardsStruct(dashsuiteName, titleButton, link) {
  const coll = getDashboardsCollection(dashsuiteName);
  return getTitledTableStructure('Dashboards', coll, titleButton, link, '/dashboards');
}

export function getUsersStruct(titleButton, link) {
  const coll = getUsersCollection();
  return getTitledTableStructure('Users', coll, titleButton, link, '/users');
}

function getTitledTableStructure(title, coll, titleBut, link, defLink) {
  let buttonLink;
  if (titleBut)
    buttonLink = link || coll[0].original.create || defLink;
  return new TitledTableStructure(title, coll, titleBut, buttonLink);
}
