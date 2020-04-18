import React from 'react'
import { Button, Col, Nav, Navbar, Form, NavDropdown, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

import Preferences from "./Preferences";
import SearchBar from "./SearchBar";

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
    let plainItems = this.props.items.slice(0, 4).map((item, index) => {
      return (
        <Nav.Link
          key={"main_nav_item_" + index}
          active={this.props.active === item.source}
          eventKey={item.source}>
          {item.name}
        </Nav.Link>
      );
    });

    let dropDownItems = this.props.items.slice(4).map((item, index) => {
      return (
        <NavDropdown.Item
          key={"main_nav_item_" + index + 4}
          eventKey={item.source}>
          {item.name}
        </NavDropdown.Item>
      );
    });
    let dropDown = null;
    if(dropDownItems.length > 0) {
      dropDown = (
        <NavDropdown
          bg="dark" variant="dark"
          title="Others"
          id="collasible-nav-dropdown">
          {dropDownItems}
        </NavDropdown>
      );
    }

    return (<>
      {plainItems}
      {dropDown}
    </>);
  }

  getSideButton() {
    if(this.props.isSignedIn) {
      return (
        <Nav onSelect={this.props.onOptionsSelect}>
          <NavDropdown
            bg="dark" variant="dark"
            title="Profile" alignRight
            id="collasible-nav-dropdown">
            <NavDropdown.Item> {this.props.username} </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item eventKey="EXPORT_DB"> Export </NavDropdown.Item>
            <NavDropdown.Item eventKey="IMPORT_DB"> Import </NavDropdown.Item>
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
      );
    } else if(!this.props.isLoading) {
      return (
        <Nav>
          <div id="firebaseui-auth-container" style={{ display: "inline-block" }}/>
        </Nav>
      );
    } else {
      return (
        <Nav>
          <Navbar.Text>&nbsp;&nbsp;Loading...</Navbar.Text>
        </Nav>
      );
    }
  }

  getSearchBar(className) {
    return (
      <SearchBar
        onQuery={this.props.onQuery}
        className={className}/>
    );
  }

  renderMenu() {
    return (
      <>
        {this.getSearchBar("d-inline d-md-none")}
        <Navbar.Toggle aria-controls="header-navbar-nav"/>
        <Navbar.Collapse id="header-navbar-nav">
          <Nav onSelect={this.props.onSelect} className="mr-auto">
            {this.getMenuItems()}
          </Nav>

          {this.getSearchBar("d-none d-md-inline")}
          {this.getSideButton()}
        </Navbar.Collapse>
      </>
    );
  }

  render() {
    return (
      <>
        {this.getStyles()}
        <Navbar bg="dark" variant="dark" sticky="top" expand="sm">
          <Navbar.Brand
            className="d-none d-md-block">
            <img
              src="./logo.png"
              width="40"
              height="40"
              alt="logo"
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