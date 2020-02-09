import React from 'react';
import { Table } from 'react-bootstrap';

class Notifications extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  renderNotifications() {
    return (
      (this.props.messages || [])
      .slice(0)
      .reverse()
      .map((item, index) => {
        return (
          <tr
            style={{"fontSize": "smaller"}}
            key={"notif_" + index}>
            <td>{index}</td>
            <td>{item.source}</td>
            <td>{item.title}</td>
            <td>{item.body}</td>
          </tr>
        );
      })
    )
  }

  renderHeaders(headers) {
    return headers.map((item, index) => {
      return (
        <th
          key={"notif_header_" + index}
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
      width: "30%"
    }, {
      name: "Body",
      width: "30%"
    }, {
      name: "BigText",
      width: "30%"
    }]

    return this.addCSS(
      <Table striped bordered size hover responsive="lg" variant="dark">
        <thead><tr>
          { this.renderHeaders(headers) }
        </tr></thead>
        <tbody id="notifications-table">
          { this.renderNotifications() }
        </tbody>
      </Table>
    )
  }

  addCSS(item) {
    return item
  }
}

export default Notifications