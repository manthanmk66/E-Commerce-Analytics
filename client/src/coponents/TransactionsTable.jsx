import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { TablePagination } from "@mui/material";

const TransactionsTable = ({ month }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); // Material-UI pagination starts from 0
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [month, search, page]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/transactions/list",
        {
          params: { month, search, page: page + 1, limit: 10 }, // Adjusting page number for API pagination (1-based)
        }
      );
      setTransactions(response.data.transactions);
      setTotalCount(response.data.totalCount);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Reset page number when search changes
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <h1 className="text-2xl font-bold p-4 bg-gray-200 border-b">
        Transactions
      </h1>
      <div className="p-4">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={handleSearchChange}
          className="border p-2 rounded w-full"
        />
      </div>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">#</th>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Price</th>
                  <th className="py-2 px-4 border-b">Description</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Sold</th>
                  <th className="py-2 px-4 border-b">Date of Sale</th>
                  <th className="py-2 px-4 border-b">Image</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">
                      {page * 10 + index + 1}
                    </td>
                    <td className="py-2 px-4 border-b">{transaction.title}</td>
                    <td className="py-2 px-4 border-b">
                      {parseFloat(transaction.price).toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transaction.description}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transaction.category}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transaction.sold ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {moment(transaction.dateOfSale).format("DD MMM YYYY")}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <img
                        src={transaction.image}
                        alt={transaction.title}
                        className="h-14 w-12 object-cover rounded-full"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center px-4 py-2">
            <TablePagination
              rowsPerPageOptions={[]} // Hiding rows per page options
              component="div"
              count={totalCount}
              rowsPerPage={10}
              page={page}
              onPageChange={handlePageChange}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} of ${count}`
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsTable;
