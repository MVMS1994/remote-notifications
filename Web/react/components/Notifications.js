import React from 'react';
import { Table } from 'react-bootstrap';

class Notifications extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  renderNotifications() {
    let active = this.props.filtered.source;
    return (
      (this.props.messages || [])
      .slice(0)
      .reverse()
      .filter((item) => (item.source === active || active === "_all"))
      .map((item, index) => {
        return (
          <tr
            style={{"fontSize": "smaller"}}
            key={"notif_" + index}>
            <td>{index}</td>
            <td>{item.appName || item.source}</td>
            <td style={{"wordBreak": "break-word"}}>{item.title}</td>
            <td style={{"wordBreak": "break-word"}}>{item.body}</td>
            <td style={{"wordBreak": "break-word"}}>{item.bigText != "null"? item.bigText: ""}</td>
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
      width: "25%"
    }, {
      name: "Body",
      width: "25%"
    }, {
      name: "BigText",
      width: "40%"
    }]

    return this.addCSS(
      <Table striped bordered hover responsive variant="dark">
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
    return (
      <>
        {item}
      </>
    );
  }
}

export default Notifications