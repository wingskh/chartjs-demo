import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import './MultiAxesBarChart.css'
import { convertStringToPriceFormat, parseToDouble } from '../../Util/general';

const lineWidth = 3
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

export const MultiAxesBarChart = () => {
  const chartContainerRef = useRef(null);
  useEffect(() => {
    const time = ['2022/12/08 0:00', '2022/12/08 4:00', '2022/12/08 8:00', '2022/12/08 12:00', '2022/12/08 16:00', '2022/12/08 20:00', '2022/12/08 23:59'];
    const value = [[1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14], [14, 13, 12, 11, 10, 9, 8], [8, 7, 6, 5, 4, 3, 2], [7, 7, 8, 11, 2, 6, 9], [7, 7, 8, 11, 2, 6, 9], [7, 7, 8, 11, 2, 6, 9]];

    let hoverValue = undefined;
    const hoverSegment = {
      id: 'hoverSegment',
      beforeDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, canvas, data, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
        ctx.save();
        if (hoverValue !== undefined) {
          const segment = width / (x.max + 1);
          ctx.fillStyle = 'rgba(215, 242, 254, 0.5)';
          ctx.fillRect(x.getPixelForValue(hoverValue) - (segment / 2), top, segment, height);
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = '#2E8FF8';
          ctx.beginPath();
          ctx.moveTo(x.getPixelForValue(hoverValue) - (segment / 2), top)
          ctx.lineTo(x.getPixelForValue(hoverValue) - (segment / 2), bottom)
          ctx.moveTo(x.getPixelForValue(hoverValue) + (segment / 2) - lineWidth / 2, top)
          ctx.lineTo(x.getPixelForValue(hoverValue) + (segment / 2) - lineWidth / 2, bottom)
          ctx.stroke();
        }
      },
      afterDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, canvas, data, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
        ctx.save();
        if (hoverValue !== undefined) {
          const segmentLeft = width / (x.max - 1)
          const segmentRight = width / (x.max + 1);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(left - lineWidth, top, x.getPixelForValue(hoverValue) - (segmentLeft / 2), height);
          ctx.fillRect(x.getPixelForValue(hoverValue) + (segmentRight / 2), top, right, height);
        }
      },
      afterEvent(chart, args) {
        const { ctx, canvas, chartArea: { top, bottom, height }, scales: { x, y } } = chart;
        if (args.inChartArea) {
          hoverValue = x.getValueForPixel(args.event.x)
        } else {
          hoverValue = undefined
        };
        args.changed = true;
      }
    }

    const data = {
      labels: time,
      datasets: [{
        label: '體育',
        data: [1, 2, 3, 4, 5, 6, 7],
        backgroundColor: '#65C2FD',
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 3,
        borderRadius: 50,
        borderSkipped: false,
      }, {
        label: '真人荷官',
        data: [8, 9, 10, 11, 12, 13, 14],
        backgroundColor: '#F74E6F',
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 3,
        borderRadius: 50,
        borderSkipped: false,
      }, {
        label: '彩票',
        data: [14, 13, 12, 11, 10, 9, 8],
        backgroundColor: '#FFC16D',
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 3,
        borderRadius: 50,
        borderSkipped: false,
      }, {
        label: '棋牌',
        data: [8, 7, 6, 5, 4, 3, 2],
        backgroundColor: '#40D29D',
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 3,
        borderRadius: 50,
        borderSkipped: false,
      }, {
        label: '老虎機',
        data: [7, 7, 8, 11, 2, 6, 9],
        backgroundColor: '#5C48C9',
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 3,
        borderRadius: 50,
        borderSkipped: false,
      }, {
        label: '捕魚',
        data: [7, 7, 8, 11, 2, 6, 9],
        backgroundColor: '#3172FD',
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 3,
        borderRadius: 50,
        borderSkipped: false,
      }, {
        label: '賽馬',
        data: [7, 7, 8, 11, 2, 6, 9],
        backgroundColor: '#F59961',
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 3,
        borderRadius: 50,
        borderSkipped: false,
      }]
    }

    const getOrCreateTooltip = (chart) => {
      let tooltipContainer = chart.canvas.parentNode.querySelector('div');
      if (!tooltipContainer) {
        tooltipContainer = document.createElement('DIV');
        tooltipContainer.classList.add('tooltipContainer');

        const tooltipTitleContainer = document.createElement('DIV');
        tooltipTitleContainer.classList.add('tooltipTitleContainer');

        const tooltipTitleLeft = document.createElement('DIV');
        tooltipTitleLeft.classList.add('tooltipTitleLeft');
        tooltipTitleContainer.appendChild(tooltipTitleLeft);

        const tooltipTitleRight = document.createElement('DIV');
        tooltipTitleRight.classList.add('tooltipTitleRight');
        tooltipTitleContainer.appendChild(tooltipTitleRight);

        tooltipContainer.appendChild(tooltipTitleContainer);

        const tooltipBodyContainer = document.createElement('UL');
        tooltipBodyContainer.classList.add('tooltipBodyContainer');
        tooltipContainer.appendChild(tooltipBodyContainer);

        chart.canvas.parentNode.appendChild(tooltipContainer);
      }
      return tooltipContainer;
    }

    const externalTooltipHandler = (context) => {
      const { chart, tooltip } = context;

      const tooltipBox = getOrCreateTooltip(chart);

      if (tooltip.opacity === 0) {
        tooltipBox.style.opacity = 0;
        return;
      };

      // 4 tooltip text
      if (tooltip.body) {

        const tooltipTitleLeft = tooltipBox.querySelector('.tooltipTitleLeft');
        const tooltipTitleRight = tooltipBox.querySelector('.tooltipTitleRight');
        const tooltipBodyContainer = tooltipBox.querySelector('.tooltipBodyContainer');
        while (tooltipBodyContainer.firstChild) {
          tooltipBodyContainer.firstChild.remove();
        }

        const title = tooltip.title[0] || [];

        if (tooltipTitleLeft.firstChild) {
          tooltipTitleLeft.firstChild.remove();
        }
        if (tooltipTitleRight.firstChild) {
          tooltipTitleRight.firstChild.remove();
        }
        tooltipTitleLeft.appendChild(document.createTextNode(title.split(' ')[0]));
        tooltipTitleRight.appendChild(document.createTextNode(title.split(' ')[1]));

        const bodyLines = tooltip.body.map(b => b.lines);
        bodyLines.forEach((body, i) => {
          const tooltipLI = document.createElement('LI');
          const tooltipBody = document.createElement('div');
          tooltipBody.classList.add('tooltipBodyItem');
          const colors = tooltip.labelColors[i];
          const colorSquare = document.createElement('SPAN');
          colorSquare.classList.add('colorSquare');
          colorSquare.style.background = colors.backgroundColor;
          colorSquare.style.border = `solid ${colors.borderColor}`;

          const allText = body[0].split(': ');
          const leftBody = document.createElement('SPAN');
          leftBody.classList.add('tooltipLeftBody');
          leftBody.appendChild(colorSquare);
          leftBody.appendChild(document.createTextNode(allText[0]));
          tooltipBody.appendChild(leftBody);
          tooltipBody.appendChild(document.createTextNode(convertStringToPriceFormat(allText[1])));
          tooltipLI.appendChild(tooltipBody);
          tooltipBodyContainer.appendChild(tooltipLI);
        })


        tooltipBox.style.opacity = 1;

        // positioning of the tooltip.
        const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
        const { width, height } = chart.canvas.style;
        const { chartArea, scales: { x, y } } = chart;
        const segment = chartArea.width / (x.max + 1);


        const canvasWidth = parseToDouble(width.slice(0, -2));
        const canvasHeight = parseToDouble(height.slice(0, -2));

        const centerX = (positionX + canvasWidth) / 2;
        const centerY = (positionY + canvasHeight) / 2;
        const tooltipStartX = tooltip.caretX < centerX ? positionX + tooltip.caretX + segment / 2 + lineWidth / 2 : positionX + tooltip.caretX - tooltipBox.offsetWidth - segment / 2 - lineWidth;
        tooltipBox.style.left = Math.max(tooltipStartX, positionX) + 'px';
        tooltipBox.style.top = Math.max(centerY - tooltipBox.offsetHeight / 2, positionY) + 'px';
      };
    };

    const chartConfig = {
      type: 'bar',
      data: data,
      options: {
        plugins: {
          tooltip: {
            enabled: false,
            external: externalTooltipHandler,
            intersect: false,
          }
        },
        interaction: {
          mode: 'index',
        },
        scales: {
          x: {
            // offset: fal…se,
            border: {
              display: false
            },
            grid: {
              color: (ctx) => {
                // const lastTickIndex = ctx.chart.scales.x.ticks.length - 1;
                if (ctx.index !== 0) {
                  return 'rgba(102, 102, 102, 0.1)'
                }
              }
            },
            ticks: {
              callback: function (val, index) {

                return this.getLabelForValue(val).split(' ')[1];
              },
              // color: 'red',
            }
          },
          y: {
            beginAtZero: true,
            border: {
              dash: [5, 5],
              display: false,
            },
            grid: {
              tickLength: 0
            },
          },
        },
      },
      plugins: [hoverSegment],

    };

    // data.labels.unshift('');
    // data.labels.push('');
    // data.datasets.forEach((e) => e.data.unshift(null))
    // data.datasets.forEach((e) => e.data.push(null))
    const chart = new Chart(chartContainerRef.current, chartConfig);

    // Register the plugin
    // Chart.register(addButtonPlugin);

    // Return a cleanup function to destroy the chart and unregister the plugin
    return () => {
      chart.destroy();
      // Chart.unregister(addButtonPlugin);
    };
  }, []);

  return <canvas ref={chartContainerRef} />;
};
