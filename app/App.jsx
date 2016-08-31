// you need these two imports minimum
import React from 'react';
import styles from './App.scss';

// here's another React component just to show how it's done
import SuccessBox from './SuccessBox.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
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
        <SuccessBox ref="mySuccessBox" />
      </div>
    );
  }
}
