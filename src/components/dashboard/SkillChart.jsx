import React, { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as d3 from 'd3';

const ChartContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  '& svg': {
    overflow: 'visible',
  },
  '& .radar-chart-tooltip': {
    position: 'absolute',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    pointerEvents: 'none',
    fontSize: '0.85rem',
    transition: 'opacity 0.3s ease',
  }
}));

const SkillChart = ({ data, color, showLabels = true, size = 'medium' }) => {
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);
  const theme = useTheme();
  
  // Get colors from theme
  const chartColor = color || theme.palette.primary.main;
  const chartColorOpacity = theme.palette.mode === 'dark' 
    ? 'rgba(0, 157, 255, 0.2)' 
    : 'rgba(0, 157, 255, 0.15)';
  const textColor = theme.palette.text.primary;
  const axisColor = theme.palette.divider;
  
  // Determine size based on prop
  const getSize = () => {
    switch (size) {
      case 'small': return { width: 200, height: 200, fontSize: 10 };
      case 'large': return { width: 400, height: 400, fontSize: 14 };
      default: return { width: 300, height: 300, fontSize: 12 };
    }
  };
  
  const { width, height, fontSize } = getSize();
  
  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;
    
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Setup
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const radius = Math.min(width, height) / 2 - margin.top;
    
    // SVG container
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
    
    // Create tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style('opacity', 0)
      .attr('class', 'radar-chart-tooltip');
    
    // Data processing
    const skills = data.map(d => d.skill);
    const values = data.map(d => d.value);
    
    // Scales
    const angleScale = d3.scalePoint()
      .domain(skills)
      .range([0, 2 * Math.PI]);
    
    const radiusScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius]);
    
    // Function to compute the path
    const line = d3.lineRadial()
      .angle(d => angleScale(d.skill))
      .radius(d => radiusScale(d.value))
      .curve(d3.curveCardinalClosed);
    
    // Draw the background circles
    const levels = [20, 40, 60, 80, 100];
    levels.forEach(level => {
      svg.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radiusScale(level))
        .attr('stroke', axisColor)
        .attr('fill', 'none')
        .attr('stroke-dasharray', '2,2')
        .attr('stroke-width', 0.5);
      
      // Add percentage labels to the circles
      if (level % 40 === 0) {
        svg.append('text')
          .attr('x', 0)
          .attr('y', -radiusScale(level) - 5)
          .attr('fill', theme.palette.text.secondary)
          .attr('text-anchor', 'middle')
          .attr('font-size', fontSize - 2)
          .text(`${level}%`);
      }
    });
    
    // Draw the axis for each skill
    const axes = svg.selectAll('.axis')
      .data(skills)
      .enter()
      .append('line')
      .attr('class', 'axis')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d) => radiusScale(110) * Math.cos(angleScale(d) - Math.PI / 2))
      .attr('y2', (d) => radiusScale(110) * Math.sin(angleScale(d) - Math.PI / 2))
      .attr('stroke', axisColor)
      .attr('stroke-width', 0.5);
    
    // Draw the labels
    if (showLabels) {
      svg.selectAll('.label')
        .data(skills)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', (d) => radiusScale(115) * Math.cos(angleScale(d) - Math.PI / 2))
        .attr('y', (d) => radiusScale(115) * Math.sin(angleScale(d) - Math.PI / 2))
        .attr('font-size', fontSize)
        .attr('text-anchor', (d) => {
          const angle = angleScale(d);
          if (angle < Math.PI / 2 || angle > 3 * Math.PI / 2) return 'start';
          else if (Math.abs(angle - Math.PI) < 0.1) return 'middle';
          else return 'end';
        })
        .attr('dominant-baseline', (d) => {
          const angle = angleScale(d);
          if (angle < Math.PI) return 'auto';
          else return 'hanging';
        })
        .attr('fill', textColor)
        .text(d => d)
        .attr('dy', (d) => {
          const angle = angleScale(d);
          return (Math.abs(angle - Math.PI/2) < 0.1 || Math.abs(angle - 3*Math.PI/2) < 0.1) ? '0.35em' : '0';
        });
    }
    
    // Draw the shape
    const chartData = data.map(d => ({ 
      skill: d.skill, 
      value: d.value 
    }));
    
    // Create point elements for interaction
    const points = svg.selectAll('.point')
      .data(chartData)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', d => radiusScale(d.value) * Math.cos(angleScale(d.skill) - Math.PI / 2))
      .attr('cy', d => radiusScale(d.value) * Math.sin(angleScale(d.skill) - Math.PI / 2))
      .attr('r', 5)
      .attr('fill', chartColor)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        
        tooltip.html(`<strong>${d.skill}</strong>: ${d.value}%`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 5);
        
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
    
    // Draw the shape path
    const area = svg.append('path')
      .datum(chartData)
      .attr('d', line)
      .attr('stroke', chartColor)
      .attr('stroke-width', 2)
      .attr('fill', chartColorOpacity)
      .attr('opacity', 0.8)
      .attr('stroke-linejoin', 'round');
    
    // Add animation
    const pathLength = area.node().getTotalLength();
    
    area.attr('stroke-dasharray', pathLength + ' ' + pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
    
    // Add animation to points
    points
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .delay((d, i) => 1000 + i * 100)
      .attr('opacity', 1);
    
  }, [data, chartColor, chartColorOpacity, axisColor, textColor, width, height, fontSize, showLabels, theme.palette.mode]);
  
  return (
    <ChartContainer>
      <div ref={chartRef}></div>
      <div ref={tooltipRef}></div>
    </ChartContainer>
  );
};

export default SkillChart;