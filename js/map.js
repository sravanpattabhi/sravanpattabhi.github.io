(function (d3) {
    "use strict";

    //Map dimensions (in pixels)
    var margin = {
        top: -5,
        right: -5,
        bottom: -5,
        left: -5
    },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        centered,
        active = d3.select(null),
        stateData;

    var projection = d3.geo.albersUsa()
        .scale(1095.3314229136072)
        .translate([width / 2, height / 2]) //translate to center the map in view

    //Generate paths based on projection
    var path = d3.geo.path()
        .projection(projection);

    //police shootings scale
    var color = d3.scale.linear()
        .domain([2600, 11])
        .range(["red", "beige"]);

    //Create an SVG
    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", clicked);

    var b = d3_queue.queue();
    b.defer(d3.json, "us-info.json")
    b.defer(d3.csv, "frequency2.csv")
    b.await(plot);

    let selectedGroup = "All";

    var g = svg.append("g");


    var tooltip = d3.select("#map").append("div")
        .attr("class", "tooltip")
    tooltip.append('div')
        .attr('class', 'label');

    function plot(error, us, gundata) {
        if (error) throw error;

        g.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
            .enter().append("path")
            .attr("d", path)
            .on("click", clickedCounty)
            .attr("class", "county-boundary")
            .on("mouseout", function (d) {
                tooltip.style('display', 'none');
            })
            .on("mouseover", function (d) {
                tooltip.select('.label').html(d.properties.name);
                tooltip.style('display', 'block');
            });

        g.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", "lightgray")
            .on("click", clicked)
            .on("mouseout", function (d) {
                tooltip.style('display', 'none');
            })
            .on("mouseover", function (d) {
                tooltip.select('.label').html(d.properties.name);
                tooltip.style('display', 'block');
            });

        g.selectAll(".mark")
            .data(gundata)
            .enter()
            .append("circle")
            .attr("r", 2.5)
            .attr("fill", "red")
            .attr("class", "gundeaths")
            .attr("opacity", .4)
            .attr("class", "point")
            .attr("transform", function (d) {
                var proj = projection([d.lng, d.lat]);
                if (proj) {
                    return "translate(" + proj + ")";
                }
            }
            );
        d3.selectAll('span.TotalCount').text(12070);
    };

    function clicked(d) {
        if (active.node() === this) return reset();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = .9 / Math.max(dx / width, dy / height),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        g.transition()
            .duration(1000)
            .style("stroke-width", 1.5 / scale + "px")
            .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
        g.selectAll(".mark")
            .transition()
            .duration(1000)
            .attr("transform", function (d) {
                var t = d3.transform(d3.select(this).attr("transform")).translate;
                return "translate(" + t[0] + "," + t[1] + ")scale(" + 1 / scale + ")";
            })
    }

    function clickedCounty() {
        active.classed("active", false);
        clicked(stateData);
    }

    function reset() {
        active.classed("active", false);
        active = d3.select(null);

        g.transition()
            .duration(750)
            .style("stroke-width", "1.5px")
            .attr("transform", "");
        g.selectAll(".mark")
            .attr("transform", function (d) {
                var t = d3.transform(d3.select(this).attr("transform")).translate;
                return "translate(" + t[0] + "," + t[1] + ")scale(" + 1 + ")";
            });
    }

    var button_data = ['All', 'Males', 'Females']

    d3.select('#selectButton')
        .selectAll('myOptions')
        .data(button_data)
        .enter().append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })

    d3.select("#selectButton")
        .on("change", function (d) {
            var selectedOption = d3.select(this).property("value")
            //console.log(selectedOption)
            selectedGroup = selectedOption;
            reset();
            var a = d3_queue.queue();
            a.defer(d3.json, "us-info.json")
            a.defer(d3.csv, "frequency2.csv")
            a.await(updateplot);
        })


    function updateplot(error, us, gundata) {
        if (error) throw error;

    g.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("d", path)
        .on("click", clickedCounty)
        .attr("class", "county-boundary")
        .on("mouseout", function (d) {
            tooltip.style('display', 'none');
        })
        .on("mouseover", function (d) {
            tooltip.select('.label').html(d.properties.name);
            tooltip.style('display', 'block');
        });

    g.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", "lightgray")
        .on("click", clicked)
        .on("mouseout", function (d) {
            tooltip.style('display', 'none');
        })
        .on("mouseover", function (d) {
            tooltip.select('.label').html(d.properties.name);
            tooltip.style('display', 'block');
        });

    g.selectAll(".mark")
        .data(gundata.filter(function (d) {
            //console.log(d.selectedGroup)
            //console.log(selectedGroup)
            //console.log(d)
            if (selectedGroup == 'All') {
                //console.log(1)
                d3.selectAll('span.TotalCount').text(12070);
                return d;
            }
            else if (selectedGroup == 'Males') {
                //console.log(2)
                d3.selectAll('span.TotalCount').text(10153);
                return d.males > 0;
            }
            else {
                d3.selectAll('span.TotalCount').text(1850);
                return d.females > 0;
            }

        }))
        .enter()
        .append("circle")
        .attr("r", 2.5)
        .attr("fill", "red")
        .attr("class", "gundeaths")
        .attr("opacity", .4)
        .attr("class", "point")
        .attr("transform", function (d) {
            var proj = projection([d.lng, d.lat]);
            if (proj) {
                return "translate(" + proj + ")";
            }
        }
        );

    }

}) (window.d3);