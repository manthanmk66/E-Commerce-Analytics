import React, { useState } from "react";
import { Link, Route, Routes, BrowserRouter } from "react-router-dom";
import {
  Container,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import TransactionsTable from "./coponents/dashboard/TransactionsTable";
import StatisticsComponent from "./coponents/dashboard/Statistics";
import TransactionsBarChart from "./coponents/dashboard/TransactionsBarChart";
import Hero from "./coponents/home/Hero";

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(5); // Default month is May (index 5)

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Link
            to="/"
            style={{ color: "white", textDecoration: "none", flexGrow: 1 }}
          >
            <Typography variant="h6">Dashboard</Typography>
          </Link>
          <Link
            to="/"
            style={{
              marginRight: "20px",
              color: "white",
              textDecoration: "none",
            }}
          >
            Transactions
          </Link>
          <Link
            to="/stats"
            style={{
              marginRight: "20px",
              color: "white",
              textDecoration: "none",
            }}
          >
            Stats
          </Link>
          <FormControl
            variant="outlined"
            size="small"
            style={{ minWidth: 120 }}
          >
            <InputLabel id="monthSelectLabel" style={{ color: "white" }}>
              Select Month
            </InputLabel>
            <Select
              labelId="monthSelectLabel"
              id="monthSelect"
              value={selectedMonth}
              onChange={handleMonthChange}
              label="Select Month"
              style={{ color: "white" }}
            >
              <MenuItem value={0}>All Months</MenuItem>
              <MenuItem value={1}>January</MenuItem>
              <MenuItem value={2}>February</MenuItem>
              <MenuItem value={3}>March</MenuItem>
              <MenuItem value={4}>April</MenuItem>
              <MenuItem value={5}>May</MenuItem>
              <MenuItem value={6}>June</MenuItem>
              <MenuItem value={7}>July</MenuItem>
              <MenuItem value={8}>August</MenuItem>
              <MenuItem value={9}>September</MenuItem>
              <MenuItem value={10}>October</MenuItem>
              <MenuItem value={11}>November</MenuItem>
              <MenuItem value={12}>December</MenuItem>
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sx" className="">
        <Routes>
          {/* <Route path="/" element={<Hero />} /> */}
          <Route
            path="/"
            element={<TransactionsTable month={selectedMonth} />}
          />
          <Route
            path="/stats"
            element={
              <div className="flex flex-col md:flex-row">
                <TransactionsBarChart selectedMonth={selectedMonth} />
                <StatisticsComponent selectedMonth={selectedMonth} />
              </div>
            }
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
