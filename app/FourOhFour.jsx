// you need these two imports minimum
import React from 'react';
import styles from './App.scss';

export default class FourOhFour extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        404 Not Found. Served with pride by React Router.
      </div>
    );
  }
}
