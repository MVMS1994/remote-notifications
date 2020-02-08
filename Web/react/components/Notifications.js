import React from 'react';
import { Table } from 'react-bootstrap';

class Notifications extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  renderNotifications() {
    return (
      (this.props.messages || [])
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

  render() {
    return this.addCSS(
      <Table striped bordered size hover responsive="lg" variant="dark">
        <thead>
          <tr>
            <th width="1%">#</th>
            <th width="9%">Source</th>
            <th width="30%">Title</th>
            <th width="30%">Body</th>
            <th width="30%">BigText</th>
          </tr>
        </thead>
        <tbody id="notifications-table">
          {
            this.renderNotifications()
          }
        </tbody>
      </Table>
    )
  }

  addCSS(item) {
    return item
  }
}

export default Notifications