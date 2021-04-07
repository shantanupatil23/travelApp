import React, { Component } from "react";
import DealsService from "../services/deals.service";
import { Dropdown } from "react-dropdown-now";
import "react-dropdown-now/style.css";
import img_bg from "../assets/img_bg.jpg";

export default class Deals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deals: [],
      places: [],
      type: "cheapest",
      departure: "",
      arrival: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getPlaces();
    DealsService.getDeals("London", "Amsterdam")
      .then((response) => {
        this.sortByTime(response.data, "cheapest");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  sortByTime(sortedDeals, type) {
    if (type === "cheapest") {
      for (let i = 0; i < sortedDeals.length; i++) {
        for (let j = 0; j < sortedDeals.length; j++) {
          if (
            sortedDeals[i].cost - sortedDeals[i].discount <
            sortedDeals[j].cost - sortedDeals[j].discount
          ) {
            let temp = sortedDeals[i];
            sortedDeals[i] = sortedDeals[j];
            sortedDeals[j] = temp;
          }
        }
      }
    } else {
      for (let i = 0; i < sortedDeals.length; i++) {
        for (let j = 0; j < sortedDeals.length; j++) {
          if (
            sortedDeals[i].duration.h * 60 + sortedDeals[i].duration.m <
            sortedDeals[j].duration.h * 60 + sortedDeals[j].duration.m
          ) {
            let temp = sortedDeals[i];
            sortedDeals[i] = sortedDeals[j];
            sortedDeals[j] = temp;
          }
        }
      }
    }
    this.setState({
      deals: sortedDeals,
    });
  }

  toggleCheapest = () => {
    this.setState({
      type: "cheapest",
    });
    const { deals } = this.state;
    this.sortByTime(deals, "cheapest");
  };

  toggleFastest = () => {
    this.setState({
      type: "fastest",
    });
    const { deals } = this.state;
    this.sortByTime(deals, "fastest");
  };

  handleChange(event) {
    this.getPlaces(event.target.value);
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { departure, arrival, type } = this.state;
    DealsService.getDeals(departure, arrival)
      .then((response) => {
        this.sortByTime(response.data, type);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getPlaces() {
    DealsService.getPlaces()
      .then((response) => {
        this.setState({
          places: response.data.sort(),
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  showEmoji(transport) {
    switch (transport) {
      case "car":
        return "🚗";
      case "bus":
        return "🚌";
      case "train":
        return "🚂";
      default:
        return "🚂";
    }
  }

  renderDeals(deals) {
    if (deals.length !== 0) {
      let dealsColumn = [];
      for (const deal in deals) {
        dealsColumn.push(
          <div className="row divDeal">
            <p className="pTransport">
              {this.showEmoji(deals[deal].transport)}
            </p>
            <div className="dealDiv">
              <p className="dealHeading">Vehicle id:</p>
              <p className="dealBody">{deals[deal].reference}</p>
            </div>
            <div className="dealDiv">
              <p className="dealHeading">Duration:</p>
              <p className="dealBody">
                <strong>{deals[deal].duration.h}</strong>h{" "}
                {deals[deal].duration.m}m
              </p>
            </div>
            <div className="dealDiv">
              <p className="dealHeading">Price:</p>
              <p className="dealBody">
                <strike>{deals[deal].cost}</strike>-{deals[deal].discount}
              </p>
            </div>
            <div className="dealDiv">
              <p className=" dealBody dealBig">
                {deals[deal].cost - deals[deal].discount}€
              </p>
            </div>
            <button className="dealButton">
              Book
              <br />
              Now
            </button>
          </div>
        );
      }
      return dealsColumn;
    } else {
      return "No Deals Found";
    }
  }

  render() {
    const { deals, places } = this.state;

    return (
      <div>
        <div className="row divMainRow">
          <div>
            <div className="divSearch">
              <form onSubmit={this.handleSubmit}>
                <h2>Search for best Deals</h2>
                <div className="divDropdown">
                  <Dropdown
                    className="dropdown"
                    placeholder="Departure"
                    options={places}
                    onChange={(value) =>
                      this.setState({ departure: value.label })
                    }
                  />
                  <div className="dividerDropdown"></div>
                  <Dropdown
                    className="dropdown"
                    placeholder="Arrival"
                    options={places}
                    onChange={(value) =>
                      this.setState({ arrival: value.label })
                    }
                  />
                </div>
                <input type="submit" value="Search" />
              </form>
            </div>
            <img src={img_bg} alt="Travel App" />
          </div>
          <div className="divDeals">
            {/* <p>
              from <strong>{this.state.departure}</strong> to{" "}
              <strong>{this.state.arrival}</strong>
            </p> */}
            <p className="pDealsLocations">
              from <strong>London</strong> to <strong>Amsterdam</strong>
            </p>
            <p className="pDealsSort">
              Sort By:&nbsp;
              <button
                className={
                  this.state.type === "cheapest"
                    ? "activeButton"
                    : "inactiveButton"
                }
                onClick={this.toggleCheapest}
              >
                Cheapest
              </button>{" "}
              <button
                className={
                  this.state.type === "fastest"
                    ? "activeButton"
                    : "inactiveButton"
                }
                onClick={this.toggleFastest}
              >
                Fastest
              </button>
            </p>
            {this.renderDeals(deals)}
          </div>
        </div>
      </div>
    );
  }
}
