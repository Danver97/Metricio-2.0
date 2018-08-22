export function getURLQueryFromObject(obj, filter) {
  let query = '';
  const filt = filter || [];
  let first = true;
  Object.keys(obj).forEach(k => {
    if (!filt.includes(k)) {
      if (first) {
        query = `${k}=${obj[k]}`;
        first = false;
      } else
        query = `${query}&${k}=${obj[k]}`;
    }
  });
  return query;
}

export function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function getCollectionOfOrderedByKeyObjects(collection, keyOrder, prop) {
  const orderedCollection = [];
  collection.forEach(elem => {
    let newElem;
    if (prop) {
      newElem = Object.assign({}, elem);
      newElem[prop] = {};
      keyOrder.forEach(k => newElem[prop][k] = elem[prop][k]);
    } else {
      newElem = {};
      keyOrder.forEach(k => newElem[k] = elem[k]);
    }
    orderedCollection.push(newElem);
  });
  return orderedCollection;
}