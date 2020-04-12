import React from 'react'
import { connect } from 'react-redux';
import { Table, Container, Col, Row, Nav } from 'react-bootstrap';

import Header from '../components/Header';
import Notifications from '../components/Notifications';
import logo from '../../res/logo.png'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.filters = {
      sources: []
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
    this.selected = selected;
    this.props.tabChanged(selected);
  }

  componentDidMount() {
    this.onOptionsSelect(this.props.filters.sources[0].source)
  }

  findFilter(selected) {
    // TODO: Come up with a better logic
    let matched = this.props.filters.sources.filter(item => item.source === selected);
    return matched[0] || {}
  }

  renderBody() {
    return (
      <Container fluid={true} className="dark">
        <Row>
          <Col className="content">

            <Notifications
              filtered={this.findFilter(this.selected)}
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
          active={this.selected}
          logo={this.props.logo}
          onSignIn={() => {}}
          onSelect={this.onOptionsSelect}
          username={this.getWelcomeMessage()}
          onSignOut={this.props.signout}
          isLoading={this.props.isLoading}
          isSignedIn={this.props.isSignedIn}
          items={this.props.filters.sources}
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
