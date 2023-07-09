function myfunction(a, list = []) {
  if (a === 0) return list;

  list.unshift(a);

  return myfunction(a - 1, list)  
}

module.exports = myfunction;