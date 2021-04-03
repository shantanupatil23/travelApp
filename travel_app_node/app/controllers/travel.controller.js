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
            deals[i].departure === source &&
            deals[i].arrival === destination
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
exports.places = (req, res) => {
  let from = req.params.from;
  if (from == null) {
    from = "";
  }
  console.log(from);
  Datasets.find()
    .then((data) => {
      let responseData = [];
      const deals = data[0].toObject().deals;
      for (const i in deals) {
        if (
          deals[i].departure.substring(0, from.length) == from &&
          !responseData.includes(deals[i].departure)
        ) {
          responseData.push(deals[i].departure);
        }
        if (
          deals[i].arrival.substring(0, from.length) == from &&
          !responseData.includes(deals[i].arrival)
        ) {
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
