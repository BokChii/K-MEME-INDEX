
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BrainrotBreakdown } from '../types';

interface Props {
  data: BrainrotBreakdown;
  reason: string;
}

const BrainrotDiagnosis: React.FC<Props> = ({ data, reason }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 300;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const features = [
      { name: "억지 논리성", key: "logicLeap" },
      { name: "커뮤니티 과열", key: "communityFever" },
      { name: "패닉(FOMO)", key: "fomoLevel" },
      { name: "테마 기괴함", key: "themeWeirdness" },
      { name: "세력 개입", key: "marketAnomaly" }
    ];

    const angleScale = d3.scaleLinear()
      .domain([0, features.length])
      .range([0, 2 * Math.PI]);

    const radiusScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius]);

    // Grid circles
    [20, 40, 60, 80, 100].forEach(d => {
      g.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radiusScale(d))
        .attr("fill", "none")
        .attr("stroke", "#333")
        .attr("stroke-dasharray", "4,4");
    });

    // Axes
    features.forEach((f, i) => {
      const angle = angleScale(i) - Math.PI / 2;
      const x = radiusScale(100) * Math.cos(angle);
      const y = radiusScale(100) * Math.sin(angle);

      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#333");

      g.append("text")
        .attr("x", x * 1.2)
        .attr("y", y * 1.2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "#666")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .text(f.name);
    });

    // Data polygon
    const line = d3.lineRadial<any>()
      .angle((d, i) => angleScale(i))
      .radius(d => radiusScale(d.value))
      .curve(d3.curveLinearClosed);

    const radarData = features.map(f => ({ value: (data as any)[f.key] }));

    g.append("path")
      .datum(radarData)
      .attr("d", line)
      .attr("fill", "rgba(255, 0, 0, 0.2)")
      .attr("stroke", "#FF0000")
      .attr("stroke-width", 2)
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);

    // Data dots
    radarData.forEach((d, i) => {
      const angle = angleScale(i) - Math.PI / 2;
      g.append("circle")
        .attr("cx", radiusScale(d.value) * Math.cos(angle))
        .attr("cy", radiusScale(d.value) * Math.sin(angle))
        .attr("r", 4)
        .attr("fill", "#FF0000");
    });

  }, [data]);

  return (
    <div className="flex flex-col items-center gap-6 animate-fadeIn">
      <div className="bg-zinc-950 p-4 rounded-full border border-zinc-800 shadow-inner">
        <svg ref={svgRef} width="300" height="300"></svg>
      </div>
      <div className="bg-zinc-800/40 p-6 rounded-2xl border border-zinc-700/50 w-full">
        <h4 className="text-red-500 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
          AI Diagnostic Result
        </h4>
        <p className="text-sm text-zinc-300 leading-relaxed italic">
          "{reason}"
        </p>
      </div>
    </div>
  );
};

export default BrainrotDiagnosis;
