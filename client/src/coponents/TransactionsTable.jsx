import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(3); // Default to March
  const [page, setPage] = useState(1); // Page number state

  const months = [
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
  ];

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, searchText, page]); // Fetch data when month, search text, or page changes

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/transactions/list?month=${selectedMonth}&page=${page}&perPage=10&search=${searchText}`
      );
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setPage(1); // Reset to first page on month change
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handlePreviousClick = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <h2>Transactions Table</h2>
      <div>
        <label>
          Select Month:
          <select value={selectedMonth} onChange={handleMonthChange}>
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search Transactions"
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
      {loading ? (
        <p>Loading...</p> // Show loading indicator while fetching data
      ) : error ? (
        <p>Error: {error}</p> // Show error message if there is an error
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction._id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? "Yes" : "No"}</td>
                <td>
                  {transaction.image ? (
                    <img
                      src={transaction.image}
                      alt={transaction.title}
                      width="50"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <button onClick={handlePreviousClick} disabled={page === 1}>
          Previous
        </button>
        <button onClick={handleNextClick}>Next</button>
      </div>
    </div>
  );
};

export default TransactionsTable;
