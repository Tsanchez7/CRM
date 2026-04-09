const { getKpis } = require("../services/kpiService");

async function getKpisHandler(req, res, next) {
  try {
    const kpis = await getKpis();
    res.json(kpis);
  } catch (err) {
    next(err);
  }
}

module.exports = { getKpisHandler };
