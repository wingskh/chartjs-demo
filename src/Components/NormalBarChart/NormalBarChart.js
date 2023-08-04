import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import detailImage from "../../assets/images/MagnifyingGlassPlus.png";
import style from "./NormalBarChart.module.css";

// Define the plugin

export const NormalBarChart = () => {
  const chartContainerRef = useRef(null);
  const [isBarChart, setIsBarChart] = useState(true);

  useEffect(() => {
    const labels = [
      ["1", "周"],
      ["2", "周"],
      ["3", "周"],
      ["4", "周"],
      ["5", "周"],
      ["6", "周"],
      ["7", "周"],
      ["8", "周"],
      ["9", "周"],
      ["10", "周"],
      ["11", "周"],
      ["12", "周"],
      ["13", "周"],
    ];
    const values = [
      100000, 27000, 28000, -10000, 15500, 20000, -20500, 40000, 100000, 27000,
      28000, 10000, 15500,
    ];
    const mainColor = "#53B1FD";
    const minorColor = '#F97066'
    const backgroundColor = []
    for (let value of values) {
      backgroundColor.push(value > 0 ? mainColor : minorColor);
    }
    const data = {
      labels: labels,
      datasets: [
        isBarChart ?
          {
            data: values,
            backgroundColor: backgroundColor,
            borderRadius: 50,
            borderSkipped: false,
            // barPercentage: 0.5,
            categoryPercentage: 0.5,
            hoverBorderWidth: 2,
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 1)',
          } : {
            data: values,
            backgroundColor: mainColor,
            borderRadius: 50,
            borderSkipped: false,
            borderWidth: 1,
            hoverBorderWidth: 1,
            borderColor: mainColor,
          },
      ],
    };

    const chartConfig = {
      type: isBarChart ? "bar" : "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              title: function (context) {
                return context[0].label.replace(',', '');
              }
            }
          },
          title: {
            display: false,
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            border: {
              dash: [],
              color: "#E1E4E9",
              width: 1,
            },
            grid: {
              display: false,
            },
            ticks: {
              color: mainColor,
            },
          },
          y: {
            border: {
              dash: [5, 5],
              display: false,
            },
            grid: {
              // color: (ctx) => {
              //   const lastTickIndex = ctx.chart.scales.x.ticks.length - 1;
              //   if (ctx.index !== lastTickIndex) {
              //     return '#E4E7EC'
              //   }
              // },
              tickLength: 0,
            },
          },
        },
        datasets: {
          line: {
            pointRadius: 0,
            pointHoverRadius: 1
          }
        },
        indexAxis: "x",
      },
    };
    const chart = new Chart(chartContainerRef.current, chartConfig);

    return () => {
      chart.destroy();
    };
  }, [isBarChart]);

  return (
    <div>
      <div className={style['container']}>
        <canvas ref={chartContainerRef} className={style['canvasContainer']} />
        {/* <img className={style['detailLogo]} alt="details" src={detailImage} /> */}
      </div>
      <button onClick={() => {
        setIsBarChart(!isBarChart);
      }}>{isBarChart ? 'Line Chart' : 'Bar Chart'}</button>
    </div>
  );
};
