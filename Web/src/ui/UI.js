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

exports["updateFilters"] = function(notifications) {
  return function(filters) {
    return function() {
      let initialFilter = filters.sources.reduce(function(acc, item) {
        acc[item.source] = item;
        return acc;
      }, {});
      let items = notifications
        .reduce((acc, item) =>
          {
            acc["_all"].count += 1
            acc[item.source] = {
              name: item.appName || (acc[item.source] || {}).name || item.source,
              count: ((acc[item.source] || {}).count || 0) + 1,
              source: item.source
            };
            return acc;
          },
          initialFilter);

      filters.sources = Object
        .values(items)
        .sort((f, s) => (f.count - s.count) * -1);

      return filters;
    }
  }
}
