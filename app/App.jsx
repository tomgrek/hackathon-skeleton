// you need these two imports minimum
import React from 'react';
import styles from './App.scss';

// here's another React component just to show how it's done
import SuccessBox from './SuccessBox.jsx';

export default class App extends React.Component {
  // set initial state in ES2016 as follows
  state = {
    text: 'If you can see this, it worked :)'
  }
  constructor(props) {
    super(props);
    // don't set initial state like this any more (although it still works and is fine):
    // this.state = { text: "dont do this" };
    console.log(this.refs.mySuccessBox);
  }
  componentDidMount() {
    // can get refs to other DOM nodes as follows
    console.log(this.refs.mySuccessBox.state);
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
        <SuccessBox ref="mySuccessBox" text={this.state.text} />
      </div>
    );
  }
}
