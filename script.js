// Select the SVG and set dimensions
const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

// Set margins for the chart area
const margin = { top: 50, right: 20, bottom: 50, left: 70 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Create group element to apply margins
const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Load CSV data
d3.csv('auto-mpg.csv').then(data => {
    // Parse and clean data
    data.forEach(d => {
        d.horsepower = +d.horsepower; // Convert horsepower to number
        d.weight = +d.weight; // Convert weight to number
    });

    // Define scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.horsepower)) // Min and max for x
        .nice()
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.weight)) // Min and max for y
        .nice()
        .range([innerHeight, 0]); // Invert y-axis

    // Define axes
    const xAxis = d3.axisBottom(xScale).tickSize(-innerHeight);
    const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);

    // Add X axis
    // g.append('g')
    //     .call(xAxis)
    //     .attr('transform', `translate(0, ${innerHeight})`)
    //     .append('text')
    //     .attr('class', 'axis-label')
    //     .attr('x', innerWidth / 2)
    //     .attr('y', 40)
    //     .attr('fill', 'black')
    //     .text('Horsepower');
    
    xAxisGroup.append('text')
        .attr('class', 'axis-label')
        .attr('x', innerWidth / 2)
        .attr('y', 40) // Distance from the axis
        .attr('fill', 'black')
        .text('Horsepower');
      

    // Add Y axis
    g.append('g')
        .call(yAxis)
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', -innerHeight / 2)
        .attr('y', -50)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Weight');

    // Add scatter plot circles
    g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.horsepower))
        .attr('cy', d => yScale(d.weight))
        .attr('r', 10)
        .attr('fill', 'steelblue')
        .attr('opacity', 0.3);

    // Add chart title
    g.append('text')
        .attr('class', 'title')
        .attr('x', innerWidth / 2)
        .attr('y', -10)
        .text('Cars: Horsepower vs Weight');
});
