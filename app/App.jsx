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
  static self;
  constructor(props) {
    super(props);
    self = this;
  }
  componentWillMount() {
    let xhr = new XMLHttpRequest();
     xhr.open('get', '/getLoggedInUsername');
     xhr.onload = function() {
       console.log(this.response);
       self.props.dispatch({type: 'STORE_USER', who: this.response});
     };
     xhr.send();
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
          <Link to="/abc/A_URL_Parameter" activeClassName="youAreHere">Try clicking me</Link>
          <Link to="/tryLogin" style={{marginLeft: '3em'}}>Log In|({this.props.user})</Link>
          <Link to="#" onClick={this.context.router.goBack} style={{float:"right"}}>GO BACK</Link>
        </span>
        <ReactCSSTransitionGroup component="div" transitionName="page-transition" transitionEnterTimeout={100} transitionLeaveTimeout={100}>
          {React.cloneElement(this.props.children, {key: this.props.location.key})}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    numClicks: state.clicks,
    text: state.text,
    user: state.user
  };
}

export default connect(mapStateToProps)(App);
