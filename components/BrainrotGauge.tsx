
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Props {
  value: number; // 0 to 100
}

const BrainrotGauge: React.FC<Props> = ({ value }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 200;
    const height = 120;
    const innerRadius = 60;
    const outerRadius = 90;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    const container = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height})`);

    // Background Arc
    container.append("path")
      .attr("d", arc({ startAngle: -Math.PI / 2, endAngle: Math.PI / 2 } as any))
      .attr("fill", "#333");

    // Foreground Arc (Value)
    const angle = (value / 100) * Math.PI - Math.PI / 2;
    const foregroundArc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(-Math.PI / 2)
      .endAngle(angle);

    container.append("path")
      .attr("d", foregroundArc({} as any))
      .attr("fill", "#FF0000")
      .transition()
      .duration(1000)
      .attrTween("d", function() {
        const interpolate = d3.interpolate(-Math.PI / 2, angle);
        return function(t) {
          return foregroundArc.endAngle(interpolate(t))({} as any)!;
        };
      });

  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <svg ref={svgRef} width="200" height="120"></svg>
      <div className="text-4xl font-meme mt-[-20px] text-red-600">{value}%</div>
      <p className="text-sm text-gray-400 mt-2">
        {value > 80 ? "⚠️ 이성이 마비된 상태입니다" : value > 50 ? "🧠 뇌절 회로 가열 중" : "📉 평범한 국장"}
      </p>
    </div>
  );
};

export default BrainrotGauge;
