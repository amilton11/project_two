function makeResponsive() {

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// Read in cod_df
d3.csv("assets/js/merge_df.csv").then(function (waterData) {
    console.log(waterData);
    waterData.forEach(function (d) {
        d.unsafe_water_perct = +d.unsafe_water_perct;
        d.safe_water_2017 = +d.safe_water_2017;
    });

    var xScale = d3.scaleLinear()
        .domain([1, d3.max(waterData, d => d.safe_water_2017)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(waterData, d => d.unsafe_water_perct)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circles = chartGroup.selectAll("circle")
        .data(waterData)
        .enter();

    // Create Circles
    var myColor = d3.scaleSequential().domain([1, 10]).interpolator(d3.interpolateViridis);
    var circlesGroup = circles
        .append("circle")
        .attr("cx", d => xScale(d.safe_water_2017))
        .attr("cy", d => yLinearScale(d.unsafe_water_perct))
        .attr("r", "10")
        .attr("fill", function (d) { return myColor(d) })
        .attr("opacity", ".5")
        .on("click", function (d, i) {
            alert(`Hey! You clicked bar ${dataCategories[i]}!`);
        })
        // event listener for mouseover
        .on("mouseover", function () {
            d3.select(this)
                .attr("fill", "red");
        })
        // event listener for mouseout
        .on("mouseout", function () {
            d3.select(this)
                .attr("fill", "green");
        });



    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (code + '%');
        });

    chartGroup.call(toolTip);
    circlesGroup.on("click", function (data) {
        toolTip.show(data);
    })
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // Add country code
    circles.append("text")
        .text(d => d.code)
        .attr("dx", d => xScale(d.safe_water_2017))
        .attr("dy", d => yLinearScale(d.unsafe_water_perct) + 10 / 2.5)
        .attr("font-size", "7")
        .attr("class", "stateText");

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Water Source Variable");

    // Add labels    
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Population % Access to Clean Water");

    chartGroup.append('text')
        .attr('transform', `translate(${width / 2}, ${-5})`)
        .attr("class", "axisText")
        .text("Acces Type vs Access to Clean Water");

    console.log(waterData);

});

}

makeResponsive();
