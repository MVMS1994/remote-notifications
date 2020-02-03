import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import App from './components/App'

const unCurryReducers = function(reducers) {
  let reactReducer = {};
  for(let reducer in reducers) {
    reactReducer[reducer] = function(state, action) {
      return reducers[reducer](state)(action)();
    }
  }

  return reactReducer;
}

window.initReact = function(reducers) {
  var store = createStore(combineReducers(unCurryReducers(reducers)))
  window.__store = store;
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )

  return store;
};