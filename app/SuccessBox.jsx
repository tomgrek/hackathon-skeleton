import React, {PropTypes} from 'react';

import {connect} from 'react-redux';

class SuccessBox2 extends React.Component {
  // State here refers to only the component's local state
  state = {
    inputTextValue: 'Demo input box'
  }
  constructor(props) {
    super(props);
    // must bind the this context otherwise it'll be unset (null)
    this.boxClick = this.boxClick.bind(this);
    this.inputTextChanged = this.inputTextChanged.bind(this);
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
    return (
      <div id="successBox1" className="successBox" onClick={this.boxClick}>
        {this.props.text} - clicked {this.props.numClicks} times<br />
        <input type="text" onChange={this.inputTextChanged} value={this.state.inputTextValue} style={{border:"1px solid black", lineHeight: "1.2em", height: "2em"}}/>
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

const SuccessBox = connect(mapStateToProps)(SuccessBox2);

export default SuccessBox;
