import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

const LineChart = ({ 
  data, 
  selectedType = 'monto',
  colors = {},
  width = 500, 
  height = 300, 
  margin = { top: 20, right: 30, bottom: 50, left: 60 }
}) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [activeLines, setActiveLines] = useState({
    monto: true,
    cantidad: true,
    clientes: true
  });
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Define line types with their configurations
  const lineTypes = [
    { 
      key: 'monto', 
      label: 'Monto Total', 
      color: colors.monto || '#3B82F6',
      value: d => d.total,
      format: d => `S/ ${d3.format(',.0f')(d)}`
    },
    { 
      key: 'cantidad', 
      label: 'Cantidad', 
      color: colors.cantidad || '#10B981',
      value: d => d.cantidad,
      format: d => d3.format(',')(d)
    },
    { 
      key: 'clientes', 
      label: 'Clientes', 
      color: colors.clientes || '#8B5CF6',
      value: d => d.clientes,
      format: d => d3.format(',')(d)
    }
  ];

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

    // Parse the date / time
    const parseTime = d3.timeParse('%b');
    const formatTime = d3.timeFormat('%b');

    // Format the data
    const formattedData = data.map(d => ({
      ...d,
      date: parseTime(d.name)
    }));

    // Set the ranges
    const x = d3.scaleTime()
      .domain(d3.extent(formattedData, d => d.date))
      .range([0, innerWidth]);

    // Find max value for y-axis
    const maxValue = d3.max(formattedData, d => {
      let max = 0;
      if (activeLines.monto) max = Math.max(max, d.monto || 0);
      if (activeLines.cantidad) max = Math.max(max, d.cantidad || 0);
      if (activeLines.clientes) max = Math.max(max, d.clientes || 0);
      return max;
    }) * 1.2; // Add 20% padding

    const y = d3.scaleLinear()
      .domain([0, maxValue])
      .nice()
      .range([innerHeight, 0]);

    // Define the lines
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Add X axis
    const xAxis = g => g
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(formatTime).tickSizeOuter(0))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text')
        .attr('class', 'text-xs fill-gray-400')
        .attr('y', 10));

    // Add Y axis
    const yAxis = g => g
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line')
        .attr('stroke', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke-dasharray', '2,2'))
      .call(g => g.selectAll('.tick text')
        .attr('class', 'text-xs fill-gray-400')
        .attr('x', -10));

    // Add grid lines
    const grid = g => g
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-innerWidth)
        .tickFormat('')
        .tickValues(y.ticks(5)));

    // Add axes and grid to SVG
    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);
    svg.append('g').call(grid);

    // Add clip path
    svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight);

    // Create a group for lines and dots
    const chartGroup = svg.append('g').attr('clip-path', 'url(#clip)');

    // Add lines
    lineTypes.forEach((type, i) => {
      if (!activeLines[type.key]) return;

      const lineData = formattedData.map(d => ({
        date: d.date,
        value: d[type.key] || 0,
        name: d.name
      }));

      // Add the line path
      chartGroup.append('path')
        .datum(lineData)
        .attr('class', `line line-${type.key}`)
        .attr('fill', 'none')
        .attr('stroke', type.color)
        .attr('stroke-width', 2.5)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('d', line)
        .style('opacity', 0)
        .transition()
        .duration(800)
        .delay(i * 150)
        .style('opacity', 1);

      // Add circles for data points
      chartGroup.selectAll(`.dot-${type.key}`)
        .data(lineData)
        .enter()
        .append('circle')
        .attr('class', `dot dot-${type.key}`)
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.value))
        .attr('r', 0)
        .attr('fill', type.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .on('mouseover', (event, d) => {
          setHoveredPoint({ ...d, type: type.key, color: type.color });
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 6);
        })
        .on('mouseout', (event) => {
          setHoveredPoint(null);
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 4);
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 100 + i * 50)
        .attr('r', 4);
    });

    // Add hover line
    const hoverLine = chartGroup.append('line')
      .attr('class', 'hover-line')
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-width', 1)
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .style('opacity', 0);

    // Add hover area
    const hoverArea = chartGroup.append('rect')
      .attr('class', 'hover-area')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .style('opacity', 0)
      .on('mousemove', (event) => {
        const [xPos] = d3.pointer(event);
        const x0 = x.invert(xPos);
        const i = d3.bisector(d => d.date).left(formattedData, x0, 1);
        const d0 = formattedData[i - 1];
        const d1 = formattedData[i];
        const d = x0 - d0?.date > d1?.date - x0 ? d1 : d0;
        
        if (d) {
          hoverLine
            .attr('x1', x(d.date))
            .attr('x2', x(d.date))
            .style('opacity', 1);
          
          // Update tooltip
          if (tooltipRef.current) {
            const tooltip = d3.select(tooltipRef.current);
            tooltip
              .style('opacity', 1)
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY - 10}px`)
              .html(`
                <div class="text-sm font-semibold mb-1">${d.name}</div>
                ${lineTypes.map(type => {
                  if (!activeLines[type.key]) return '';
                  return `
                    <div class="flex items-center justify-between text-xs mt-1">
                      <div class="flex items-center">
                        <div class="w-2 h-2 rounded-full mr-2" style="background-color: ${type.color}"></div>
                        <span>${type.label}:</span>
                      </div>
                      <span class="font-medium ml-2">${d[type.key]}</span>
                    </div>
                  `;
                }).join('')}
              `);
          }
        }
      })
      .on('mouseout', () => {
        hoverLine.style('opacity', 0);
        if (tooltipRef.current) {
          d3.select(tooltipRef.current).style('opacity', 0);
        }
      });

  }, [data, activeLines, width, height, margin, colors]);

  // Toggle line visibility
  const toggleLine = (key) => {
    setActiveLines(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Format value based on type
  const formatValue = (value, type) => {
    if (type === 'monto') return `S/ ${value.toLocaleString('es-PE')}`;
    return value;
  };

  return (
    <div className="relative w-full h-full">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mb-4 px-2">
        {lineTypes.map(type => (
          <motion.button
            key={type.key}
            className={`flex items-center text-xs px-3 py-1 rounded-full border transition-colors ${
              activeLines[type.key] 
                ? 'bg-opacity-20' 
                : 'opacity-40 bg-transparent'
            }`}
            style={{
              backgroundColor: activeLines[type.key] ? `${type.color}33` : 'transparent',
              borderColor: type.color,
              color: activeLines[type.key] ? 'white' : type.color
            }}
            onClick={() => toggleLine(type.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              className="w-2 h-2 rounded-full mr-2" 
              style={{ backgroundColor: type.color }}
            />
            {type.label}
          </motion.button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative" style={{ width: '100%', height: 'calc(100% - 40px)' }}>
        <svg 
          ref={svgRef} 
          className="w-full h-full"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        />
        
        {/* Tooltip */}
        <div 
          ref={tooltipRef}
          className="absolute bg-gray-800 text-white text-xs p-3 rounded-lg pointer-events-none opacity-0 transition-opacity duration-200 shadow-xl z-10"
          style={{ 
            minWidth: '160px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        />
        
        {/* Hovered point highlight */}
        {hoveredPoint && (
          <motion.div 
            className="absolute bg-gray-800 text-white text-xs p-2 rounded pointer-events-none z-20 flex flex-col items-center"
            style={{
              left: `${margin.left + x(hoveredPoint.date)}px`,
              top: `${margin.top + y(hoveredPoint.value) - 30}px`,
              transform: 'translateX(-50%)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="font-semibold">
              {formatValue(hoveredPoint.value, hoveredPoint.type)}
            </div>
            <div className="text-2xs text-gray-300">
              {hoveredPoint.name}
            </div>
            <div 
              className="absolute -bottom-1 w-2 h-2 transform rotate-45" 
              style={{ backgroundColor: hoveredPoint.color }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LineChart;
