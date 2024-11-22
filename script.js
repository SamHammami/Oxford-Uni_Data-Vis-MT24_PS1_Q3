// Select the SVG and set up dimensions
const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

const margin = { top: 50, right: 20, bottom: 60, left: 70 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Create a group element to position the chart within the margins
const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// Scales for the x-axis and y-axis
const xScale = d3.scaleLinear()
    .range([0, innerWidth]);

const yScale = d3.scaleLinear()
    .range([0, innerHeight]); // Flip the Y-axis


// Load data from auto-mpg.csv
d3.csv('auto-mpg.csv').then(data => {
    // Format the data: convert horsepower and weight to numbers
    const formattedData = data.map(d => ({
        horsepower: +d.horsepower,
        weight: +d.weight
    })).filter(d => !isNaN(d.horsepower) && !isNaN(d.weight)); // Filter out missing values


    // Set the domains of the scales based on the data
    xScale.domain(d3.extent(formattedData, d => d.horsepower)).nice();
    yScale.domain(d3.extent(formattedData, d => d.weight)).nice();

    // Draw the chart
    drawChart(formattedData);
});

function drawChart(data) {
    // Create the y-axis
    const yAxis = d3.axisLeft(yScale)
        .ticks(10) // Adjusted to have a similar number of tick marks
        .tickSize(-innerWidth); // Extend tick lines across the chart for better grid visualization

    const yAxisGroup = g.append('g').call(yAxis);

    // Style the y-axis tick lines
    yAxisGroup.selectAll('.tick line')
        .attr('stroke', '#d3d3d3'); // Light grey to match the reference output

    // Add the Y-axis label
    yAxisGroup.append('text')
        .attr('class', 'axis-label')
        .attr('x', -innerHeight / 2)
        .attr('y', -50) // Adjust based on margin.left
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .text('Weight');

    // Create the x-axis
    const xAxis = d3.axisBottom(xScale)
        .ticks(10) // Adjusted to ensure appropriate number of tick marks
        .tickSize(-innerHeight) // Extend tick lines across the chart for better grid visualization
        .tickFormat(d3.format(".0f")); // Removing decimals to match expected output

    const xAxisGroup = g.append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);

    // Style the x-axis tick lines
    xAxisGroup.selectAll('.tick line')
        .attr('stroke', '#d3d3d3'); // Light grey to match the reference output

    // Add the X-axis label
    xAxisGroup.append('text')
        .attr('class', 'axis-label')
        .attr('x', innerWidth / 2)
        .attr('y', 50) // Adjust for spacing
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text('Horsepower');

    // Add the circles for the scatter plot
    g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.horsepower))
        .attr('cy', d => yScale(d.weight))
        .attr('r', 10) // Radius of the circles
        .attr('fill', 'steelblue')
        .attr('opacity', 0.3); // Transparency for overlapping

}
