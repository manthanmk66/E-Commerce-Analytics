const axios = require("axios");
const Transaction = require("../models/Transaction");

const getinitDatabase = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;

    // Clear existing data
    await Transaction.deleteMany({});
    // Insert new data
    await Transaction.insertMany(transactions);

    res.status(200).json({ message: "Database initialized with seed data." });
  } catch (error) {
    res.status(500).json({ message: "Error initializing database", error });
  }
};

// Get transaction data by month
const getList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = !isNaN(parseInt(req.query.limit))
      ? parseInt(req.query.limit)
      : 10;
    const skip = page * limit;
    const search = req.query.search || "";
    const month = !isNaN(parseInt(req.query.month))
      ? parseInt(req.query.month)
      : 3;

    const searchConfig = {
      $and: [
        month == 0
          ? {}
          : {
              $expr: {
                $eq: [{ $month: "$dateOfSale" }, month],
              },
            },
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { price: { $regex: search, $options: "i" } },
          ],
        },
      ],
    };

    const data = await Transaction.find(searchConfig).skip(skip).limit(limit);
    const totalCount = await Transaction.countDocuments(searchConfig);

    const responseData = {
      success: true,
      totalCount,
      page: page + 1,
      limit,
      month,
      transactions: data,
    };
    res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Get statistics for transactions by month
const getStatistics = async (req, res) => {
  try {
    const month = !isNaN(parseInt(req.query.month))
      ? parseInt(req.query.month)
      : 3;
    const monthQuery =
      month == 0
        ? {}
        : {
            $expr: {
              $eq: [{ $month: "$dateOfSale" }, month],
            },
          };

    const data = await Transaction.find(monthQuery);

    const response = data.reduce(
      (acc, curr) => {
        const currPrice = parseFloat(curr.price);

        acc.totalSale += curr.sold ? currPrice : 0;
        acc.soldCount += curr.sold ? 1 : 0;
        acc.unsoldCount += curr.sold ? 0 : 1;

        return acc;
      },
      { totalCount: data.length, totalSale: 0, soldCount: 0, unsoldCount: 0 }
    );

    response.totalSale = response.totalSale.toFixed(2);

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Get data for bar chart by month
const getBarChart = async (req, res) => {
  try {
    const month = !isNaN(parseInt(req.query.month))
      ? parseInt(req.query.month)
      : 3;
    const monthQuery =
      month == 0
        ? {}
        : {
            $expr: {
              $eq: [{ $month: "$dateOfSale" }, month],
            },
          };

    const data = await Transaction.find(monthQuery);

    let accumulator = {};

    for (let i = 1; i <= 10; i++) {
      let range = i * 100;

      if (i == 10) range = "901-above";
      else if (i == 1) range = "0-100";
      else range = `${range - 100 + 1}-${range}`;

      accumulator[range] = 0;
    }

    const response = data.reduce((acc, curr) => {
      const currPrice = parseFloat(curr.price);

      let priceRange = Math.ceil(currPrice / 100) * 100;

      if (priceRange == 100) priceRange = "0-100";
      else if (priceRange > 900) priceRange = "901-above";
      else priceRange = `${priceRange - 100 + 1}-${priceRange}`;

      acc[priceRange]++;

      return acc;
    }, accumulator);

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Get data for pie chart by month
const getPieChart = async (req, res) => {
  try {
    const month = !isNaN(parseInt(req.query.month))
      ? parseInt(req.query.month)
      : 3;
    const monthQuery =
      month == 0
        ? {}
        : {
            $expr: {
              $eq: [{ $month: "$dateOfSale" }, month],
            },
          };

    const data = await Transaction.find(monthQuery);

    const response = data.reduce((acc, curr) => {
      acc[curr.category] ? acc[curr.category]++ : (acc[curr.category] = 1);

      return acc;
    }, {});

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Get combined data from statistics, bar chart, and pie chart APIs
const getCombinedData = async (req, res) => {
  try {
    const month = req.query.month || 0; // default to 0 (all months) if month is not provided

    const [statsData, barChartData, pieChartData] = await Promise.all([
      getStatisticsData(month),
      getBarChartData(month),
      getPieChartData(month),
    ]);

    const response = {
      statsData,
      barChartData,
      pieChartData,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getStatisticsData = async (month) => {
  const monthQuery =
    month == 0
      ? {}
      : {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        };

  const data = await Transaction.find(monthQuery);

  const response = data.reduce(
    (acc, curr) => {
      const currPrice = parseFloat(curr.price);

      acc.totalSale += curr.sold ? currPrice : 0;
      acc.soldCount += curr.sold ? 1 : 0;
      acc.unsoldCount += curr.sold ? 0 : 1;

      return acc;
    },
    { totalCount: data.length, totalSale: 0, soldCount: 0, unsoldCount: 0 }
  );

  response.totalSale = response.totalSale.toFixed(2);

  return response;
};

const getBarChartData = async (month) => {
  const monthQuery =
    month == 0
      ? {}
      : {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        };

  const data = await Transaction.find(monthQuery);

  let accumulator = {};

  for (let i = 1; i <= 10; i++) {
    let range = i * 100;

    if (i == 10) range = "901-above";
    else if (i == 1) range = "0-100";
    else range = `${range - 100 + 1}-${range}`;

    accumulator[range] = 0;
  }

  const response = data.reduce((acc, curr) => {
    const currPrice = parseFloat(curr.price);

    let priceRange = Math.ceil(currPrice / 100) * 100;

    if (priceRange == 100) priceRange = "0-100";
    else if (priceRange > 900) priceRange = "901-above";
    else priceRange = `${priceRange - 100 + 1}-${priceRange}`;

    acc[priceRange]++;

    return acc;
  }, accumulator);

  return response;
};

const getPieChartData = async (month) => {
  const monthQuery =
    month == 0
      ? {}
      : {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        };

  const data = await Transaction.find(monthQuery);

  const response = data.reduce((acc, curr) => {
    acc[curr.category] ? acc[curr.category]++ : (acc[curr.category] = 1);

    return acc;
  }, {});

  return response;
};

module.exports = {
  getList,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
  getinitDatabase,
};
