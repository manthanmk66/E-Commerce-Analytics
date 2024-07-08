import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Typography, CircularProgress, Box } from "@mui/material";

const BarChart = ({ selectedMonth }) => {
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarChartData = async () => {
      setLoading(true);
      setError(null); 
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/transactions/bar-chart?month=${selectedMonth}`
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
      title: {
        display: true,
        text: "Number of Products per Price Range",
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
    aspectRatio: 0.8,
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
    <Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box className="mt-16">
          <Typography variant="h3" className="mb-4 text-center">
            Bar Chart for Month {selectedMonth}
          </Typography>
          <Bar data={chartData} options={options} />
        </Box>
      )}
    </Box>
  );
};

export default BarChart;
