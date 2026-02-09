
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PricePoint } from '../types';

interface PriceChartProps {
  data: PricePoint[];
  color?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, color = "#ef4444" }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    const margin = { top: 15, right: 15, bottom: 20, left: 45 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;
    const volumeHeight = height * 0.3;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
      .domain(data.map(d => d.time))
      .range([0, width]);

    const yPrice = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.price) as number * 0.985,
        d3.max(data, d => d.price) as number * 1.015
      ])
      .range([height - volumeHeight - 15, 0]);

    const yVolume = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.volume) as number * 1.1])
      .range([height, height - volumeHeight]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("stroke", "#ffffff08")
      .call(d3.axisLeft(yPrice).ticks(3).tickSize(-width).tickFormat(() => ""));

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("color", "#333")
      .selectAll("text")
      .style("font-size", "9px")
      .style("fill", "#666");

    g.append("g")
      .call(d3.axisLeft(yPrice).ticks(4).tickFormat(d3.format(".2s")))
      .attr("color", "#333")
      .selectAll("text")
      .style("font-size", "9px")
      .style("fill", "#666");

    // Volume Bars
    const barWidth = (width / data.length) * 0.7;
    g.selectAll(".volume-bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "volume-bar")
      .attr("x", d => x(d.time)! - barWidth / 2)
      .attr("y", height)
      .attr("width", barWidth)
      .attr("height", 0)
      .attr("fill", (d, i) => {
          if (i === 0) return "#444";
          return data[i].price >= data[i-1].price ? "#ef4444" : "#3b82f6";
      })
      .attr("opacity", 0.3)
      .transition()
      .duration(1000)
      .attr("y", d => yVolume(d.volume))
      .attr("height", d => height - yVolume(d.volume));

    // Price Line
    const line = d3.line<PricePoint>()
      .x(d => x(d.time)!)
      .y(d => yPrice(d.price))
      .curve(d3.curveMonotoneX);

    const path = g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2.5)
      .attr("d", line);

    // Animation
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    // Tooltip elements
    const tooltip = d3.select(containerRef.current)
      .append("div")
      .attr("class", "absolute hidden pointer-events-none bg-zinc-800/95 backdrop-blur border border-zinc-700 p-2 rounded-lg text-[10px] text-white z-50 shadow-xl min-w-[100px]")
      .style("transform", "translate(-50%, -110%)");

    const crosshair = g.append("line")
      .attr("class", "crosshair")
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#666")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3")
      .style("opacity", 0);

    const focusCircle = g.append("circle")
      .attr("r", 5)
      .attr("fill", color)
      .attr("stroke", "#121212")
      .attr("stroke-width", 2)
      .style("opacity", 0);

    // Mouse Overlay for interactivity
    const overlay = g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);
        
        // Find nearest data point
        const domain = data.map(d => x(d.time)!);
        const index = d3.bisectCenter(domain, mouseX);
        const d = data[index];

        if (d) {
          const posX = x(d.time)!;
          const posY = yPrice(d.price);

          crosshair
            .attr("x1", posX)
            .attr("x2", posX)
            .style("opacity", 1);

          focusCircle
            .attr("cx", posX)
            .attr("cy", posY)
            .style("opacity", 1);

          tooltip
            .style("left", `${posX + margin.left}px`)
            .style("top", `${posY + margin.top}px`)
            .style("display", "block")
            .html(`
              <div class="font-bold text-zinc-400 mb-1 border-b border-zinc-700 pb-1">${d.time}</div>
              <div class="flex justify-between gap-4">
                <span>가격:</span>
                <span class="font-bold text-white">${d.price.toLocaleString()}원</span>
              </div>
              <div class="flex justify-between gap-4">
                <span>거래량:</span>
                <span class="font-bold text-zinc-300">${d.volume.toLocaleString()}주</span>
              </div>
            `);
        }
      })
      .on("mouseleave", () => {
        crosshair.style("opacity", 0);
        focusCircle.style("opacity", 0);
        tooltip.style("display", "none");
      });

  }, [data, color]);

  return (
    <div ref={containerRef} className="w-full relative">
      <svg ref={svgRef} className="w-full h-[150px] overflow-visible"></svg>
    </div>
  );
};

export default PriceChart;
