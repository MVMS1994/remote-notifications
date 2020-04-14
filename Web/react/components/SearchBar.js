import React from 'react';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';

class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  onQuery(e) {
    this.props.onQuery(e.target.value);
  }

  render() {
    return (
      <Form inline
        onSubmit={this.handleSubmit.bind(this)}
        className={this.props.className}>
        <InputGroup size="sm">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-search">&#128269;</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            size="sm"
            onChange={this.onQuery.bind(this)}
            placeholder="Search"
            aria-label="Search"
            aria-describedby="basic-search"
          />
        </InputGroup>
      </Form>
    );
  }
};

export default SearchBar;