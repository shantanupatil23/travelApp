import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import DealsList from "./components/deals-list.component";

class App extends Component {
  render() {
    return (
      <div>
        <div className="container mt-3">
          <Switch>
            <Route exact path={["/"]} component={DealsList} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
