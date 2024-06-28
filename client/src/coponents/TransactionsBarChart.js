import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const TransactionsBarChart = ({ month }) => {
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    fetchBarChartData();
  }, [month]);

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`/api/transactions/bar-chart?month=${month}`);
      setBarChartData(response.data);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  // Format data for Chart.js
  const chartData = {
    labels: barChartData.map(item => item.range),
    datasets: [
      {
        label: 'Number of Items',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: barChartData.map(item => item.count)
      }
    ]
  };

  return (
    <div className="chart-container">
      <h2>Transactions Bar Chart</h2>
      <Bar
        data={chartData}
        options={{
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }}
      />
    </div>
  );
};

export default TransactionsBarChart;
