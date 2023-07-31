import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

// Define the plugin
const addButtonPlugin = {
  id: 'addButton',
  beforeDraw: (chart) => {
    const { ctx, canvas } = chart;
    const button = document.createElement('button');
    button.innerText = 'Click me!';
    button.onclick = () => alert('Button clicked!');
    canvas.parentNode.appendChild(button);
    const { left, top, width, height } = chart.chartArea;
    button.style.position = 'absolute';
    button.style.left = `${width - left}px`;
    button.style.top = `${height - top + 30}px`; // adjust this value to change the button's position
  }
};

export const IconLabelBarChart = () => {
  const chartContainerRef = useRef(null);
  useEffect(() => {
    const labels = ['Red Vans', 'Blue Vans', 'Green Vans', 'Gray Vans'];
    const images = ['https://i.stack.imgur.com/2RAv2.png', 'https://i.stack.imgur.com/Tq5DA.png', 'https://i.stack.imgur.com/3KRtW.png', 'https://i.stack.imgur.com/iLyVi.png']
      .map(png => {
        const image = new Image();
        image.src = png;
        return image;
      });
    const values = [40, 56, 33, 44];
    const imageItems = {
      id: 'imageItems',
      beforeDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, data, options, scales: { x, y } } = chart;
        ctx.save();
        const imageSize = options.layout.padding.bottom;

        data.datasets[0].image.forEach((imageLink, index) => {
          const logo = new Image();
          logo.src = imageLink.src;
          ctx.drawImage(logo, x.getPixelForValue(index) - imageSize / 2, chart.height - 50, imageSize, imageSize);
        });
        // data.datasets.forEach((imageLink, index) => {
        //   const logo = new Image();
        //   logo.src = imageLink.image.src;
        //   ctx.drawImage(logo, x.getPixelForValue(index) - imageSize / 2, chart.height - 50, imageSize, imageSize);
        // });
      },
    }

    const data = {
      labels: labels,
      datasets: [{
        // label: '# of Votes',
        data: values,
        backgroundColor: ['red', 'blue', 'green', 'lightgray'],
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
        hoverBorderWidth: 1,
        image: images,
      }]
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
      type: 'bar',
      data: data,
      options: {
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
          }
        },
        scales: {
          x: {
            border: {
              dash: [],
              color: '#E1E4E9',
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
              tickLength: 0
            },
          }
        },
        indexAxis: 'x',
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

  return <canvas ref={chartContainerRef} />;
};
