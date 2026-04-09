const express = require("express");
const { importDataHandler } = require("../controllers/dataController");

const router = express.Router();

router.post("/data/import", importDataHandler);

module.exports = { router };
