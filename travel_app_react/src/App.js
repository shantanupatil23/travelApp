import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Home from "./components/home";

class App extends Component {
  render() {
    return (
      <div>
        <div className="container mt-3">
          <Switch>
            <Route exact path={["/"]} component={Home} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
