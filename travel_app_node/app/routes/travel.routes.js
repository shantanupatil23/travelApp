module.exports = (app) => {
  const travel = require("../controllers/travel.controller.js");

  var router = require("express").Router();

  router.get(
    "/find-route/source=:source&destination=:destination",
    travel.findDeals
  );

  router.get(["/places/from=", "/places/from=:from"], travel.places);

  app.use("/api/travel", router);
};
