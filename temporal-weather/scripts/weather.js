d3.json("data/yrweather.json", function (error, data) {
    weather = data;

    //set size of drawing
    var width = 800,
        height = 850,
        radius = Math.min(width, height) / 2 - 60;

    var padding = 15;

    // select my html tag and append an svg to set up drawing
    var svg = d3.select("#weather-radial-plot").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g") //append group element so that all elements move with this svg 
        .attr("transform", "scale(" + 0.9 + ") translate(" + width / 1.8 + "," + height / 1.7 + ")"); //shift vis so it's in the center of my draw frame I created 

    //create degrees variable
    var degree = d3.scaleLinear()
        .domain([-20, 45])
        .range([0, radius]);

    var rainfall = d3.scaleLinear()
        .domain([-20, d3.max(weather, function (d) {
            return d.RR
        })])
        // .domain([0.0, 110.0])
        .range([0, radius])

    // create the temp circle lines
    var degreeAxis = svg.append("g")
        .attr("class", "axis degree")
        .selectAll("g")
        .data(degree.ticks(5).slice(1)) // show 5 lines, start with 2nd element in range defined (i.e., 0 degrees)
        .enter().append("g");

    // draw the temp circle lines
    degreeAxis.append("circle")
        .attr("r", degree);

    // draw a white rectangle on each line to create the block for where my text goes
    degreeAxis.append("rect")
        .attr("width", function (d) {
            return 20; // define the width of the rectangle
        })
        .attr("height", function (d) {
            return 10; // define the height of the rectangle
        })
        .attr("y", function (d) {
            return -degree(d) - 5; //define the y position of this rectangle
        })
        .attr("x", function (d) {
            return -10; //define the x position of this rectangle
        });

    // write temperature text on top of the rectangles I drew previously    
    degreeAxis.append("text")
        .attr("y", function (d) {
            return -degree(d) + 4;
        })
        .style("text-anchor", "middle")
        .text(function (d) {
            return d + "°";
        });

    // set time variable to bring in entire year range of interest and map to circle
    var time = d3.scaleTime()
        .domain([new Date(2000, 0, 1), new Date(2009, 12, 31)])
        .range([-90, 240]);

    var year = time.ticks(d3.timeYear);

    var timeMonth = d3.scaleTime()
        .domain([new Date(2000, 0, 1), new Date(2000, 11, 31)])
        .range([-90, 270]);

    var timeDay = d3.scaleTime()
        .domain([new Date(2000, 0, 1), new Date(2000, 11, 31)])
        .range([-90, 270]);

    var months = timeMonth.ticks(d3.timeMonth); //restrict the months only to the months from one calendar year in the date range I've selected 

    //// THIS FUNCTION WORKS BUT I ONLY RETURN A SINGLE YEAR, so this is not useful
    // function  filterYear(d, i) {
    //     var yearSplit = d.Date.split(".")[2];
    //     return yearSplit == 2001; // TODO this function will set up a filter by year, but I need to make this more general so is iterating over each year by selected element
    // };


    // YEAR AXIS
    //get data for the year axis
    var yearAxis = svg.append("g")
        // .attr("class", "axis year")
        .selectAll("g")
        .data(year)
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "rotate(" + time(d) + ") translate(" + (radius + 70) + ")";
        });

    //draw circle that represents data year
    yearAxis.append("circle")
        .attr("r", 30)
        .style("fill", "#98D7D1")
        .on("mouseover", onMouseOver); //this function will filter data by the associated year circle hover

    //draw year text on the circle
    yearAxis.append("text")
        .attr("transform", function (d, i) {
            d = time(d);
            return d < 270 && d > 90 ? "rotate(180 " + (8) + ",0)" : null;
        })

        // TODO: this code moves everything AND kills my rotation I set above, needs a fix
        // .attr("transform", function(scoot) {
        //     d = time(scoot);
        //     return d > 270 && d < 90 ? "translate(" + (-15) + ")": null;
        // }) 

        .text(function (d) {
            return d.getFullYear()
        })
        .attr("class", "year-font");

    // MONTH AXIS
    // draw radial month axis with labels
    var monthAxis = svg.append("g")
        .attr("class", "axis month")
        .selectAll("g")
        .data(months)
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "rotate(" + timeMonth(d) + ")";
        });

    //draw month axis lines
    monthAxis.append("line")
        .attr("x2", radius);

    // draw month text around outside of plot
    monthAxis.append("text")
        .attr("x", radius)
        .attr("dy", ".25em")
        .attr("transform", function (monthLabel) {
            d = timeMonth(monthLabel);
            return d < 270 && d > 90 ? "rotate(180 " + (radius + 10) + ",0)" : null;
        })
        .text(function (d) {
            return moment(d).format("MMM")
        });

    // PLOT OF DAILY AVERAGE TEMP AND RAINFALL
    var rainPlot = svg.append("g")
        .attr("class", "day")
        .selectAll("g")
        // .data(weather.filter((weather) => filterYear(weather))) // this sets up to filter by only 2001, as defined by function above
        .data(weather) // this line includes all year data! 
        .enter().append("g")
        .attr("transform", function (day, i) {
            var date = day.Date.split(".");
            var myDate = new Date(date[2], date[1] - 1, date[0])
            return "rotate(" + timeDay(myDate) + ") translate(" + degree(day.TAM) + ")";
        });


    // Rain circles  
    rainPlot.append("circle")
        .attr("r", function (d) {
            return Math.abs(d.RR) //set to absolute value IMPORTANT because negative values jack this all up
        })
        .attr("class", "rain")
        .append("title")
        .text(function (d) {
            return "The rainfall on " + d.Date + " was " + d.RR + " mm";
        });

    // DAILY AVG TEMP PLOT    
    // this is an exact repeat of the rainPlot variable but for some reason I need to have it here again to make the visuals show the way I want them to
    var dayPlot = svg.append("g")
        .attr("class", "day")
        .selectAll("g")
        .data(weather) 
        .enter().append("g")
        .attr("transform", function (day, i) {
            var date = day.Date.split(".");
            var myDate = new Date(date[2], date[1] - 1, date[0])
            return "rotate(" + timeDay(myDate) + ") translate(" + degree(day.TAM) + ")";
        });

    // AVG TEMP CIRCLE
    dayPlot.append("circle")
        .attr("r", 3)
        .attr("class", "mean-temp")
        .append("title")
        .text(function (d) {
            return "The average temperature on " + d.Date + " was " + d.TAM + " degrees";
        });
    
    // INTERACTION: FILTERING BY YEAR HOVER
    function onMouseOver(selectedYearBubble) {
        var selectedYear = selectedYearBubble.getFullYear();
        // filter data
        // rerender
        d3.selectAll(".mean-temp") // select all of my mean temperature circles (select by the class)
            .style("visibility", "hidden") //start all as hidden
            .filter(function (d) {
                var year = d.Date.split(".")[2];
                if (selectedYear == year) return true
                else return false
            })
            .style("visibility", "visible") // if true, then make the stuff that matches visible
        d3.selectAll(".rain") // select all circles associated with css class "rain"
            .style("visibility", "hidden")
            .filter(function (d) {
                var year = d.Date.split(".")[2];
                if (selectedYear == year) return true
                else return false
            })
            .style("visibility", "visible") // if true, then make all matching elements visible
    };



});