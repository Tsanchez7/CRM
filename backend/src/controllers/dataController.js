const { importData } = require("../services/dataImportService");

async function importDataHandler(req, res, next) {
  try {
    const result = await importData(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { importDataHandler };
