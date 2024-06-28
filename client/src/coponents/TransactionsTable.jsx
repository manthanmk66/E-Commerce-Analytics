import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionsTable = () => {
  const [month, setMonth] = useState(3); // Default to March (1-indexed month)
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    fetchTransactions();
  }, [month, searchText, page]); // Reload data when month, search text, or page changes

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `/api/transactions/list?month=${month}&page=${page}&perPage=${perPage}&search=${searchText}`
      );
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleFilterClick = () => {
    fetchTransactions(); // Re-fetch transactions on filter button click
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <h2>Transactions Table</h2>
      <label htmlFor="monthSelect">Select Month:</label>
      <select id="monthSelect" value={month} onChange={handleMonthChange}>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
      <input
        type="text"
        placeholder="Search Transactions"
        value={searchText}
        onChange={handleSearchChange}
      />
      <button onClick={handleFilterClick}>Apply Filter</button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handlePrevPage}>Previous</button>
      <button onClick={handleNextPage}>Next</button>
    </div>
  );
};

export default TransactionsTable;
  