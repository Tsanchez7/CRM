const express = require("express");
const { getKpisHandler } = require("../controllers/kpiController");

const router = express.Router();

router.get("/kpis", getKpisHandler);

module.exports = { router };
