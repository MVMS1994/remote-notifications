import React from 'react'
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  getWelcomeMessage() {
    if(this.props.isLoading) {
      return "Loading...";
    } else if(this.props.isSignedIn) {
      return "Hello " + this.props.userName;
    } else {
      return "";
    }
  }

  render() {
    return (
      <div>
        <div id="firebaseui-auth-container" style={{ display: "inline-block" }}/>

        <Button
          style={{
            margin: "16px 24px",
            display: (this.props.isSignedIn)? "inline-block" : "none"
          }}
          variant="dark"
          onClick={this.props.signout}
          disabled={!this.props.isSignedIn}>
          Sign Out
        </Button>
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
