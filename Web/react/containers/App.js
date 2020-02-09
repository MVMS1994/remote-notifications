import React from 'react'
import { connect } from 'react-redux';
import { Table, Container, Col, Row, Nav } from 'react-bootstrap';

import Header from '../components/Header';
import Notifications from '../components/Notifications';
import SideBar from '../components/SideBar';
import logo from '../../res/logo.png'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "Notifications"
    };
    this.onOptionsSelect = this.onOptionsSelect.bind(this);
  }

  getStyles() {
    return (
      <style type="text/css">
      {`
        .dark, .fullpage {
          position: fixed;
          width: 100%;
          height: 100%;
          padding-bottom: 70px;
        }
        .dark {
          background: #263238;
        }

        .sidebar {
          padding: 0px;
          background: #212529;
        }
        .content {
          padding: 8px;
          height: 100%;
          overflow: scroll;
        }
        .row {
          height: 100%;
        }
      `}
      </style>
    )
  }

  getWelcomeMessage() {
    if(this.props.isSignedIn) {
      return "Hello, " + this.props.userName;
    } else {
      return "Hello, Guest";
    }
  }

  onOptionsSelect(selected) {
    this.setState({
      selected: selected
    })
  }

  renderBody() {
    return (
      <Container fluid={true} className="dark">
        <Row>
          <Col md={2} className="sidebar">

            <SideBar
              selected={this.state.selected}
              onSelect={this.onOptionsSelect}/>

          </Col>
          <Col className="content">

            <Notifications
              isSelected={this.state.selected == "Notifications"}
              messages={this.props.notifications} />

          </Col>
        </Row>
      </Container>

    )
  }

  render() {
    return (
      <div className="fullpage">
        <Header
          logo={this.props.logo}
          onSignIn={() => {}}
          username={this.getWelcomeMessage()}
          onSignOut={this.props.signout}
          isLoading={this.props.isLoading}
          isSignedIn={this.props.isSignedIn}
        />
        {this.getStyles()}
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
