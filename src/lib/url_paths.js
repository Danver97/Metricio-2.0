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
      create: () => '/users/create',
      list: () => '/users/list',
      login: () => '/users/login',
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
      newWidget: (dash) => checkParam`/dashboard/newWidget/${dash}`(':dashboard'),
    },
    post: {
      create: () => '/dashboard/create',
      delete: (dash) => checkParam`/dashboard/delete/${dash}`(':dashboard'),
      edit: (dash) => checkParam`/dashboard/edit/${dash}`(':dashboard'),
      save: (dash) => checkParam`/dashboard/save/${dash}`(':dashboard'),
      newWidget: (dash) => checkParam`/dashboard/newWidget/${dash}`(':dashboard'),
    },
  },
  dashsuites: {
    get: {
      dashsuites: () => '/dashsuites',
      dashboards: (dashsuite) => checkParam`/dashsuites/dashboards/${dashsuite}`(':dashsuite'),
      create: () => '/dashsuites/create',
      list: () => '/dashsuites/list',
      view: (dashsuite) => checkParam`/dashsuites/view/${dashsuite}`(':dashsuite'),
    },
    post: {
      create: () => '/dashsuites/create',
      delete: (dashsuite) => checkParam`/dashsuites/delete/${dashsuite}`(':dashsuite'),
    },
  },
  jobs: {
    get: {
      create: () => '/jobs/create',
      edit: (jobName) => checkParam`/jobs/edit/${jobName}`(':jobName'),
      getJobNamesLike: () => '/jobs/getJobNamesLike',
      getTaskNamesLike: () => '/jobs/getTaskNamesLike',
      job: (jobName) => checkParam`/jobs/job/${jobName}`(':jobName'),
      jobs: () => '/jobs',
      list: () => '/jobs/list',
    },
    post: {
      create: () => '/jobs/create',
      delete: (jobName) => checkParam`/jobs/delete/${jobName}`(':jobName'),
      update: (jobName) => checkParam`/jobs/update/${jobName}`(':jobName'),
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
