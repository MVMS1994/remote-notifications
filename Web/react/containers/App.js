import React from 'react'
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';

import Header from '../components/Header';
import Notifications from '../components/Notifications';
import logo from '../../res/logo.png'

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  getWelcomeMessage() {
    if(this.props.isSignedIn) {
      return "Hello, " + this.props.userName;
    } else {
      return "Hello, Guest";
    }
  }

  renderBody() {
    return (
      <Notifications
        messages={this.props.notifications} />    
    )
  }

  render() {
    return (
      <div>
        <Header
          logo={this.props.logo}
          onSignIn={() => {}}
          username={this.getWelcomeMessage()}
          onSignOut={this.props.signout}
          isLoading={this.props.isLoading}
          isSignedIn={this.props.isSignedIn}
        />

        {this.renderBody()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state["ui-state"]
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signout: () => dispatch({ type: 'DO_SIGN_OUT' })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
