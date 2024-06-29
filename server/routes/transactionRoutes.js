const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.get("/initialize", transactionController.initializeDatabase);
// router.get("/list", transactionController.getTransactions);
router.get("/statistics", transactionController.getStatistics);
router.get("/barchart", transactionController.getBarChart);
router.get("/piechart", transactionController.getPieChart);
router.get("/combined", transactionController.getCombinedData);

module.exports = router;

router.get('/list', async (req, res) => {
    const { month, page, perPage, search } = req.query;
  
    // Validate month parameter
    const monthNumber = parseInt(month);
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({ error: 'Invalid month parameter' });
    }
  
    // Construct date range for the given month
    const startDate = new Date(Date.UTC(new Date().getFullYear(), monthNumber - 1, 1));
    const endDate = new Date(Date.UTC(new Date().getFullYear(), monthNumber, 1));
  
    console.log(`Start Date: ${startDate}, End Date: ${endDate}`);
  
    // Construct the query
    let query = {
      dateOfSale: {
        $gte: startDate,
        $lt: endDate
      }
    };
  
    // Add search criteria if provided
    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { price: { $regex: search, $options: 'i' } }
        ]
      };
    }
  
    try {
      const transactions = await Transaction.find(query)
        .skip((parseInt(page) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
  
      res.status(200).json({ transactions });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  module.exports = router;
