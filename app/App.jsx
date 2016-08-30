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
  }
  render() {
    return (
      <div id="app">
        <SuccessBox text={this.state.text} />
      </div>
    );
  }
}
