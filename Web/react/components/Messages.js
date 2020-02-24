import React from 'react';
import { Table } from 'react-bootstrap';

class Messages extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  renderMessages() {
    return (
      (this.props.messages || [])
      .slice(0)
      .reverse()
      .map((item, index) => {
        return (
          <tr
            style={{"fontSize": "smaller"}}
            key={"sms_" + index}>
            <td>{index}</td>
            <td>{item.source}</td>
            <td style={{"wordBreak": "break-word"}}>{item.title}</td>
            <td style={{"wordBreak": "break-word"}}>{item.body}</td>
          </tr>
        );
      })
    )
  }

  renderHeaders(headers) {
    return headers.map((item, index) => {
      return (
        <th
          key={"sms_header_" + index}
          width={item.width}>
          {item.name}
        </th>
      )
    })
  }

  render() {
    let headers = [{
      name: "#",
      width: "1%"
    }, {
      name: "Source",
      width: "9%"
    }, {
      name: "Title",
      width: "25%"
    }, {
      name: "Body",
      width: "65%"
    }]

    return this.addCSS(
      <Table striped bordered hover responsive variant="dark">
        <thead><tr>
          { this.renderHeaders(headers) }
        </tr></thead>
        <tbody id="messages-table">
          { this.renderMessages() }
        </tbody>
      </Table>
    )
  }

  addCSS(item) {
    return (
      <div style={{display: this.props.isSelected? "block": "none"}}>
        {item}
      </div>
    );
  }
}

export default Messages