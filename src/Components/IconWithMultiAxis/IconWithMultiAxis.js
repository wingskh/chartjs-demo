import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import style from "./IconWithMultiAxis.module.css";
import { convertStringToPriceFormat, parseToDouble } from "../../Util/general";
import ballImage from "../../assets/images/ball.png";
import cardImage from "../../assets/images/card.png";
import casinoImage from "../../assets/images/casino.png";
import footballImage from "../../assets/images/football.png";
import gameImage from "../../assets/images/game.png";
import horseImage from "../../assets/images/horse.png";
import mahjongImage from "../../assets/images/mahjong.png";

const lineWidth = 3;
export const IconWithMultiAxis = () => {
  const chartContainerRef = useRef(null);
  const imageSize = 25;
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDownX, setMouseDownX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setMouseDownX(event.clientX);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    const dx = event.clientX - mouseDownX;
    containerRef.current.scrollLeft = scrollLeft - dx;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const time = [
      "2022/12/08 0:00",
      "2022/12/08 4:00",
      "2022/12/08 8:00",
      "2022/12/08 12:00",
      "2022/12/08 16:00",
      "2022/12/08 20:00",
      "2022/12/08 23:59",
    ];
    const images = [
      ballImage,
      cardImage,
      casinoImage,
      footballImage,
      gameImage,
      horseImage,
      gameImage,
      mahjongImage,
    ].map((png) => {
      const image = new Image();
      image.src = png;
      return image;
    });
    const imageItems = {
      id: "imageItems",
      beforeDatasetsDraw(chart, args, pluginOptions) {
        const {
          ctx,
          canvas,
          data,
          chartArea: { top, bottom, left, right, width, height },
          scales: { x, y },
        } = chart;
        ctx.save();

        // data.datasets[0].image.forEach((imageLink, index) => {
        //   const logo = new Image();
        //   logo.src = imageLink.src;
        //   ctx.drawImage(
        //     logo,
        //     x.getPixelForValue(index) - imageSize / 2,
        //     chart.height - 50,
        //     imageSize,
        //     imageSize
        //   );
        // });
        data.datasets.forEach((dataset, index) => {
          const logo = new Image();
          logo.src = dataset.image.src;
          chart.getDatasetMeta(index).data.forEach((pos, i) => {
            ctx.drawImage(
              logo,
              pos.x - imageSize / 2,
              bottom + imageSize / 1.5,
              imageSize,
              imageSize
            );
          });
          // ctx.font = `20px sans-serif`;
          // const text = x.getLabelForValue(index).split(" ")[1];
          // const textWidth = ctx.measureText(text).width;
          // ctx.fillStyle = '#98A2B3';
          // ctx.fillText(
          //   text,
          //   x.getPixelForValue(index) - textWidth / 2,
          //   chart.height,
          // );
        });
      },
    };

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
          ctx.lineTo(x.getPixelForValue(hoverValue) - segment / 2, bottom + imageSize * 2.5);
          ctx.moveTo(
            x.getPixelForValue(hoverValue) + segment / 2 - lineWidth / 2,
            top
          );
          ctx.lineTo(
            x.getPixelForValue(hoverValue) + segment / 2 - lineWidth / 2,
            bottom + imageSize * 2.5
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

    const data = {
      labels: time,
      datasets: [
        {
          label: "體育",
          data: [1, 2, 3, 4, 5, 6, 7],
          backgroundColor: "#65C2FD",
          image: images[0],
        },
        {
          label: "真人荷官",
          data: [8, 9, 10, 11, 12, 13, 14],
          backgroundColor: "#F74E6F",
          image: images[1],
        },
        {
          label: "彩票",
          data: [14, 13, 12, 11, 10, 8.9, 8],
          backgroundColor: "#FFC16D",
          image: images[2],
        },
        {
          label: "棋牌",
          data: [8, 7, 6, 5, 4, 3, 2],
          backgroundColor: "#40D29D",
          image: images[3],
        },
        {
          label: "老虎機",
          data: [7, 7, 8, 11, 2, 6, 9],
          backgroundColor: "#5C48C9",
          image: images[4],
        },
        {
          label: "捕魚",
          data: [7, 7, 8, 11, 2, 6, 9],
          backgroundColor: "#3172FD",
          image: images[5],
        },
        {
          label: "賽馬",
          data: [7, 7, 8, 11, 2, 6, 9],
          backgroundColor: "#F59961",
          image: images[6],
        },
      ],
    };

    const getOrCreateTooltip = (chart) => {
      let tooltipContainer = chart.canvas.parentNode.querySelector("div");
      if (!tooltipContainer) {
        tooltipContainer = document.createElement("DIV");
        tooltipContainer.classList.add(style['tooltipContainer']);

        const tooltipTitleContainer = document.createElement("DIV");
        tooltipTitleContainer.classList.add(style['tooltipTitleContainer']);

        const tooltipTitleLeft = document.createElement("DIV");
        tooltipTitleLeft.classList.add(style['tooltipTitleLeft']);
        tooltipTitleContainer.appendChild(tooltipTitleLeft);

        const tooltipTitleRight = document.createElement("DIV");
        tooltipTitleRight.classList.add(style['tooltipTitleRight']);
        tooltipTitleContainer.appendChild(tooltipTitleRight);

        tooltipContainer.appendChild(tooltipTitleContainer);

        const tooltipBodyContainer = document.createElement("UL");
        tooltipBodyContainer.classList.add(style['tooltipBodyContainer']);
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
        const tooltipTitleLeft = tooltipBox.querySelector(`.${style['tooltipTitleLeft']}`);
        const tooltipTitleRight =
          tooltipBox.querySelector(`.${style['tooltipTitleRight']}`);
        const tooltipBodyContainer = tooltipBox.querySelector(
          `.${style['tooltipBodyContainer']}`
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
            // document.createTextNode(allText[1])
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

        const centerX = containerRef.current.clientWidth / 2
        const centerY = (positionY + canvasHeight) / 2;

        const tooltipStartX =
          (tooltip.caretX - containerRef.current.scrollLeft < centerX
            ? positionX + tooltip.caretX + segment / 2 + lineWidth / 2
            : positionX +
            tooltip.caretX -
            tooltipBox.offsetWidth -
            segment / 2 -
            lineWidth) - containerRef.current.scrollLeft;
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
        categoryPercentage: 0.8,
        barPercentage: 0.9,
        plugins: {
          tooltip: {
            enabled: false,
            external: externalTooltipHandler,
            intersect: false,
          },
          legend: {
            display: false
          },
        },
        interaction: {
          mode: "index",
        },
        // layout: {
        //   padding: {
        //     bottom: 50,
        //   },
        // },
        scales: {
          x: {
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
              tickLength: imageSize * 2.5,
            },
            ticks: {
              callback: function (val, index) {
                return this.getLabelForValue(val).split(" ")[1];
              },
              // display: false,
              padding: 0,
              color: '#98A2B3',
              font: {
                size: 18
              }
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
            barPercentage: 0.3,
            categoryPercentage: 1,
            borderSkipped: false,
          },
        },
      },
      plugins: [hoverSegment, imageItems],
    };

    // data.labels.unshift('');
    // data.labels.push('');
    // data.datasets.forEach((e) => e.data.unshift(null))
    // data.datasets.forEach((e) => e.data.push(null))
    const chart = new Chart(chartContainerRef.current, chartConfig);


    return () => {
      chart.destroy();
      // Chart.unregister(addButtonPlugin);
    };
  }, []);

  return (
    <div className={style['container']}>
      <div
        ref={containerRef}
        className={style['canvasContainer']}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className={style['canvasContainerBody']}>
          <canvas id="canvas" className={style['canvasContent']} ref={chartContainerRef} />
        </div>
      </div>
    </div>
  );
};
