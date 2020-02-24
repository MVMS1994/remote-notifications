import React from 'react'
import { connect } from 'react-redux';
import { Table, Container, Col, Row, Nav } from 'react-bootstrap';

import Header from '../components/Header';
import Messages from '../components/Messages';
import Notifications from '../components/Notifications';
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
        .fullscreen {
          height: 100vh;
        }
        .dark {
          background: #263238;
        }

        .content {
          padding: 8px;
        }
      `}
      </style>
    )
  }

  getWelcomeMessage() {
    if(this.props.isSignedIn) {
      return this.props.userName;
    } else {
      return "Hello, Guest";
    }
  }

  onOptionsSelect(selected) {
    this.setState({
      selected: selected
    })

  }

  componentDidMount() {
    this.props.tabChanged(this.state.selected);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.selected !== prevState.selected) {
      this.props.tabChanged(this.state.selected);
    }
  }

  renderBody() {
    return (
      <Container fluid={true} className="dark">
        <Row>
          <Col className="content">

            <Notifications
              isSelected={this.state.selected == "Notifications"}
              messages={this.props.notifications} />

            <Messages
              isSelected={this.state.selected == "Messages"}
              messages={this.props.notifications} />

          </Col>
        </Row>
      </Container>

    )
  }

  render() {
    return (
      <div className="fullscreen dark">
        <Header
          logo={this.props.logo}
          active={this.state.selected}
          onSignIn={() => {}}
          onSelect={this.onOptionsSelect}
          username={this.getWelcomeMessage()}
          onSignOut={this.props.signout}
          isLoading={this.props.isLoading}
          isSignedIn={this.props.isSignedIn}
          items={["Notifications", "Messages"]}
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
    signout: () => dispatch({ type: 'DO_SIGN_OUT' }),
    tabChanged: (tab) => dispatch({ type: 'NEW_TAB', tab: tab })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
