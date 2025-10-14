import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PieData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieData[];
  width?: number;
  height?: number;
}

export function PieChart({ data, width = 300, height = 300 }: PieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const radius = Math.min(width, height) / 2 - 10;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3
      .pie<PieData>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<PieData>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    const arcs = svg.selectAll('arc').data(pie(data)).enter().append('g');

    arcs
      .append('path')
      .attr('fill', (d) => d.data.color)
      .attr('d', arc as any)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t) as any) || '';
        };
      });

    // Labels
    arcs
      .append('text')
      .attr('transform', (d) => {
        const [x, y] = arc.centroid(d as any);
        return `translate(${x}, ${y})`;
      })
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', 'white')
      .style('opacity', 0)
      .text((d) => `${((d.value / d3.sum(data, (d) => d.value)) * 100).toFixed(0)}%`)
      .transition()
      .duration(800)
      .delay(400)
      .style('opacity', 1);

    // Legend
    const legend = svg
      .selectAll('.legend')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${radius + 20}, ${i * 25 - (data.length * 25) / 2})`);

    legend
      .append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', (d) => d.color)
      .attr('rx', 3);

    legend
      .append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('font-size', '12px')
      .style('fill', '#4B5563')
      .text((d) => d.label);
  }, [data, width, height]);

  return (
    <div className="flex items-center justify-center">
      <svg ref={svgRef}></svg>
    </div>
  );
}
