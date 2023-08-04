import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import detailImage from "../../assets/images/MagnifyingGlassPlus.png";
import style from "./IconLabelBarChart.module.css";

// Define the plugin

export const IconLabelBarChart = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const labels = ["Red Vans", "Blue Vans", "Green Vans", "Gray Vans"];
    const images = [
      "https://i.stack.imgur.com/2RAv2.png",
      "https://i.stack.imgur.com/Tq5DA.png",
      "https://i.stack.imgur.com/3KRtW.png",
      "https://i.stack.imgur.com/iLyVi.png",
    ].map((png) => {
      const image = new Image();
      image.src = png;
      return image;
    });
    const values = [40, 56, -33, 44];

    const addButtonPlugin = {
      id: "addButton",
      afterDatasetsDraw: (chart) => {
        const { ctx, canvas } = chart;
        ctx.save();
        let detailButton = document.getElementById('detailButton');
        if (!detailButton) {
          detailButton = document.createElement("button");
          detailButton.src = detailImage;
          detailButton.innerText = "Click me!";
          detailButton.id = 'detailButton';
          detailButton.onclick = () => {
            console.log('-------------')
          };
          canvas.parentNode.appendChild(detailButton);
        }
        const { left, top, right, bottom, width, height } = chart.chartArea;
        detailButton.style.position = "absolute";
        detailButton.style.left = `${width}px`;
        detailButton.style.bottom = `${bottom}px`; // adjust this value to change the button's position
      },
    };

    const imageItems = {
      id: "imageItems",
      beforeDatasetsDraw(chart, args, pluginOptions) {
        const {
          ctx,
          data,
          options,
          scales: { x, y },
        } = chart;
        ctx.save();
        const imageSize = 24;

        data.datasets[0].image.forEach((imageLink, index) => {
          const logo = new Image();
          logo.src = imageLink.src;
          ctx.drawImage(
            logo,
            x.getPixelForValue(index) - imageSize / 2,
            chart.height - 50,
            imageSize,
            imageSize
          );
        });
        // data.datasets.forEach((imageLink, index) => {
        //   const logo = new Image();
        //   logo.src = imageLink.image.src;
        //   ctx.drawImage(logo, x.getPixelForValue(index) - imageSize / 2, chart.height - 50, imageSize, imageSize);
        // });
      },
    };

    const data = {
      labels: labels,
      datasets: [
        {
          // label: '# of Votes',
          data: values,
          backgroundColor: ["red", "blue", "green", "lightgray"],
          // borderColor: [
          //   'rgba(255, 99, 132, 1)',
          //   'rgba(54, 162, 235, 1)',
          //   'rgba(75, 192, 192, 1)',
          //   'rgba(255, 159, 64, 1)'
          // ],
          // borderWidth: 0,
          borderRadius: 50,
          borderSkipped: false,
          barPercentage: 0.1,
          categoryPercentage: 1,
          hoverBorderWidth: 2,
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 1)',
          image: images,
        },
      ],
      // datasets: [{
      //   data: [values[0]],
      //   backgroundColor: 'red',
      //   borderRadius: 20,
      //   barPercentage: 1,
      //   categoryPercentage: 1,
      //   image: images[0],
      // }, {
      //   data: [values[1]],
      //   backgroundColor: 'blue',
      //   borderRadius: 20,
      //   barPercentage: 1,
      //   categoryPercentage: 1,
      //   image: images[1],
      // }, {
      //   data: [values[2]],
      //   backgroundColor: 'green',
      //   borderRadius: 20,
      //   barPercentage: 1,
      //   categoryPercentage: 1,
      //   image: images[2],
      // }, {
      //   data: [values[3]],
      //   backgroundColor: 'lightgray',
      //   borderRadius: 20,
      //   barPercentage: 1,
      //   categoryPercentage: 1,
      //   image: images[3],
      // }]
    };

    const chartConfig = {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: false,
          },
        },
        layout: {
          padding: {
            bottom: 50,
          },
        },
        scales: {
          x: {
            border: {
              dash: [],
              color: "#E1E4E9",
              width: 2,
            },
            grid: {
              display: false,
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
        onResize: (chart) => {
          // const { ctx, canvas } = chart;
          let detailButton = document.getElementById('detailButton');
          if (!detailButton) {
            detailButton = document.createElement('img');
            const buttonText = document.createTextNode('R');
            detailButton.id = 'detailButton';
            detailButton.classList.add(style['detailLogo']);
            detailButton.src = detailImage;
            detailButton.style.position = 'relative';
            detailButton.style.zIndex = 1;
            detailButton.appendChild(buttonText);
            detailButton.onclick = () => { alert('clicked') };

            chart.canvas.parentNode.appendChild(detailButton);
          };
          detailButton.style.left = -10 + 'px';
          detailButton.style.top = (chart.height) - 90 + 'px';
        },
        indexAxis: "x",
      },
      plugins: [imageItems],
    };
    // data.labels.push('');
    // data.datasets[0].data.push(null);
    const chart = new Chart(chartContainerRef.current, chartConfig);

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className={style["container"]}>
      <canvas className={style['"canvasContainer"']} ref={chartContainerRef} />
    </div>
  );
};
