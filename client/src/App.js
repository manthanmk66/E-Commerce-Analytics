import React, { useState } from "react";
import {
  Container,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import TransactionsTable from "./coponents/dashboard/TransactionsTable";
import StatisticsComponent from "./coponents/dashboard/Statistics";
import TransactionsBarChart from "./coponents/dashboard/TransactionsBarChart";

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(5); // Default month is May (index 5)

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const monthText = [
    "All Months",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][selectedMonth];

  return (
    <Container maxWidth="xl" className="p-4 ">
      <div className="mb-4 z-20">
        <FormControl fullWidth>
          <InputLabel id="monthSelectLabel">Select Month</InputLabel>
          <Select
            labelId="monthSelectLabel"
            id="monthSelect"
            value={selectedMonth}
            onChange={handleMonthChange}
            label="Select Month"
            className="overflow-visible"
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
      </div>
      <TransactionsTable month={selectedMonth} />
      <div className="flex flex-col md:flex-row">
        <TransactionsBarChart selectedMonth={selectedMonth} />
        <StatisticsComponent selectedMonth={selectedMonth} />
      </div>
    </Container>
  );
};

export default App;
