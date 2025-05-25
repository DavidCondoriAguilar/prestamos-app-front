import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DonutChart = ({ data, onSegmentHover, width = 300, height = 300, innerRadius = 70, outerRadius = 100 }) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear existing SVG
    d3.select(svgRef.current).selectAll('*').remove();
    
    const total = d3.sum(data, d => d.value);
    if (total === 0) return;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create arc
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    // Create pie generator
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    // Create arcs
    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .select('path')
          .transition()
          .duration(200)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
        
        if (onSegmentHover) {
          onSegmentHover(d.data);
        }
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .select('path')
          .transition()
          .duration(200)
          .attr('stroke', 'none');
        
        if (onSegmentHover) {
          onSegmentHover(null);
        }
      });

    // Add arcs to SVG
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function(t) {
          d.endAngle = i(t);
          return arc(d);
        };
      });

    // Add shadow effect
    svg.append('filter')
      .attr('id', 'drop-shadow')
      .append('feDropShadow')
      .attr('flood-opacity', 0.5)
      .attr('dx', 0)
      .attr('dy', 2)
      .attr('stdDeviation', 3);

  }, [data, width, height, innerRadius, outerRadius, onSegmentHover]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg 
        ref={svgRef} 
        className="w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
      />
      <div 
        ref={tooltipRef} 
        className="absolute pointer-events-none opacity-0 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm shadow-lg transition-opacity duration-200"
      />
    </div>
  );
};

export default DonutChart;
