import React, {PropTypes} from 'react';

import {connect} from 'react-redux';

class SuccessBox extends React.Component {
  // State here refers to only the component's local state
  state = {
    inputTextValue: 'Demo input box'
  }
  // Redux store should probably go in context types, too.
  // router won't appear in this.context unless we declare it here
  static contextTypes = {
    router: React.PropTypes.object
  };
  constructor(props) {
    super(props);
    // must bind the this context otherwise it'll be unset (null)
    this.boxClick = this.boxClick.bind(this);
    this.inputTextChanged = this.inputTextChanged.bind(this);
  }
  componentDidMount() {
    // alert the user before allowing them to go back
    this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    // a dummy thing to show how to use route props
    if (this.props.route.title) {
      document.title = this.props.route.title + ' - ' + document.title;
    }
  }
  routerWillLeave(nextLocation) {
    /*let yn = confirm("Are you sure you want to leave to " + nextLocation.pathname + "? Your work isn't saved",nextLocation);
    if (yn === true) {
      alert('Check the console');
      return true;
    } else {
      return false;
    }*/
  }
  boxClick(evt) {
    this.props.dispatch({type: 'ADD_CLICK'});
  }
  inputTextChanged(evt) {
    this.setState({inputTextValue: evt.target.value});
  }
  render() {
    // here you can see how to do onClick, onChange, display reactive data, and inline styles
    // in practice, you may wish to wrap inputs in a form and handle onSubmit.
    // we're wrapping the component in an absolutely positioned div because otherwise the React CSS transition
    // doesn't work properly.
    return (
      <div style={{position:'absolute', width:'100%'}}>
      <div id="successBox1" className="successBox" onClick={this.boxClick}>
        {this.props.text} - clicked {this.props.numClicks} times<br />
        <input type="text" onChange={this.inputTextChanged} value={this.state.inputTextValue} style={{border:"1px solid black", lineHeight: "1.2em", height: "2em"}}/>
      </div>
    </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    numClicks: state.clicks,
    text: state.text
  };
}

export default connect(mapStateToProps)(SuccessBox);
