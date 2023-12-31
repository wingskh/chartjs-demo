import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import style from "./MultiAxesBarChart.module.css";
import { convertStringToPriceFormat, parseToDouble, convertFloatToPriceFormat } from "../../Util/general";
import { set } from "react-hook-form";

const lineWidth = 3;
// Define the plugin
const addButtonPlugin = {
  id: "addButton",
  beforeDraw: (chart) => {
    const { ctx, canvas } = chart;
    const button = document.createElement("button");
    button.innerText = "Click me!";
    button.onclick = () => alert("Button clicked!");
    canvas.parentNode.appendChild(button);
    const { left, top, width, height } = chart.chartArea;
    button.style.position = "absolute";
    button.style.left = `${width - left}px`;
    button.style.top = `${height - top + 30}px`; // adjust this value to change the button's position
  },
};
const time = [
  "2022/12/08 0:00",
  "2022/12/08 4:00",
  "2022/12/08 8:00",
  "2022/12/08 12:00",
  "2022/12/08 16:00",
  "2022/12/08 20:00",
  "2022/12/08 23:59",
];
// const value = {
//   sport: [1, 2, 3, 4, 5, 6, 7],
//   liveDealer: [8, 9, 10, 11, 12, 13, 14],
//   lottery: [14, 13, 12, 11, 10, 9, 8],
//   chess: [8, 7, 6, 5, 4, 3, 2],
//   slotMachine: [5, 16, 3, 9, 8, 4, 0],
//   fishing: [7, 7, 8, 11, 2, 6, 9],
//   horseRacing: [7, 7, 8, 11, 2, 6, 9]
// };
const value = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [14, 13, 12, 11, 10, 9, 8],
  [8, 7, 6, 5, 4, 3, 2],
  [5, 16, 3, 9, 8, 4, 0],
  [7, 7, 8, 11, 2, 6, 9],
  [7, 7, 8, 11, 2, 6, 9]
];

