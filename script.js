// Select the SVG and set up dimensions
const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

const margin = { left: 120, right: 50, top: 50, bottom: 90 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Load data from auto-mpg.csv
d3.csv('auto-mpg.csv').then(data => {
    // Format the data: convert horsepower and weight to numbers
    const processedData = data.map(d => ({
        horsepower: +d.horsepower,
        weight: +d.weight
    }))
    // Error checking
    console.log('Data not processed correctly', processedData);

    // Set the domains of the scales based on the data
    xScale.domain(d3.extent(processedData, d => d.horsepower)).nice();
    yScale.domain(d3.extent(processedData, d => d.weight)).nice();

    // Draw the chart
    drawChart(processedData);
});


// Create a group element to position the chart within the margins
const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
    
// Scales for the x-axis and y-axis
const xScale = d3   
    .scaleLinear()
    .range([0, innerWidth]);
// Scale for the y-axis
const yScale = d3
    .scaleLinear()
    .range([0, innerHeight]); // Flip the Y-axis

function drawChart(data) {

    // Create the x-axis
    const xAxis = d3
        .axisBottom(xScale)     
        .tickSize(-innerHeight);
    // Append the x-axis to the chart
    const xAxisGroup = g
        .append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);
    // Add a label to the x-axis
    xAxisGroup
        .append('text')
        .attr('class', 'labels')
        .attr('x', innerWidth / 2)
        .attr('y', 75) // Adjust for spacing
        .attr('text-anchor', 'middle').text('Horsepower');
    // Move tick text down further away from the axis
    xAxisGroup.selectAll('.tick text').attr('dy', '25');
    // Remove the domain line x-axis
    xAxisGroup.select('.domain').remove();
    
    // Create the y-axis
    const yAxis = d3
        .axisLeft(yScale)
        .tickSize(-innerWidth); // Extend tick lines across the chart for better grid visualization
    // Append the y-axis to the chart
    const yAxisGroup = g    
        .append('g')
        .call(yAxis);
    // Add a label to the y-axis
    yAxisGroup
        .append('text')
        .attr('class', 'labels')
        .attr('x', -innerHeight / 2)
        .attr('y', -95) // Adjust based on margin.left
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)') .text('Weight');
    // Move tick text down further away from the axis
    yAxisGroup.selectAll('.tick text').attr('dx', '-10') 
    // Remove the domain line x-axis
    yAxisGroup.select('.domain').remove();


    // Add a title to the chart 
    g.append('text')
        .attr('class', 'title')
        .attr('x', innerWidth / 2)
        .attr('y', -15)
        .attr('text-anchor', 'middle')
        .text('Cars: Horsepower vs Weight');

        

    // Add the circles for the scatter plot
    g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.horsepower))
        .attr('cy', d => yScale(d.weight))
        .attr('r', 10) // Radius of the circles
}
