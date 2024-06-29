const express = require("express");
const mongoose = require("mongoose");
const transactionRoutes = require("./routes/transactionRoutes");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/your-database-name", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use routes
app.use("/api/transactions", transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
