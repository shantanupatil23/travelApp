import React, { Component } from "react";
import DealsService from "../services/deals.service";
import { Dropdown } from "react-dropdown-now";
import img_bg from "../assets/img_bg.jpg";
import gif_car from "../assets/gif_car.gif";

export default class Deals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deals: [],
      places: [],
      type: "cheapest",
      departure: "",
      arrival: "",
      searchedDeparture: "",
      searchedArrival: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getPlaces();
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
        this.setState({
          searchedDeparture: departure,
          searchedArrival: arrival,
        });
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

  book() {
    alert("You ticket is succesfully booked!");
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
            <button className="dealButton" onClick={this.book}>
              Book
              <br />
              Now
            </button>
          </div>
        );
      }
      return dealsColumn;
    } else {
      return (
        <div className="row divDeal">
          <div className="dealDiv">
            <p className="dealHeading">Uh Oh!</p>
            <p className="dealBody">
              There are no deals available for your selected places.
            </p>
          </div>
        </div>
      );
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
          {this.state.searchedDeparture !== "" &&
          this.state.searchedArrival !== null ? (
            <div className="divDeals">
              <p className="pDealsLocations">
                from <strong>{this.state.searchedDeparture}</strong> to{" "}
                <strong>{this.state.searchedArrival}</strong>
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
          ) : (
            <div className="divDeals divCar">
              <h3>Go ahead and do your Search!</h3>
              <img className="gif_car" src={gif_car} alt="flying car" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
