const express = require("express");
const { router: kpiRoutes } = require("./kpiRoutes");
const { router: insightRoutes } = require("./insightRoutes");
const { router: dataRoutes } = require("./dataRoutes");

const router = express.Router();

router.use(kpiRoutes);
router.use(insightRoutes);
router.use(dataRoutes);

module.exports = { router };
