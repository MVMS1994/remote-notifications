exports["_foreignRead"] = function(just) {
  return function(nothing) {
    return function(key) {
      return function(obj) {
        if(obj[key]) {
          return just(obj[key]);
        } else {
          return nothing;
        }
      }
    }
  }
}
