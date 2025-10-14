import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface VoteData {
  label: string;
  value: number;
  color: string;
}

interface VoteChartProps {
  data: VoteData[];
  width?: number;
  height?: number;
}

export function VoteChart({ data, width = 400, height = 300 }: VoteChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Axes
    svg
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#4B5563');

    svg
      .append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#4B5563');

    // Bars
    svg
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d) => x(d.label) || 0)
      .attr('y', innerHeight)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', (d) => d.color)
      .attr('rx', 4)
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => y(d.value))
      .attr('height', (d) => innerHeight - y(d.value));

    // Value labels on top of bars
    svg
      .selectAll('.label')
      .data(data)
      .join('text')
      .attr('class', 'label')
      .attr('x', (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#1F2937')
      .style('opacity', 0)
      .text((d) => d.value.toFixed(1))
      .transition()
      .duration(800)
      .delay(400)
      .style('opacity', 1);
  }, [data, width, height]);

  return (
    <div className="flex items-center justify-center">
      <svg ref={svgRef}></svg>
    </div>
  );
}
