import React from 'react';
import styles from './App.scss';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (this.props.params.failed==='failed') {
      alert('Incorrect Username or Password!');
    }
  }
  render() {
    return (
      <div>
          <form action="/login" method="post">
            <div style={{height: '2em'}}>
          <label>Username:</label>
          <input type="text" name="username" style={{border:'1px solid black'}}/>
      </div>
      <div style={{height: '2em'}}>
          <label>Password:</label>
          <input type="password" name="password" style={{border:'1px solid black'}}/>
      </div>
      <div style={{height: '2em'}}>
          <input type="submit" value="Log In" style={{backgroundColor:'aliceblue'}}/>
      </div>
  </form>
      </div>
    );
  }
}
