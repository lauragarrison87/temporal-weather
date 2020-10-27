// color palette src: https://theultralinx.com/2019/03/designer-creates-beautiful-flat-colour-palettes-that-you-can-use-in-your-next-project/

var weather; // declare my global variable

d3.json("data/yrweather.json", function (error, data) {

    weather = data; // assign my global variable to my data

    //Function for converting JSON values from strings to Dates and numbers

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // SET UP FOR ANNUAL TEMP RANGE CHART
    var wTempRange = 800, //set chart width
        hTempRange = 450; // set chart height

    var svg = d3.select("#temp-range-year-chart")   // set up framing for my chart
        .append("svg")
        .attr("width", wTempRange)
        .attr("height", hTempRange);

    var padding = 30; // keep my stuff from getting clipped!
    var paddingLeft = 50;

    var tempScale = d3.scaleLinear()   // define the horizontal scaling for my chart
        // .domain([-20, d3.max(weather, function(d) {
        //     return d.TAM
        // })])
        .domain([-15, 30])
        .range([paddingLeft, wTempRange - paddingLeft])
        .nice()

    var yearScale = d3.scaleLinear() // define vertical scaling for my chart
        .domain([2000, 2010])
        .range([hTempRange - padding - 20, padding]);

    var precipType = d3.scaleOrdinal()
        .domain([-1, 0, 1, 2])
        .range(['#ECECEC', '#F26627', '#98D7D1', '#325D79']);

    var tempCircles = svg.selectAll("g") // variable to easily reference all of my circle elements later
        .data(weather) // bind my data to each element
        .enter() // return element placeholder
        .append("g");

    tempCircles.append("circle") // add circle SVG object to the DOM at end of each svg element I have just created
        .attr("cx", function (d) {
            var temp = d.TAM
            return tempScale(temp);
        })
        .attr("cy", function (d) {
            var year = d.Date.split(".")[2]
            return yearScale(year);
        })
        .attr("r", 5)
        .attr("stroke", function (d) {
            var precip = d.SLAG
            return precipType(precip);
        })
        .attr("class", "circles")
        .append("title")
        .text(function (d) {
            return "The average temperature on " + d.Date + " was " + d.TAM + " degrees"; //IF TIME can I fix my function below so I read in prettier dates?
        });


    // Draw x axis
    var xAxisTemp = d3.axisBottom(tempScale);

    svg.append("g")
        .attr("class", "axis degree text path")
        .attr("transform", "translate(0," + (hTempRange - padding - 5) + ")")
        .call(xAxisTemp);

    // add x axis label
    svg.append("text") 
        .attr("transform", "translate(" + (wTempRange/2) + " ," + (hTempRange - 5) + ")")
        .attr("class", "label")
        .text("Degrees Celsius");

    // Draw y axis   
    var yAxisTemp = d3.axisLeft(yearScale)
        .tickFormat(d3.format("d"));

    svg.append("g")
        .attr("class", "axis degree text path")
        .attr("transform", "translate(" + (padding + 20) + ",0)")
        .call(yAxisTemp);

    // add y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", (padding / 4))
      .attr("x", -(hTempRange / 2))
      .attr("class", "label")
      .text("Year"); 

    // //FUNCTION: READ IN MY TIME NICER   ***THIS IS NOT WORKING RIGHT NOW***
    // function timeNice (nicer, i) {
    //     var split = nicer.Date(".");
    //     var mytimeSplit = new Date(split[1], split[0], split[2]);
    //     var mytimeWords = d3.timeFormat("%B %d, %Y");
    //     return mytimeWords(mytimeSplit);
    // }



});









    /////////////////////////////////////////////////////////////////////////////////////////
    // SETUP FOR ANNUAL RAINFALL BY DAY CHART -- THIS IS A BONUS PIECE 
//     var w = 600, //set canvas width
//         h = 600; // set canvas height

//     var svg = d3.select("#date-rainfall-chart")
//         .append("svg")
//         .attr("width", w)
//         .attr("height", h);

//     var tempCircles = svg.selectAll("circle") // variable to easily reference all of my circle elements later
//         .data(weather) // bind my data to each element
//         .enter() // return element placeholder
//         .append("circle"); // add circle SVG object to the DOM at end of each svg element I have just created

//     // define a function that will take each index item position, set spacing between index items and add a little offset
    // function formula(i, step, offset) {
    //     return (i * step) + offset;
    // }

//     tempCircles.attr("cx", function (d, i) { // position circle center balong x axis based on the date (day)
//         var day = d.Date.split(".")[0] //split date variable and take the first position from this array, which corresponds to the date
//         return formula(day, w / 33, 10);
//     })
//         .attr("cy", function (d, i) {   // position circle along y axis based on amount of rainfall
//             var rainfall = d.RR
//             return formula(-rainfall, h / 100, h - 30);
//         })
//         .attr("r", function (d) {   // set circle radius by the average temperature
//             return Math.abs(d.TAM) / 2 // give radius of average temperature divided by 2 to keep it small
//         })
//         .attr("class", "temp-circles");
// });