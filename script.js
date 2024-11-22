// Define dimensions and margins
const width = 960;
const height = 500;
const margin = { top: 20, right: 30, bottom: 50, left: 60 };

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Select SVG and create a group for the chart
const svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);

const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Load data
d3.csv('auto-mpg.csv').then(data => {
    // Parse data
    data.forEach(d => {
        d.mpg = +d.mpg; // Convert mpg to number
        d.horsepower = +d.horsepower; // Convert horsepower to number
    });

    // Define scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.horsepower)) // Calculate min and max
        .nice() // Round limits
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.mpg))
        .nice()
        .range([innerHeight, 0]); // Invert to match SVG coordinates

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`)
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 40)
        .attr('fill', 'black')
        .text('Horsepower');

    g.append('g')
        .call(yAxis)
        .append('text')
        .attr('x', -innerHeight / 2)
        .attr('y', -40)
        .attr('fill', 'black')
        .text('MPG')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle');

    // Add circles
    g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.horsepower))
        .attr('cy', d => yScale(d.mpg))
        .attr('r', 10) // Fixed radius
        .attr('fill', 'steelblue')
        .attr('opacity', 0.3); // Fixed opacity
});
