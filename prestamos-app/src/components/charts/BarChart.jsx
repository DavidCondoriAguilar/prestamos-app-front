import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ 
  data, 
  width = 500, 
  height = 300, 
  margin = { top: 20, right: 20, bottom: 60, left: 60 },
  onBarHover 
}) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear existing SVG
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up dimensions
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.3);

    const maxValue = d3.max(data, d => d.value) * 1.2; // Add 20% padding
    const y = d3.scaleLinear()
      .domain([0, maxValue])
      .nice()
      .range([innerHeight, 0]);

    // Add X axis
    const xAxis = g => g
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call(g => g.selectAll('.domain').remove())
      .call(g => g.selectAll('text')
        .attr('class', 'text-xs fill-gray-400')
        .attr('y', 10));

    // Add Y axis
    const yAxis = g => g
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickFormat(d => d))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line')
        .attr('stroke', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke-dasharray', '2,2'))
      .call(g => g.selectAll('.tick text')
        .attr('class', 'text-xs fill-gray-400')
        .attr('x', -10));

    // Add axes to SVG
    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);

    // Add bars
    const bars = svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) || 0)
      .attr('y', innerHeight)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', d => d.color || '#3B82F6')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('opacity', 0.8)
          .attr('y', y(d.value) - 5)
          .attr('height', innerHeight - y(d.value) + 5);
        
        if (onBarHover) {
          onBarHover(d);
        }

        // Show tooltip
        if (tooltipRef.current) {
          const tooltip = d3.select(tooltipRef.current);
          tooltip
            .html(`
              <div class="font-semibold">${d.label}</div>
              <div>${d.value} préstamos</div>
              <div class="text-xs text-gray-300">${((d.value / d3.sum(data, d => d.value)) * 100).toFixed(1)}% del total</div>
            `)
            .style('opacity', 1)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);
        }
      })
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('y', y(d.value))
          .attr('height', innerHeight - y(d.value));
        
        if (onBarHover) {
          onBarHover(null);
        }

        // Hide tooltip
        if (tooltipRef.current) {
          d3.select(tooltipRef.current).style('opacity', 0);
        }
      });

    // Animate bars
    bars.transition()
      .duration(800)
      .attr('y', d => y(d.value))
      .attr('height', d => innerHeight - y(d.value))
      .delay((d, i) => i * 100);

    // Add value labels on top of bars
    const labels = svg.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label text-xs font-medium fill-white')
      .attr('x', d => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('y', innerHeight + 10)
      .attr('text-anchor', 'middle')
      .text(d => d.value)
      .style('opacity', 0);

    // Animate labels
    labels.transition()
      .duration(800)
      .delay((d, i) => i * 100 + 300)
      .style('opacity', 1)
      .attr('y', d => y(d.value) - 5);

  }, [data, width, height, margin, onBarHover]);

  return (
    <div className="relative w-full h-full">
      <svg 
        ref={svgRef} 
        className="w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
      />
      <div 
        ref={tooltipRef}
        className="absolute bg-gray-800 text-white text-xs p-2 rounded pointer-events-none opacity-0 transition-opacity duration-200 shadow-lg z-10"
        style={{ minWidth: '120px' }}
      />
    </div>
  );
};

export default BarChart;
