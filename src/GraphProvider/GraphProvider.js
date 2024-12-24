import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import "./GraphProvider.css";

const GraphProvider = ({ data }) => {
  const svgRef = useRef(); // useRef is used to create the reference to svg element in the dom. D3 will target this to element to build a chart

  useEffect(() => {
    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 20, left: 50 };
    const width = 960 - margin.right;
    const height = 500 - margin.top - margin.bottom;

    //parsing dates using d3,if they are in the string format
    const combinedParsed = data.map((d) => ({
      ...d,
      Date: Date.parse(d.Date),
      open: Number(d.Open),
      high: Number(d.High),
      Low: Number(d.Low),
      close: Number(d.Close),
    }));

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up scales
    const x = d3
      .scaleBand()
      .domain([new Date('2024-08-19'), new Date('2024-08-20')])                          //.domain(combinedParsed.map((d) => d.Date)) // This maps the Date values to the x-axis
      .range([margin.left, width])
      .padding(5);

    const y = d3
      .scaleLinear() // Use linear scale for price
      //.domain([50350 , 50400])
      .domain([
        d3.min(combinedParsed, (d) => Number(d.Low)),
        d3.max(combinedParsed, (d) => Number(d.High)),
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create the SVG container
    const svg = d3.select(svgRef.current).attr("viewBox", [0, 0, width, 600]);

    // Append X axis (dates)
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(d3.timeDay.every(3))
          .tickFormat(d3.timeFormat("%Y-%m-%d"))
      )
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Append Y axis (price)
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},10)`)
      .call(d3.axisLeft(y).ticks(5));
      

    // Create the candlestick chart
    svg
      .append("g")
      .selectAll("g")
      .data(combinedParsed)
      .join("g")
      .attr("transform", (d) => `translate(${x(d.Date)},0)`)
      .call((g) =>
        g
          .append("line")
          .attr("y1", (d) => y(d.Low))
          .attr("y2", (d) => y(d.High))
          .attr("dx", 3.5)
          .attr("stroke", "black")
      )
      .call((g) =>
        g
          .append("rect")
          .attr("y", (d) => y(Math.max(d.Open, d.Close)))
          .attr("height", (d) => Math.abs(y(d.Open) - y(d.Close)))
          .attr("width", 7) // Set fixed width for candlestick bodies
          .attr("fill", (d) => (d.Open > d.Close ? "red" : "green"))
      );

    // Tooltip div element
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#fff")
      .style("border", "1px solid #000")
      .style("padding", "5px");

    //Append candlesticks and add tooltip events
    svg
      .selectAll(".candlestick")
      .data(combinedParsed)
      .enter()
      .append("rect")
      .attr("class", "candlestick")
      .attr("x", (d) => x(d.Date)) // Position on x-axis
      .attr("y", (d) => y(Math.max(d.Open, d.Close))) // Calculate y position for the candle
      .attr("width", 7)
      .attr("height", (d) => Math.abs(y(d.Open) - y(d.Close))) // Calculate the height of the candle
      .attr("fill", (d) => (d.Close > d.Open ? "green" : "red")) // Set color based on price movement
      .on("mouseover", (event, d) => {
        // Add tooltip on hover
        tooltip
          .html(
            `Open: ${d.Open}<br>Close: ${d.Close}<br>High: ${d.High}<br>Low: ${d.Low}`
          )
          .style("visibility", "visible");
      })
      .on("mousemove", (event) => {
        // Follow the mouse
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", () => {
        // Hide tooltip on mouse out
        tooltip.style("visibility", "hidden");
      });
  }, [data]); // Rerun effect when data changes

  return (
    <>
      <div className="graph-container">
        <svg ref={svgRef}></svg>
      </div>
    </>
  );
};

export default GraphProvider;
