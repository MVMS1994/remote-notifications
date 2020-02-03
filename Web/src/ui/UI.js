exports["_initUI"] = function(reducers) {
  return function() {
    if(typeof window.initReact === "function") {
      return window.initReact(reducers);
    } else {
      console.error("initReact not found!")
    }
  }
}

exports["getStore"] = function() {
  var store = window.__store || {}
  return {
    getState: store.getState,
    dispatch: function(obj) {
      return function() {
        return store.dispatch(obj);
      }
    }
  }
}