import React from 'react';
import { Table, Pagination } from 'react-bootstrap';

class Notifications extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filteredMessages: [],
      pages: {
        active: 1,
        total: 1,
        limit: 10
      }
    }
  }

  componentDidMount() {
    this.updateState();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.messages.length !== this.props.messages.length) {
      this.updateState();
    }
    if(prevProps.sourceFilter.source !== this.props.sourceFilter.source) {
      this.updateState();
    }
    if(prevProps.messageFilter !== this.props.messageFilter) {
      this.updateState();
    }
  }

  updateState() {
    let filterPattern = new RegExp('')
    try {
      filterPattern = new RegExp(this.props.messageFilter, "i");
    } catch(err) {}
    let activeFilter = this.props.sourceFilter.source;
    let pages = this.state.pages;
    let filteredMessages = (this.props.messages || [])
      .filter((item) => (item.source === activeFilter || activeFilter === "_all"))
      .filter((item) => {
        return this.props.messageFilter.trim() == ""
        || filterPattern.test(item.source)
        || filterPattern.test(item.appName)
        || filterPattern.test(item.title)
        || filterPattern.test(item.smallText)
        || filterPattern.test(item.bigText)
      })

    pages["total"] = Math.max(1, parseInt((filteredMessages.length + pages.limit - 1) / pages.limit));
    pages["active"] = Math.min(pages.total, pages.active);
    this.setState({ filteredMessages, pages });
  }

  pageChanged(e) {
    let pageItem = e.target.innerText.split("\n")[0];
    let pages = this.state.pages;
    let pageNumber = pages.active;

    if(pageItem === "«") {
      pageNumber = 1;
    } else if(pageItem === "‹") {
      pageNumber = Math.max(1, pages.active - 1);
    } else if(pageItem === "›") {
      pageNumber = Math.min(pages.total, pages.active + 1);
    } else if(pageItem === "»") {
      pageNumber = pages.total;
    } else if(pageItem === "…") {
    } else {
      pageNumber = parseInt(pageItem);
    }

    if(pageNumber != NaN) {
      pages["active"] = pageNumber;
      this.setState({ pages: pages });
      this.forceUpdate();
    }
  }

  renderNotifications() {
    let active = this.props.sourceFilter.source;
    let page = this.state.pages
    return (
      this.state.filteredMessages
      .slice((page.active - 1) * page.limit, (page.active) * page.limit)
      .map((item, index) => {
        return (
          <tr
            style={{"fontSize": "smaller"}}
            key={"notif_" + index}>
            <td>{index + 1}</td>
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

  renderPages(keyPrefix) {
    let page = this.state.pages;
    if(page.total > 1) {
      let items = [];
      items.push(<Pagination.First key={keyPrefix + "page_first"} />);
      items.push(<Pagination.Prev key={keyPrefix + "page_prev"} />);
      items.push(
        <Pagination.Item key={keyPrefix + "page_1"} active={1 === page.active}>
          {1}
        </Pagination.Item>
      );
      if(page.active > 5) {
        items.push(
          <Pagination.Ellipsis disabled key={keyPrefix + "page_front_dot"} />
        )
      } else if(page.active == 5) {
        items.push(
          <Pagination.Item key={keyPrefix + "page_2"}>
            {2}
          </Pagination.Item>
        )
      }

      for (let number = Math.max(2, page.active - 2); number < page.total && number <= page.active + 2; number++) {
        items.push(
          <Pagination.Item key={keyPrefix + "page_" + number} active={number === page.active}>
            {number}
          </Pagination.Item>
        );
      }

      if(page.total - page.active > 4) {
        items.push(
          <Pagination.Ellipsis disabled key={keyPrefix + "page_back_dot"} />
        );
      } else if(page.total - page.active == 4) {
        items.push(
          <Pagination.Item key={keyPrefix + "page_" + (page.total - 1)}>
            {page.total - 1}
          </Pagination.Item>
        );
      }

      items.push(
        <Pagination.Item key={keyPrefix + "page_" + page.total} active={page.total === page.active}>
          {page.total}
        </Pagination.Item>
      );
      items.push(<Pagination.Next key={keyPrefix + "page_next"} />)
      items.push(<Pagination.Last key={keyPrefix + "page_last"} />)

      return items;
    }
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
      <>
        <Pagination
          onClick={this.pageChanged.bind(this)}
          className="justify-content-center">
          { this.renderPages("top_") }
        </Pagination>

        <Table striped bordered hover responsive variant="dark">
          <thead><tr>
            { this.renderHeaders(headers) }
          </tr></thead>
          <tbody id="notifications-table">
            { this.renderNotifications() }
          </tbody>
        </Table>

        <Pagination
          onClick={this.pageChanged.bind(this)}
          className="justify-content-center">
          { this.renderPages("bottom_") }
        </Pagination>
      </>
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