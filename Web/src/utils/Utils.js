exports["logAny"] = console.log

exports["_foreignRead"] = function(obj) {
  return function(key) {
    return function(just) {
      return function(nothing) {
        if(obj[key]) {
          return just(obj[key]);
        } else {
          return nothing;
        }
      }
    }
  }
}
