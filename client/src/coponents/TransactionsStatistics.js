import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsStatistics = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalSale: 0,
    soldItems: 0,
    notSoldItems: 0
  });

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`/api/transactions/statistics?month=${month}`);
      setStatistics({
        totalSale: response.data.totalSale,
        soldItems: response.data.soldItems,
        notSoldItems: response.data.notSoldItems
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <div>
      <h2>Transactions Statistics</h2>
      <p>Total Sale Amount: {statistics.totalSale}</p>
      <p>Total Sold Items: {statistics.soldItems}</p>
      <p>Total Not Sold Items: {statistics.notSoldItems}</p>
    </div>
  );
};

export default TransactionsStatistics;
