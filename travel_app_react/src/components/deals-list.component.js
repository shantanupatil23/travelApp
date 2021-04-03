import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";

export default class TutorialsList extends Component {
  constructor(props) {
    super(props);
    this.retrieveTutorials = this.retrieveTutorials.bind(this);

    this.state = {
      tutorials: [],
    };
  }

  componentDidMount() {
    this.retrieveTutorials();
  }
  retrieveTutorials() {
    TutorialDataService.getDeals("London", "Amsterdam")
      .then((response) => {
        this.setState({
          tutorials: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { tutorials } = this.state;

    return <div>{JSON.stringify(tutorials)}</div>;
  }
}
