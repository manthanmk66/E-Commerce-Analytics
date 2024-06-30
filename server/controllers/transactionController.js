const axios = require('axios');
const Transaction = require('../models/Transaction');


// Initialize database with seed data
exports.initDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        // Clear existing data
        await Transaction.deleteMany({});
        // Insert new data
        await Transaction.insertMany(transactions);

        res.status(200).json({ message: 'Database initialized with seed data.' });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing database', error });
    }
};

// List all transactions with search and pagination
exports.listTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;
    const query = {
        dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') },
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } }
        ]
    };

    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        const total = await Transaction.countDocuments(query);

        res.status(200).json({ transactions, total, page: parseInt(page), perPage: parseInt(perPage) });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};

// Get statistics for a selected month
exports.getStatistics = async (req, res) => {
    const { month } = req.query;
    const query = { dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') } };

    try {
        const totalSales = await Transaction.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: '$price' }, count: { $sum: 1 }, soldCount: { $sum: { $cond: ['$sold', 1, 0] } } } }
        ]);

        const notSoldCount = totalSales[0].count - totalSales[0].soldCount;

        res.status(200).json({ totalSales: totalSales[0].total, soldCount: totalSales[0].soldCount, notSoldCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error });
    }
};

// Get bar chart data for a selected month
exports.getBarChart = async (req, res) => {
    const { month } = req.query;
    const query = { dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') } };

    try {
        const priceRanges = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];
        const barData = await Promise.all(priceRanges.map(async (range, index) => {
            const nextRange = priceRanges[index + 1] || Infinity;
            const count = await Transaction.countDocuments({ ...query, price: { $gte: range, $lt: nextRange } });
            return { range: `${range}-${nextRange === Infinity ? 'above' : nextRange}`, count };
        }));

        res.status(200).json(barData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bar chart data', error });
    }
};

// Get pie chart data for a selected month
exports.getPieChart = async (req, res) => {
    const { month } = req.query;
    const query = { dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') } };

    try {
        const pieData = await Transaction.aggregate([
            { $match: query },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.status(200).json(pieData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pie chart data', error });
    }
};

// Combine data from all APIs
exports.getCombinedData = async (req, res) => {
    try {
        const transactions = await exports.listTransactions(req, res);
        const statistics = await exports.getStatistics(req, res);
        const barChart = await exports.getBarChart(req, res);
        const pieChart = await exports.getPieChart(req, res);

        res.status(200).json({
            transactions: transactions.transactions,
            statistics,
            barChart,
            pieChart
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching combined data', error });
    }
};
