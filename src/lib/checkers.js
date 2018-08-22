function checkArray(array, type) {
  if (array && Array.isArray(array)) {
    if (type) {
      if (typeof type === 'function') {
        if (array[0] instanceof type)
          return true;
        return false;
      } else if (typeof type === 'string') {
        if (typeof array[0] === type)
          return true;
        return false;
      }
    }
    return true;
  }
  return false;
}

export default { checkArray };
