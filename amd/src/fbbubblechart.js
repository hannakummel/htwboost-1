define(["jquery", 'theme_htwboost/d3', "exports"], function($, d3, exports) {
    var type = ["multichoicerated", "multichoice"];

    var xlab = [];
    var ylab = [];
    var xval = [];
    var toppadding = 150;

   function handleData(data) {
       if (data) {
           ylab = [];
           xlab = [];
           xval = [];

           rmax = 0;

           data.map(function(question) {
                var questiontitle = question.question.split(" ", 1);
                if (type.indexOf(question.typ) >= 0) {
                    var tmpCounter = {};
                    xlab = question.answerValues.map(function (arr) {
                        tmpCounter[arr[0]] = 0;
                        return arr[0];
                    });

                    question.answers.map(function(answer) {
                        tmpCounter[answer] += 1;
                    });
                    //
                    // ylab.push(question.label);

                    if (question.label !== ""){
                      ylab.push(question.label);
                    }else{
                      ylab.push(questiontitle);
                    }



                    question.answerValues.map(function(arr) {
                        // xval.push({
                        //     y: question.label,
                        //     x: arr[0],
                        //     r: tmpCounter[arr[0]]
                        // });
                        if (question.label !== ""){
                          xval.push({
                              y: question.label,
                              x: arr[0],
                              r: tmpCounter[arr[0]]
                          });
                        }else{
                          // var questiontitle = question.question.split(" ", 1);
                          xval.push({
                              y: questiontitle,
                              x: arr[0],
                              r: tmpCounter[arr[0]]
                          });
                        }

                        rmax = rmax > tmpCounter[arr[0]] ? rmax : tmpCounter[arr[0]];
                    });
                }
           });
        }
    }

    function setFraming(svg) {
        var yAxisBox = svg.node().getBBox();
        var chartHeight = yAxisBox.height + toppadding;
        $("#feedback_analysis").height(Math.floor(chartHeight));
    }

    function renderChart(svg, data) {
        handleData(data);

        svg.selectAll("*").remove();

        var height = 30 * ylab.length;
        var width =  $("#feedback_analysis").width()/2 - toppadding;

        var y = d3.scaleBand()
                  .range([2, height*1.5]);

                 // .padding(0.1);
        var x = d3.scaleLinear()
                  .range([0, width]);
        var r = d3.scaleLinear()
                .range([0, height/(2*ylab.length)]);

        r.domain([0, rmax]);
        y.domain(ylab);
        x.domain([d3.min(xlab) - 1, d3.max(xlab)]);

        var gr = svg.append("g")
                    .attr("transform", "translate(180,20)");

        gr.selectAll(".circle")
          .data(xval)
          .enter()
          .append("circle")
          .attr("class", "fb-circle")
          .attr("cx", function(d) { return x(d.x); })
          .attr("cy", function(d) { return y(d.y) + y.bandwidth(); })
          .attr("r",  function(d) { return r(d.r); })
          .exit()
          .remove();

        // add the x Axis
        gr.append("g")
            .attr("id", "x-axis")
            //.attr("transform", "translate(0,0)")
            .call(d3.axisTop(x).ticks(xlab.length))
            .style("font-size",12);

        // add the y Axis
        gr.append("g")
            .attr("id", "y-axis")
            .call(d3.axisLeft(y))
            .style("font-size",12);
          // .selectAll(".tick text")
          //   .call(wrap, y.rangeBand());

        setFraming(svg);
    }

    function chartFactory(svg) {
        return function (data) {
            renderChart(svg, data);
        };
    }


    exports.renderChart = chartFactory;
});
