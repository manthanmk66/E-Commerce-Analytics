const axios = require("axios");
const Transaction = require("../models/Transaction");

exports.initializeDatabase = async (req, res) => {
  try {
    console.log("Fetching data from third-party API...");
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch data from third-party API");
    }

    const transactions = response.data;

    console.log(`Fetched ${transactions.length} transactions.`);

    console.log("Deleting existing transactions...");
    await Transaction.deleteMany({});
    console.log("Existing transactions deleted.");

    console.log("Inserting new transactions...");
    await Transaction.insertMany(transactions);
    console.log("Transactions inserted successfully.");

    res.status(200).json({ message: "Database initialized" });
  } catch (error) {
    console.error("Error initializing database:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  const { month, page, perPage, search } = req.query;

  // Validate month parameter
  const monthNumber = parseInt(month);
  if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    return res.status(400).json({ error: "Invalid month parameter" });
  }

  // Construct date range for the given month
  const startDate = new Date(
    Date.UTC(new Date().getFullYear(), monthNumber - 1, 1)
  );
  const endDate = new Date(Date.UTC(new Date().getFullYear(), monthNumber, 1));

  console.log(`Start Date: ${startDate}, End Date: ${endDate}`);

  // Construct the query
  let query = {
    dateOfSale: {
      $gte: startDate,
      $lt: endDate,
    },
  };

  // Add search criteria if provided
  if (search) {
    query = {
      ...query,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { price: { $regex: search, $options: "i" } },
      ],
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
};

exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1, 2000}`).getMonth() + 1;

    const query = {
      $expr: {
        $regexMatch: {
          input: { $dateToString: { format: "%m", date: "$dateOfSale" } },
          regex: `^${monthNumber < 10 ? "0" : ""}${monthNumber}$`,
        },
      },
    };

    const totalSale = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, totalSale: { $sum: "$price" } } },
    ]);

    const soldItems = await Transaction.countDocuments({
      ...query,
      sold: true,
    });
    const notSoldItems = await Transaction.countDocuments({
      ...query,
      sold: false,
    });

    res.status(200).json({
      totalSale: totalSale[0] ? totalSale[0].totalSale : 0,
      soldItems,
      notSoldItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBarChart = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1, 2000}`).getMonth() + 1;

    const query = {
      $expr: {
        $regexMatch: {
          input: { $dateToString: { format: "%m", date: "$dateOfSale" } },
          regex: `^${monthNumber < 10 ? "0" : ""}${monthNumber}$`,
        },
      },
    };

    const ranges = [
      [0, 100],
      [101, 200],
      [201, 300],
      [301, 400],
      [401, 500],
      [501, 600],
      [601, 700],
      [701, 800],
      [801, 900],
      [901, Infinity],
    ];

    const results = await Promise.all(
      ranges.map((range) =>
        Transaction.countDocuments({
          ...query,
          price: { $gte: range[0], $lt: range[1] },
        })
      )
    );

    const barChartData = ranges.map((range, index) => ({
      range: `${range[0]}-${range[1] === Infinity ? "above" : range[1]}`,
      count: results[index],
    }));

    res.status(200).json(barChartData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPieChart = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1, 2000}`).getMonth() + 1;

    const query = {
      $expr: {
        $regexMatch: {
          input: { $dateToString: { format: "%m", date: "$dateOfSale" } },
          regex: `^${monthNumber < 10 ? "0" : ""}${monthNumber}$`,
        },
      },
    };

    const categories = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status500.json({ error: error.message });
  }
};

exports.getCombinedData = async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    const totalSale = await Transaction.aggregate([
      { $group: { _id: null, totalSale: { $sum: "$price" } } },
    ]);
    const soldItems = await Transaction.countDocuments({ sold: true });
    const notSoldItems = await Transaction.countDocuments({ sold: false });

    res.status(200).json({
      transactions,
      totalSale: totalSale[0] ? totalSale[0].totalSale : 0,
      soldItems,
      notSoldItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
