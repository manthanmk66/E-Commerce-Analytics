const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.get("/getinitdatabase", transactionController.getinitDatabase);
router.get("/list", transactionController.getList);
router.get("/statistics", transactionController.getStatistics);
router.get("/bar-chart", transactionController.getBarChart);
router.get("/pie-chart", transactionController.getPieChart);
router.get("/combined-data", transactionController.getCombinedData);

module.exports = router;
