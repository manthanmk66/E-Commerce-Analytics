import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, CircularProgress } from "@material-ui/core";
import { Doughnut } from "react-chartjs-2";

const StatisticsComponent = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const statsResponse = await axios.get(
          `http://localhost:5000/api/transactions/statistics?month=${selectedMonth}`
        );
        setStatistics(statsResponse.data);

        const pieResponse = await axios.get(
          `http://localhost:5000/api/transactions/pie-chart?month=${selectedMonth}`
        );
        const pieData = pieResponse.data;
        const chartData = {
          labels: Object.keys(pieData),
          datasets: [
            {
              data: Object.values(pieData),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FF6384",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FF6384",
              ],
            },
          ],
        };
        setPieChartData(chartData);

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedMonth]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center ml-40 gap-1">
      <div className="md:w-1/2">
        <Typography variant="h3" className="mb-4 text-center">
          Statistics for month {selectedMonth}
        </Typography>
        <div className="flex flex-col items-center">
          <div className="border rounded-md p-4 mb-4">
            <Typography className="mb-2">
              <span className="font-bold">Total Count:</span>{" "}
              {statistics.totalCount}
            </Typography>
            <Typography className="mb-2">
              <span className="font-bold">Total Sale:</span> ₹{" "}
              {statistics.totalSale}
            </Typography>
            <Typography className="mb-2">
              <span className="font-bold">Sold Count:</span>{" "}
              {statistics.soldCount}
            </Typography>
            <Typography className="mb-2">
              <span className="font-bold">Unsold Count:</span>{" "}
              {statistics.unsoldCount}
            </Typography>
          </div>
        </div>
      </div>
      {pieChartData && (
        <div className="md:w-1/2">
          <Typography variant="h4" className="mb-2 text-center">
            Category Distribution
          </Typography>
          <Doughnut data={pieChartData} />
        </div>
      )}
    </div>
  );
};

export default StatisticsComponent;
