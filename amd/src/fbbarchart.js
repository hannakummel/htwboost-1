define(["jquery", 'theme_htwboost/d3', "exports"], function($, d3, exports) {
    var type = ["multichoicerated"];
    // x und y lab=label
    var xlab = {};
    var ylab = [];

    // xval ist value geht über id
    var xval = [];
    var xid = [];

   function handleData(data) {
       if (data) {
           ylab = [];
           xlab = [];
           xval = [];

            data.map(function(question, position) {

                if (type.indexOf(question.typ) >= 0) {
                    ylab = question.answerValues.map(function (arr) {
                        return arr[0];
                    });

                    var min = d3.min(ylab) - 1;
                    var objekt = {
                      x: position + 1,
                      y: d3.mean(question.answers) || min,
                      label: question.label || "",
                      title: question.question
                    };
                    objekt.x = objekt.x + ". " + objekt.label;
                    xval.push(objekt);
                    xlab.push(objekt.x);
                }
            });
        //     console.log("xval");
        //     console.log(xval);
        // }
    }

    function setFraming(svg) {
        var yAxisBox = svg.node().getBBox();
        var chartHeight = yAxisBox.height + 10;
        var chartWidth = yAxisBox.width + 10;
        var relheight = chartHeight / chartWidth;
        svg.attr("viewBox", "0 0 " + chartWidth + " " + chartHeight);
        $("#feedback_analysis").height(Math.floor(100 * relheight));
    }

    function renderChart(svg, data) {
        handleData(data);
        // console.log(data);

        svg.selectAll("*").remove();

        var height = 300;
        var width =  $("#feedback_analysis").width() - 50 ;
        var padding = 10;

        var x = d3.scaleBand()
                  .range([0, width])
                  .padding(0.1);
        var y = d3.scaleLinear()
                  .range([height, 0]);
        //x.domain ist wertebereich der x-achse
        x.domain(xlab);
        y.domain([d3.min(ylab) - 1, d3.max(ylab)]);

        var gr = svg.append("g")
           .attr("transform",
                 "translate(20,4)");

          // Define the div for the tooltip
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

         gr.selectAll(".bar")
           .data(xval)
           .enter()
           .append("rect")
           .attr("class", "bar")
           .attr("x", function(d) { return x(d.x); })
           .attr("width", x.bandwidth())
           .attr("y", function(d) { return y(d.y); })
           .attr("height", function(d) { return height - y(d.y); })
           .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            // div	.html(x(d.x) + "<br/>"  + d.close)
            div	.html(d.title + "<br/>")
                // .style("background-color", "red")
                // .style("height", "100%")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(900)
                    .style("opacity", 0);
            });

          // add the x Axis
          gr.append("g")
              .attr("question", "x-axis")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x))

          gr.selectAll("g text")  // select all the text elements for the xaxis
            .style("text-anchor", "end")
            .style("font-size",16)
            .attr("transform", function(d) {
              return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-25)";
            })
            .style("font-size",16);

          // gr.append("text")
          //   .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
          //   .attr("transform", "translate("+ (width/2) +","+(height+(padding*))+")")  // centre below axis
          //   .style("font-weight", 900)
          //   .text("Fragen");

          // add the y Axis
          gr.append("g")
              .attr("id", "y-axis")
              .style("font-size",14)
              .call(d3.axisLeft(y).ticks(ylab.length));


          setFraming(svg);
    }

    function chartFactory(svg) {
        return function (data) {
            renderChart(svg, data);
        };
    }

    exports.renderChart = chartFactory;
});
