// you need these two imports minimum
import React from 'react';
import styles from './App.scss';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {connect} from 'react-redux';

// To get the leaveHook for React Router, links must be <Link to=> not <a href=>
import {Link} from 'react-router';

class App extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  };
  constructor(props) {
    super(props);
  }
  // a few other React methods:
  // componentWillMount() {}
  // shouldComponentUpdate() { render is only called if this is true}
  // componentWillUpdate() {}
  // componentDidUpdate() {}
  // componentWillUnmount() {}
  render() {
    return (
      <div id="app">
        <span className="header">
          <Link to="/abc/A_URL_Parameter">Try clicking me</Link>
          <Link to="#" onClick={this.context.router.goBack} style={{float:"right"}}>GO BACK</Link>
        </span>
        <ReactCSSTransitionGroup component="div" transitionName="page-transition" >
          {React.cloneElement(this.props.children, {key: this.props.location.key})}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default connect()(App);
