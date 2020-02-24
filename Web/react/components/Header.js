import React from 'react'
import { Button, Nav, Navbar, Form, NavDropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  getStyles() {
    return (
      <style type="text/css">
      {``}
      </style>
    );
  }

  getMenuItems() {
    return this.props.items.map((item, index) => {
      return (
        <Nav.Link
          key={"main_nav_item_" + index}
          eventKey={item}
          className={(this.props.active == item)? "active" : ""}>
          {item}
        </Nav.Link>
      )
    });
  }

  renderMenu() {
    if(this.props.isSignedIn) {
      return (
        <>
          <Navbar.Toggle aria-controls="header-navbar-nav"/>
          <Navbar.Collapse id="header-navbar-nav">
            <Nav onSelect={this.props.onSelect} className="mr-auto">
              {this.getMenuItems()}
            </Nav>

            <Nav>
              <NavDropdown
                bg="dark" variant="dark"
                title="Profile" alignRight
                id="collasible-nav-dropdown">
                <NavDropdown.Item> {this.props.username} </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <Button
                    style={{
                      display: (this.props.isSignedIn)? "inline-block" : "none"
                    }}
                    variant="outline-dark"
                    onClick={this.props.onSignOut}
                    disabled={this.props.isLoading}>
                    Sign Out
                  </Button>
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </>
      );
    } else if(!this.props.isLoading) {
      return (
        <Nav className="ml-auto">
          <div id="firebaseui-auth-container" style={{ display: "inline-block" }}/>
        </Nav>
      );
    } else {
      return (
        <Nav className="ml-auto">
          <Navbar.Text>Loading...</Navbar.Text>
        </Nav>
      );
    }
  }

  render() {
    return (
      <>
        {this.getStyles()}
        <Navbar bg="dark" variant="dark" sticky="top" expand="sm">
          <Navbar.Brand>
            <img
              src="./logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top img-thumbnail"
            />
          </Navbar.Brand>

          {this.renderMenu()}
        </Navbar>
      </>
    )
  }
}

export default Header