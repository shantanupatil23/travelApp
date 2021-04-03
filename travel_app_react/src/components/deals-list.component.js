import React, { Component } from "react";
import DealsService from "../services/deals.service";

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

  sort(sortedDeals, type) {
    if (type === "cheapest") {
      for (let i = 0; i < sortedDeals.length; i++) {
        for (let j = 0; j < sortedDeals.length; j++) {
          if (sortedDeals[i].cost < sortedDeals[j].cost) {
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
    this.suggestPlaces(event.target.value);
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    const { departure, arrival } = this.state;
    event.preventDefault();
    this.retrieveDeals(departure, arrival);
  }

  suggestPlaces(from) {
    DealsService.getPlaces(from)
      .then((response) => {
        this.setState({
          places: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  retrieveDeals(departure, arrival) {
    DealsService.getDeals(departure, arrival)
      .then((response) => {
        this.sort(response.data, "cheapest");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  renderDeals(deals) {
    if (deals.length !== 0) {
      return JSON.stringify(deals);
    } else {
      return "No Deals Found";
    }
  }

  render() {
    const { deals, places } = this.state;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            <input
              name="departure"
              placeholder="departure"
              type="text"
              value={this.state.departure}
              onChange={this.handleChange}
            />
          </label>
          <label>
            <input
              name="arrival"
              placeholder="arrival"
              type="text"
              value={this.state.arrival}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <button onClick={this.toggleCheapest}>cheapest</button>
        <button onClick={this.toggleFastest}>fastest</button>
        {JSON.stringify(places)}
        {this.renderDeals(deals)}
      </div>
    );
  }
}
