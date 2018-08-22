export default {
  users: {
    get: {
      list: () => '/users/list',
    },
    post: {
      create: () => '/users/create',
      login: () => '/users/login',
      changePassword: () => '/users/changePassword',
    }
  },
  dashboard: {
    get: {
      dashboard: (dash) => checkParam`/dashboard/${dash}`(':dashboard'),
      getStructure: (dash) => checkParam`/dashboard/${dash}/getStructure`(':dashboard'),
    },
    post: {
      save: (dash) => checkParam`/dashboard/${dash}/save`(':dashboard'),
      edit: (dash) => checkParam`/dashboard/${dash}/edit`(':dashboard'),
    }
  },
  dashsuites: {
    get: {
      list: () => '/dashsuite/list',
      view: (dashsuite) => checkParam`/dashsuite/view/${dashsuite}`(':dashsuite'),
      dashboards: (dashsuite) => checkParam`/dashsuite/dashboards/${dashsuite}`(':dashsuite'),
    },
    post: {
      create: () => '/dashsuite/create',
    }
  },
};

function checkParam(strings) {
  const values = Array.from(arguments)
  values.shift();
  const result = function() {
    const result = [];
    const params = Array.from(arguments);
    let index;
    values.forEach((value, i) => {
      index = i;
      if(!value)
        result.push(strings[i], params[i]);
      else
        result.push(strings[i], values[i]);
    });
    result.push(strings[index+1]);
    return result.join('');
  };
  return result;
}
