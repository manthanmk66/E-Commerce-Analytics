import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const TransactionsBarChart = ({ month }) => {
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    fetchBarChartData();
  }, [month]);

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(
        `/api/transactions/bar-chart?month=${month}`
      );
      setBarChartData(response.data);
      setLoading(false); // Set loading to false after data fetch
      setError(null); // Clear error state on successful fetch
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
      setLoading(false); // Set loading to false on error
      setError("Error fetching data. Please try again."); // Set error message
    }
  };

  // Format data for Chart.js
  const chartData = {
    labels: barChartData.map((item) => item.range),
    datasets: [
      {
        label: "Number of Items",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: barChartData.map((item) => item.count),
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2>Transactions Bar Chart</h2>
      {loading ? (
        <p>Loading...</p> // Show loading indicator while fetching data
      ) : error ? (
        <p>{error}</p> // Show error message if fetch failed
      ) : barChartData.length > 0 ? (
        <Bar
          data={chartData}
          options={{
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default TransactionsBarChart;
