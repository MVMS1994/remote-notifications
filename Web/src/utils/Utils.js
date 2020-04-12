exports["logAny"] = console.log

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

exports["_windowWrite"] = function(key) {
  return function(value) {
    return function() {
      window[key] = value;
    }
  }
}

exports["_windowRead"] = function(key) {
  return function(just) {
    return function(nothing) {
      return function() {
        if(window[key]) {
          return just(window[key]);
        } else {
          return nothing;
        }
      }
    }
  }
}