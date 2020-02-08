import React from 'react'
import { Button, Navbar, OverlayTrigger, Tooltip } from 'react-bootstrap';

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navbar bg="dark" variant="dark" sticky="top">
        <Navbar.Brand href="#home">
          <img
            src="./logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top img-thumbnail"
          />
        </Navbar.Brand>

        <Navbar.Text> {this.props.username} </Navbar.Text>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <div id="firebaseui-auth-container" style={{ display: "inline-block" }}/>
          <Button
            style={{
              margin: "16px 24px",
              display: (this.props.isSignedIn)? "inline-block" : "none"
            }}
            variant="outline-light"
            onClick={this.props.onSignOut}
            disabled={this.props.isLoading}>
            Sign Out
          </Button>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Header