import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS } from "chart.js/auto";

const BarChart = ({ selectedMonth }) => {
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarChartData = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        const response = await axios.get(
          `http://localhost:5000/api/transactions/bar-chart?month=${selectedMonth}`
        );
        setBarChartData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };

    fetchBarChartData();
  }, [selectedMonth]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Price Range",
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Product Count",
        },
        ticks: {
          stepSize: 4,
        },
      },
    },
    aspectRatio: 1.6,
    plugins: {
      title: {
        display: true,
        text: "Number of Products per Price Range",
      },
    },
  };

  const labels = Object.keys(barChartData);
  const values = Object.values(barChartData);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Number of products per price range",
        data: values,
        backgroundColor: ["rgba(0, 105, 100, 0.7)"],
      },
    ],
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          <h2>Bar Chart for Month {selectedMonth}</h2>
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default BarChart;
