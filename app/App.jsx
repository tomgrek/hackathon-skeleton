// you need these two imports minimum
import React from 'react';
import styles from './App.scss';

import {connect} from 'react-redux';

// To get the leaveHook for React Router, links must be <Link to=> not <a href=>
import {Link} from 'react-router';

// here's another React component just to show how it's done
import SuccessBox from './SuccessBox.jsx';

class App extends React.Component {
  // Redux store should probably go in context types, too.
  // router won't appear in this.context unless we declare it here
  static contextTypes = {
    router: React.PropTypes.object
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // alert the user before allowing them to go back
    this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    // a dummy thing to show how to use route props
    if (this.props.route.title) {
      document.title = this.props.route.title + ' - ' + document.title;
    }
  }
  componentDidUpdate() {
    // how to use URL parameters
    if (this.props.route.path.slice(0,3) === 'abc') {
      console.log(this.props.params.id);
    }
  }
  routerWillLeave(nextLocation) {
    let yn = confirm("Are you sure you want to leave to " + nextLocation.pathname + "? Your work isn't saved",nextLocation);
    if (yn === true) {
      alert('Check the console');
      return true;
    } else {
      return false;
    }
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
        <SuccessBox ref="mySuccessBox" />
      </div>
    );
  }
}

export default connect()(App);
