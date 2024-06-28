const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://mk:0EH3ndNYFN3IiVJT@cluster0.uzsuqq8.mongodb.net/mern-task",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/transactions", transactionRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
