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
  }

  sort(sortedDeals, type) {
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
    this.sort(deals, "cheapest");
  };

  toggleFastest = () => {
    this.setState({
      type: "fastest",
    });
    const { deals } = this.state;
    this.sort(deals, "fastest");
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
        this.sort(response.data, type);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getPlaces() {
    DealsService.getPlaces()
      .then((response) => {
        this.setState({
          places: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  renderDeals(deals) {
    if (deals.length !== 0) {
      let dealsColumn = [];
      for (const deal in deals) {
        dealsColumn.push(
          <div className="row">
            <p>{deals[deal].transport}</p>
            <p>{deals[deal].reference}</p>
            <p>{deals[deal].departure}</p>
            <p>{deals[deal].arrival}</p>
            <p>
              {deals[deal].duration.h}h {deals[deal].duration.m}m
            </p>
            <p>{deals[deal].cost} </p>
            <p>{deals[deal].discount} </p>
            <p>{deals[deal].cost - deals[deal].discount}</p>
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
        <img src={img_bg} alt="background_image"></img>
        <div className="searchDiv">
          <form onSubmit={this.handleSubmit}>
            <h2>Search for best Deals</h2>
            <Dropdown
              className="dropdown"
              placeholder="Departure"
              options={places}
              onChange={(value) => this.setState({ departure: value.label })}
            />
            <Dropdown
              className="dropdown"
              placeholder="Arrival"
              options={places}
              onChange={(value) => this.setState({ arrival: value.label })}
            />
            <input type="submit" value="Search" />
          </form>
        </div>
        <div>
          <div className="sortDiv">
            <p>
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
              </button>
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
          </div>
          {this.renderDeals(deals)}
        </div>
      </div>
    );
  }
}
