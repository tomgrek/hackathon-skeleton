import React from 'react';
import {render} from 'react-dom';
import App from './App.jsx';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

function reducer(state, action) {
  if (state===undefined) state = {clicks: 0, text: 'If you can see this, it works :)'};
  let newState = {clicks: state.clicks, text: state.text};
  switch(action.type) {
    case 'ADD_CLICK': {
      newState.clicks = newState.clicks + 1;
    }
  }
  return newState;
}

export const store = createStore(reducer);

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
