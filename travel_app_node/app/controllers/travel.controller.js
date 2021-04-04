const db = require("../models");
const Datasets = db.datasets;

exports.findDeals = (req, res) => {
  const source = req.params.source;
  const destination = req.params.destination;
  var responseData = [];
  Datasets.find()
    .then((data) => {
      const deals = data[0].toObject().deals;
      try {
        for (const i in deals) {
          if (
            deals[i].departure.toUpperCase() === source.toUpperCase() &&
            deals[i].arrival.toUpperCase() === destination.toUpperCase()
          ) {
            responseData.push(deals[i]);
          }
        }
      } catch (error) {
        console.log(error);
      }
      res.send(responseData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
exports.findPlaces = (req, res) => {
  Datasets.find()
    .then((data) => {
      let responseData = [];
      const deals = data[0].toObject().deals;
      for (const i in deals) {
        if (!responseData.includes(deals[i].departure)) {
          responseData.push(deals[i].departure);
        }
        if (!responseData.includes(deals[i].arrival)) {
          responseData.push(deals[i].arrival);
        }
      }
      res.send(responseData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
