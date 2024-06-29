const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  sold: Boolean,
  image: String,
  dateOfSale: Date,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
