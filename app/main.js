import React from 'react';
import {render} from 'react-dom';

import { Router, Route, browserHistory } from 'react-router';

import App from './App.jsx';
import SuccessBox from './SuccessBox.jsx';
import UrlParamBox from './UrlParamBox.jsx';
import FourOhFour from './FourOhFour.jsx';

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

// with React Router, you can nest these routes
render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={App} title="[Path]">
          <Route path="/" component={SuccessBox} />
          <Route path="abc/:id" component={UrlParamBox} />
          <Route path="*" component={FourOhFour}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);

//   <ReactCSSTransitionGroup transitionName="page-transition">
