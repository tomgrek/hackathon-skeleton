import React from 'react';
import {render} from 'react-dom';
import App from './App.jsx';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

function reducer(state, action) {
  if (state===undefined) return {clicks: 0, text: 'If you can see this, it works :)'};
  switch(action.type) {
    case 'ADD_CLICK': {
      // clone the object! the state arg must not be mutated or your app will break
      return Object.assign({}, state, {clicks: state.clicks + 1});
    }
  }
}

export const store = createStore(reducer);

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
