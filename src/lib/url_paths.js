import qs from 'query-string';

function checkParam(strings) {
  const values = Array.from(arguments);
  values.shift();
  const result = function () {
    const resultArr = [];
    const params = Array.from(arguments);
    let index;
    values.forEach((value, i) => {
      index = i;
      if (!value)
        resultArr.push(strings[i], params[i]);
      else
        resultArr.push(strings[i], values[i]);
    });
    resultArr.push(strings[index + 1]);
    return resultArr.join('');
  };
  return result;
}

export default {
  home: {
    get: {
      home: () => '/',
    },
  },
  users: {
    get: {
      users: () => '/users',
      list: () => '/users/list',
      login: () => '/users/login',
      create: () => '/users/create',
    },
    post: {
      create: () => '/users/create',
      delete: () => '/users/delete',
      login: () => '/users/login',
      changePassword: () => '/users/changePassword',
    },
  },
  dashboard: {
    get: {
      dashboard: (dash) => checkParam`/dashboard/get/${dash}`(':dashboard'),
      create: () => '/dashboards/create',
      edit: (dash) => checkParam`/dashboard/edit/${dash}`(':dashboard'),
      getStructure: (dash) => checkParam`/dashboard/getStructure/${dash}`(':dashboard'),
      getComponentStructure: (dash) => checkParam`/dashboard/getComponentStructure/${dash}`(':dashboard'),
      listAll: () => '/dashboard/listAll',
    },
    post: {
      create: () => '/dashboard/create',
      save: (dash) => checkParam`/dashboard/save/${dash}`(':dashboard'),
      edit: (dash) => checkParam`/dashboard/edit/${dash}`(':dashboard'),
      delete: (dash) => checkParam`/dashboard/delete/${dash}`(':dashboard'),
    },
  },
  dashsuites: {
    get: {
      dashsuites: () => '/dashsuites',
      create: () => '/dashsuites/create',
      list: () => '/dashsuites/list',
      view: (dashsuite) => checkParam`/dashsuites/view/${dashsuite}`(':dashsuite'),
      dashboards: (dashsuite) => checkParam`/dashsuites/dashboards/${dashsuite}`(':dashsuite'),
    },
    post: {
      create: () => '/dashsuites/create',
      delete: (dashsuite) => checkParam`/dashsuites/delete/${dashsuite}`(':dashsuite'),
    },
  },
};

export function addQuery(path, queryObj) {
  return `${path}?${qs.stringify(queryObj)}`;
}

/*
//get
      // dashboard: (dash) => checkParam`/dashboard/${dash}`(':dashboard'),
      // edit: (dash) => checkParam`/dashboard/${dash}/edit`(':dashboard'),
      // getStructure: (dash) => checkParam`/dashboard/${dash}/getStructure`(':dashboard'),
      // getComponentStructure: (dash) => checkParam`/dashboard/${dash}/getComponentStructure`(':dashboard'),
//post
      // save: (dash) => checkParam`/dashboard/${dash}/save`(':dashboard'),
      // edit: (dash) => checkParam`/dashboard/${dash}/edit`(':dashboard'),
*/