export const MultiAxesBarChart = () => {
  const chartContainerRef = useRef(null);
  const [barPercentageState, setBarPercentageState] = useState(1);

  useEffect(() => {
    let hoverValue = undefined;
    const hoverSegment = {
      id: "hoverSegment",
      beforeDatasetsDraw(chart, args, pluginOptions) {
        const {
          ctx,
          canvas,
          data,
          chartArea: { top, bottom, left, right, width, height },
          scales: { x, y },
        } = chart;
        ctx.save();
        if (hoverValue !== undefined) {
          const segment = width / (x.max + 1);
          ctx.fillStyle = "rgba(215, 242, 254, 0.5)";
          ctx.fillRect(
            x.getPixelForValue(hoverValue) - segment / 2,
            top,
            segment,
            height
          );
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = "#2E8FF8";
          ctx.beginPath();
          ctx.moveTo(x.getPixelForValue(hoverValue) - segment / 2, top);
          ctx.lineTo(x.getPixelForValue(hoverValue) - segment / 2, bottom + 10);
          ctx.moveTo(
            x.getPixelForValue(hoverValue) + segment / 2 - lineWidth / 2,
            top
          );
          ctx.lineTo(
            x.getPixelForValue(hoverValue) + segment / 2 - lineWidth / 2,
            bottom + 10
          );
          ctx.stroke();
        }
      },
      afterDatasetsDraw(chart, args, pluginOptions) {
        const {
          ctx,
          canvas,
          data,
          chartArea: { top, bottom, left, right, width, height },
          scales: { x, y },
        } = chart;
        ctx.save();
        if (hoverValue !== undefined) {
          const segment = width / (x.max + 1);
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.fillRect(
            left + lineWidth / 2,
            top,
            Math.max(
              x.getPixelForValue(hoverValue) - segment / 2 - left - lineWidth,
              0
            ),
            height
          );
          ctx.fillRect(
            x.getPixelForValue(hoverValue) + segment / 2,
            top,
            right,
            height
          );
        }
      },
      afterEvent(chart, args) {
        const {
          ctx,
          canvas,
          chartArea: { top, bottom, height },
          scales: { x, y },
        } = chart;
        if (args.inChartArea) {
          hoverValue = x.getValueForPixel(args.event.x);
        } else {
          hoverValue = undefined;
        }
        args.changed = true;
      },
    };

    const getOrCreateLegendList = (chart, id) => {
      const legendContainer = document.getElementById(id);
      let listContainer = legendContainer.querySelector("ul");

      if (!listContainer) {
        listContainer = document.createElement("ul");
        listContainer.classList.add(style["legendListContainer"]);

        legendContainer.appendChild(listContainer);
      }

      return listContainer;
    };

    const htmlLegendPlugin = {
      id: "htmlLegend",
      afterUpdate(chart, args, options) {
        const ul = getOrCreateLegendList(chart, options.containerID);

        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }

        // Reuse the built-in legendItems generator
        const items = chart.options.plugins.legend.labels.generateLabels(chart);

        items.forEach((item) => {
          const li = document.createElement("li");
          li.classList.add(style["legendLiContainer"]);
          li.onclick = () => {
            const { type } = chart.config;
            if (type === "pie" || type === "doughnut") {
              // Pie and doughnut charts only have a single dataset and visibility is per item
              chart.toggleDataVisibility(item.index);
            } else {
              chart.setDatasetVisibility(
                item.datasetIndex,
                !chart.isDatasetVisible(item.datasetIndex)
              );
            }
            chart.update();
          };

          // Color box
          const legendItemContainer = document.createElement("div");
          legendItemContainer.classList.add(style["legendItemContainer"]);
          legendItemContainer.style.color = item.hidden ? '#98A2B3' : '#1D2939';
          legendItemContainer.style.backgroundColor = item.hidden ? '#E4E7EC' : '#f2f4f7';
          const legendUpperItem = document.createElement("div");
          legendUpperItem.classList.add(style["legendUpperItem"]);
          const legendColorBox = document.createElement("span");
          legendColorBox.classList.add(style["legendColorBox"]);

          legendColorBox.style.background = item.hidden ? '#98A2B3' : item.fillStyle;
          legendColorBox.style.borderColor = item.strokeStyle;
          legendColorBox.style.borderWidth = item.lineWidth + "px";

          legendUpperItem.appendChild(legendColorBox);
          legendUpperItem.appendChild(document.createTextNode(item.text));

          const legendLowerItem = document.createElement("div");
          legendLowerItem.classList.add(style["legendLowerItem"]);
          // Text
          const textContainer = document.createElement("div");
          textContainer.classList.add(style['legendItemSum'])
          // textContainer.style.margin = 0;
          // textContainer.style.padding = 0;
          // textContainer.style.textDecoration = item.hidden
          //   ? "line-through"
          //   : "";
          const text = document.createTextNode(convertFloatToPriceFormat(value[item.datasetIndex].reduce((total, num) => total + num)));
          textContainer.appendChild(text);
          legendLowerItem.appendChild(textContainer);

          legendItemContainer.appendChild(legendUpperItem);
          legendItemContainer.appendChild(legendLowerItem);




          li.appendChild(legendItemContainer);
          // li.appendChild(textContainer);
          ul.appendChild(li);
        });
      },
    };

    const data = {
      labels: time,
      datasets: [
        {
          label: "體育",
          data: value[0],
          backgroundColor: "#65C2FD",
        },
        {
          label: "真人荷官",
          data: value[1],
          backgroundColor: "#F74E6F",
        },
        {
          label: "彩票",
          data: value[2],
          backgroundColor: "#FFC16D",
        },
        {
          label: "棋牌",
          data: value[3],
          backgroundColor: "#40D29D",
        },
        {
          label: "老虎機",
          data: value[4],
          backgroundColor: "#5C48C9",
        },
        {
          label: "捕魚",
          data: value[5],
          backgroundColor: "#3172FD",
        },
        {
          label: "賽馬",
          data: value[6],
          backgroundColor: "#F59961",
        },
      ],
    };

    const getOrCreateTooltip = (chart) => {
      let tooltipContainer = chart.canvas.parentNode.querySelector("div");
      if (!tooltipContainer) {
        tooltipContainer = document.createElement("DIV");
        tooltipContainer.classList.add(style["tooltipContainer"]);

        const tooltipTitleContainer = document.createElement("DIV");
        tooltipTitleContainer.classList.add(style["tooltipTitleContainer"]);

        const tooltipTitleLeft = document.createElement("DIV");
        tooltipTitleLeft.classList.add(style["tooltipTitleLeft"]);
        tooltipTitleContainer.appendChild(tooltipTitleLeft);

        const tooltipTitleRight = document.createElement("DIV");
        tooltipTitleRight.classList.add(style["tooltipTitleRight"]);
        tooltipTitleContainer.appendChild(tooltipTitleRight);

        tooltipContainer.appendChild(tooltipTitleContainer);

        const tooltipBodyContainer = document.createElement("UL");
        tooltipBodyContainer.classList.add(style["tooltipBodyContainer"]);
        tooltipContainer.appendChild(tooltipBodyContainer);

        chart.canvas.parentNode.appendChild(tooltipContainer);
      }
      return tooltipContainer;
    };

    const externalTooltipHandler = (context) => {
      const { chart, tooltip } = context;

      const tooltipBox = getOrCreateTooltip(chart);

      if (tooltip.opacity === 0) {
        tooltipBox.style.opacity = 0;
        return;
      }

      // 4 tooltip text
      if (tooltip.body) {
        const tooltipTitleLeft = tooltipBox.querySelector(
          `.${style["tooltipTitleLeft"]}`
        );
        const tooltipTitleRight = tooltipBox.querySelector(
          `.${style["tooltipTitleRight"]}`
        );
        const tooltipBodyContainer = tooltipBox.querySelector(
          `.${style["tooltipBodyContainer"]}`
        );

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
        tooltipTitleLeft.appendChild(
          document.createTextNode(title.split(" ")[0])
        );
        tooltipTitleRight.appendChild(
          document.createTextNode(title.split(" ")[1])
        );

        const bodyLines = tooltip.body.map((b) => b.lines);
        bodyLines.forEach((body, i) => {
          const tooltipLI = document.createElement("LI");
          const tooltipBody = document.createElement("div");
          tooltipBody.classList.add(style["tooltipBodyItem"]);
          const colors = tooltip.labelColors[i];
          const colorSquare = document.createElement("SPAN");
          colorSquare.classList.add(style["colorSquare"]);
          colorSquare.style.background = colors.backgroundColor;
          colorSquare.style.border = `solid ${colors.borderColor}`;

          const allText = body[0].split(": ");
          const leftBody = document.createElement("SPAN");
          leftBody.classList.add(style["tooltipLeftBody"]);
          leftBody.appendChild(colorSquare);
          leftBody.appendChild(document.createTextNode(allText[0]));
          tooltipBody.appendChild(leftBody);
          tooltipBody.appendChild(
            document.createTextNode(convertStringToPriceFormat(allText[1]))
          );
          tooltipLI.appendChild(tooltipBody);
          tooltipBodyContainer.appendChild(tooltipLI);
        });

        tooltipBox.style.opacity = 1;

        // positioning of the tooltip.
        const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
        const { width, height } = chart.canvas.style;
        const {
          chartArea,
          scales: { x, y },
        } = chart;
        const segment = chartArea.width / (x.max + 1);

        const canvasWidth = parseToDouble(width.slice(0, -2));
        const canvasHeight = parseToDouble(height.slice(0, -2));

        const centerX = (positionX + canvasWidth) / 2;
        const centerY = (positionY + canvasHeight) / 2;
        const tooltipStartX =
          tooltip.caretX < centerX
            ? positionX + tooltip.caretX + segment / 2 + lineWidth / 2
            : positionX +
            tooltip.caretX -
            tooltipBox.offsetWidth -
            segment / 2 -
            lineWidth;
        tooltipBox.style.left = Math.max(tooltipStartX, positionX) + "px";
        tooltipBox.style.top =
          Math.max(centerY - tooltipBox.offsetHeight / 2, positionY) + "px";
      }
    };

    const chartConfig = {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            enabled: false,
            external: externalTooltipHandler,
            intersect: false,
          },
          htmlLegend: {
            // ID of the container to put the legend in
            containerID: "legend-container",
          },
          legend: {
            display: false,
            onLeave: (event, legendItem, legend) => {
              console.log(event);
              console.log(legendItem);
              console.log(legend);
            },
            onClick: (event, legendItem, legend) => {
              console.log(event);
              console.log(legendItem);
              console.log(legend);
            }
          },
        },
        interaction: {
          mode: "index",
        },
        scales: {
          x: {
            // offset: false,
            border: {
              display: false,
            },
            grid: {
              color: (ctx) => {
                // const lastTickIndex = ctx.chart.scales.x.ticks.length - 1;
                if (ctx.index !== 0) {
                  return "rgba(102, 102, 102, 0.1)";
                }
              },
              tickLength: 10,
            },
            ticks: {
              callback: function (val, index) {
                return this.getLabelForValue(val).split(" ")[1];
              },
              // color: 'red',
            },
          },
          y: {
            beginAtZero: true,
            border: {
              dash: [5, 5],
              display: false,
            },
            grid: {
              tickLength: 0,
            },
          },
        },
        datasets: {
          bar: {
            borderColor: "rgba(255, 255, 255, 1)",
            borderWidth: 2,
            borderRadius: 50,
            borderSkipped: false,
            // barThickness: 40,
            // maxBarThickness: 40,
            // borderColor: "rgba(0,0,0,0)",
            // borderWidth: 10,
            barPercentage: 0.3,
            categoryPercentage: 1,
            hoverBorderWidth: 1,
          },
        },
      },
      // plugins: [hoverSegment, htmlLegendPlugin],
      plugins: [hoverSegment, htmlLegendPlugin],
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


  return (
    <div className={style['container']}>
      <div id="legend-container" className={style["legendContainer"]} />
      <div className={style["canvasContainer"]}>
        <div className={style["canvasContainerBody"]}>
          <canvas className={style["canvasContent"]} ref={chartContainerRef} />
        </div>
      </div>
    </div>
  );
};
