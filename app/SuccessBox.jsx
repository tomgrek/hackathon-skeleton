import React from 'react';
import styles from './App.scss';

export default class SuccessBox extends React.Component {
  // the text in the box was passed as a prop from the App component. Here we add that to the component's state
  state = {
    text: this.props.text,
    clicks: 0,
    inputTextValue: 'Demo input box'
  }
  constructor(props) {
    super(props);
    // must bind the this context otherwise it'll be unset (null)
    this.boxClick = this.boxClick.bind(this);
    this.inputTextChanged = this.inputTextChanged.bind(this);
  }
  boxClick(evt) {
    this.setState({clicks: this.state.clicks+1});
  }
  inputTextChanged(evt) {
    this.setState({inputTextValue: evt.target.value});
  }
  render() {
    // here you can see how to do onClick, onChange, display reactive data, and inline styles
    // in practice, you may wish to wrap inputs in a form and handle onSubmit.
    return (
      <div id="successBox1" className="successBox" onClick={this.boxClick}>
        {this.state.text} - clicked {this.state.clicks} times<br />
        <input type="text" onChange={this.inputTextChanged} value={this.state.inputTextValue} style={{border:"1px solid black", lineHeight: "1.2em", height: "2em"}}/>
      </div>
    );
  }
}
