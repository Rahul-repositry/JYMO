import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register ChartDataLabels plugin
);
const BarComp = ({ dataArr }) => {
  // Data for the bar chart
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Weekly Data",
        // data: [5, 25, 48, 38, 16, 45, 94],
        data: dataArr,
        backgroundColor: "rgba(255, 138, 99, 0.5)", // Lighter version of #FF8A63 with some transparency
        borderColor: "rgba(255, 138, 99, .8)", // Darker solid color of #FF8A63
        borderWidth: 1,
        barThickness: 30,
        borderRadius: 5,
      },
    ],
  };

  // Chart options including datalabels
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          padding: 0,
          stepSize: 20,
        },
        grid: {
          drawBorder: false,
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end", // Label position at the end of the bar
        align: "end", // Align the label on top of the bar
        color: "black", // Set label color
        font: {
          size: 12, // Set label font size
        },
        formatter: function (value) {
          // Ensure the label displays the correct value
          return value;
        },
      },
    },
  };

  // const options = {
  //   responsive: true,
  //   indexAxis: "y", // This makes the bars horizontal
  // };
  return (
    <div className="barChart">
      <div className="details py-2 flex flex-col gap-2 mb-5">
        <p className="text-slate-700"> Today's Check-ins</p>
        <p className="text-3xl font-bold ">25</p>
        <p className="text-slate-400 "> Past 7 days report </p>
      </div>
      <div className="bar h-[350px] md:h-[500px]">
        {/* Add Bar Chart component here */}
        <Bar data={data} options={options} className="" />
      </div>
    </div>
  );
};

export default BarComp;
