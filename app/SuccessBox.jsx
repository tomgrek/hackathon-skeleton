import React from 'react';
import styles from './App.scss';

export default class SuccessBox extends React.Component {
  state = {
    text: this.props.text,
    clicks: 0
  }
  constructor(props) {
    super(props);
    this.boxClick = this.boxClick.bind(this);
  }
  boxClick(evt) {
    var self = this;
    this.setState({clicks: this.state.clicks+1});
  }
  render() {
    return (
      <div id="successBox1" className="successBox" onClick={this.boxClick}>
        {this.state.text} - clicked {this.state.clicks} times
      </div>
    );
  }
}
