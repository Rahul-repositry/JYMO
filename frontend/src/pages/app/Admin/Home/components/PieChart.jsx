import React from "react";
import { Pie } from "react-chartjs-2"; // Import the Pie chart instead of Doughnut
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./pie.css";

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

// PieChart Component
const PieChart = ({ pieDataArr }) => {
  // Data for the pie chart
  console.log(pieDataArr);
  const data = {
    labels: ["Male", "Female", "Others"], // Labels for each segment
    datasets: [
      {
        label: "Gender Distribution",
        // data: [50, 40, 10], // Data for each segment
        data: pieDataArr,
        backgroundColor: [
          "rgba(255, 201, 111, 0.5)",
          "rgba(255, 138, 99, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderColor: [
          "rgba(255, 201, 111, 1)",
          "rgba(255, 138, 99, 0.8)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 2, // Border width for all segments
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Disable maintainAspectRatio to set a custom height
    plugins: {
      legend: {
        display: false, // Show legend to describe each segment
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw;
            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${percentage}%`; // Show percentage in tooltip
          },
        },
      },
    },
  };

  return (
    <div className="pieChart bg-slate-50 border border-black rounded-xl pb-10 my-5">
      <h2 className="text-center text-2xl font-semibold  py-6">
        Gender Distribution
      </h2>
      <div className="flex items-center justify-between  px-3">
        <div className="pie flex flex-col  w-1/2  h-52">
          <div className="w-full h-full">
            <Pie data={data} options={options} />{" "}
          </div>
          <div className="label  min-w-[200px] flex flex-wrap gap-x-5  place-content-center  ">
            {/* Apply the style attribute to the parent div */}
            <div
              className="labelBox relative"
              style={{
                "--bgColor": "rgba(255, 201, 111, 0.5)", // Declare the custom property for background color
                "--borderColor": "rgba(255, 201, 111, 1)", // Declare the custom property for border color
              }}
            >
              Men
            </div>
            <div
              className="labelBox relative"
              style={{
                "--bgColor": "rgba(255, 138, 99, 0.5)", // Declare the custom property for background color
                "--borderColor": "rgba(255, 138, 99, 1)", // Declare the custom property for border color
              }}
            >
              Women
            </div>

            <div
              className="labelBox relative"
              style={{
                "--bgColor": "rgba(75, 192, 192, 0.5)", // Different colors for different labels
                "--borderColor": "rgba(75, 192, 192, 1)",
              }}
            >
              Others
            </div>
          </div>
        </div>

        <div className="w-1/2  self-center">
          <div className=" ChartDetails relative flex flex-col  translate-x-12  gap-3">
            <div className="men text-stone-400">
              MEN : &nbsp;&nbsp;
              <span className="text-[18px]  text-darkBlack">
                {pieDataArr[0]}
              </span>
            </div>
            <div className="women text-stone-400">
              WOMEN :&nbsp;
              <span className="text-[18px]  text-darkBlack">
                {pieDataArr[1]}
              </span>
            </div>
            <div className="others text-stone-400">
              OTHERS :&nbsp;
              <span className="text-[18px]  text-darkBlack">
                {pieDataArr[2]}
              </span>
            </div>
            <div className="Total text-stone-400 pl-1">
              <span className="text-2xl font-semibold text-darkBlack">
                {pieDataArr
                  .reduce((acc, count) => acc + count, 0)
                  .toString()
                  .padStart(4, "0")}
              </span>
              &nbsp; Total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
