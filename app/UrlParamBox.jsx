// you need these two imports minimum
import React from 'react';
import styles from './App.scss';

export default class UrlParamBox extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // shows how to get params from the URL
    console.log(this.props.params.id);
  }
  render() {
    return (
      <div>
        I hope you saw the nice fade!
      </div>
    );
  }
}
