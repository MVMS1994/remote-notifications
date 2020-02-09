import React from "react";
import { Nav } from 'react-bootstrap';

class SideBar extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  getStyles() {
    return (
      <style type="text/css">
      {`
        .nav {
          margin: 8px 0px;
        }
        .nav-link {
          color: rgba(255,255,255,.5);
          padding: 16px;
        }
        .selected, .nav-link:hover {
          background: #343a40;
          color: #fff;
        }
      `}
      </style>
    )
  }

  render() {
    return (
      <div>
        {this.getStyles()}
        <Nav
          className="flex-column"
          onSelect={this.props.onSelect}>
          <Nav.Link
            eventKey="Notifications"
            className={(this.props.selected == "Notifications")? "selected" : ""}>
            Notifications
          </Nav.Link>
        </Nav>
      </div>
    );
  }
}

export default SideBar;