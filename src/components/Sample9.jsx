import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export const formatDate = (date, delimiter) => {
    return ("000" + date.getFullYear()).slice(-4) + delimiter + ("0" + (date.getMonth() + 1)).slice(-2) + delimiter + ("0" + date.getDate()).slice(-2);
};

export const formatTime = (date, delimiter) => {
    return ("0" + date.getHours()).slice(-2) + delimiter + ("0" + date.getMinutes()).slice(-2) + delimiter + ("0" + date.getSeconds()).slice(-2);
};

const appendXAxis = (svg, xScale, contentRect, xAxisHeight, ch) => {
    let width = contentRect.x2 - contentRect.x1;

    var axisx = d3.axisTop(xScale).ticks(5);
    let xaxisGroup = svg.select(`#xaxis-${ch}`);
    if (xaxisGroup.node() == null) {
        xaxisGroup = svg.append("g");
    }

    xaxisGroup.attr("id", `xaxis-${ch}`)
        .style("font-size", `${xAxisHeight - 8}px`)
        .attr("transform", "translate(" + 0 + "," + (ch*xAxisHeight) + ")")
        .call(axisx);

    d3.select(`#xaxis-${ch}`).select("path").attr("stroke", "gray");
}

const appendYAxis = (svg, yScale, contentRect, yAxisWidth, padding) => {
    let clientWidth = contentRect.x2 - contentRect.x1;
    var axisy = d3.axisLeft(yScale).ticks(10).tickSize(-clientWidth)
        .tickFormat(function(d,i) { return formatTime(new Date(d), ":") })

    let yaxisGroup = svg.select(`#yaxis`);
    if (yaxisGroup.node() == null) {
        yaxisGroup = svg.append("g");
        yaxisGroup.append("rect")
            .attr("id", "yaxis-rect");
    }

    yaxisGroup.attr("id", "yaxis")
        .style("font-size", `12px`)
        .attr("transform", "translate(" + (yAxisWidth + padding) + "," + 0 + ")")
        .call(axisy);

    d3.select("#yaxis").select("path").attr("stroke", "gray");
    d3.selectAll(".tick").select("line").attr("stroke", "gray")
}

const redraw = (d3Container, data) => {
    const padding = 6;
    const xAxisHeight = 20;
    const yAxisWidth = 60;
    const svg = d3.select(d3Container.current);
    const parentNode = svg.node().parentNode;
    const numChannels = data[0].temp.length;
    const contentRect = {x1: padding + yAxisWidth, y1: padding + (numChannels*xAxisHeight), x2: parentNode.clientWidth - padding, y2: parentNode.clientHeight - padding};
    const times = data.map(v => v.time);
    const timeMin = Math.min(...times);
    const timeMax = Math.max(...times);
    const yScale = d3.scaleLinear().domain([timeMin, timeMax]).range([contentRect.y2, contentRect.y1]);
    appendYAxis(svg, yScale, contentRect, yAxisWidth, padding);

    const colors = ["red", "blue", "green"];

    const drawLines = (ch) => {
        const temps = data.map(v => v.temp[ch]);
        const tempMin = Math.min(...temps);
        const tempMax = Math.max(...temps);
        const xScale = d3.scaleLinear().domain([/*tempMin*/-1, /*tempMax*/3]).range([contentRect.x1, contentRect.x2]);
        //const lineData = data.slice(1).map((v, i) => ({x2: data[i].temp[ch], y2: data[i].time, x1: v.temp[ch], y1: v.time}));

        appendXAxis(svg, xScale, contentRect, xAxisHeight, ch+1);

        let lineDataGroup = svg.select("#main").select(`#line-data-${ch}`);
        if (lineDataGroup.node() == null) {
            lineDataGroup = svg.select("#main").append("g").attr('id', `line-data-${ch}`);
        }

        var curveFunc = d3.line()
            .curve(d3.curveStepAfter)
            .x(function(d) { return xScale(d.temp[ch]) })
            .y(function(d) { return yScale(d.time) })

        if (lineDataGroup.select("#line-data").node() == null) {
            lineDataGroup.append("path").attr("id", "line-data");
        }

        lineDataGroup.select('#line-data')
            .attr('d', curveFunc(data))
            .attr('stroke', colors[ch % colors.length])
            .attr('fill', 'none')
            .attr('class', 'line')
            .on("mouseover", function() {
                d3.selectAll("#line-data").style("stroke-width", 2);
                d3.select(this).attr("r", 10).style("stroke-width", 10);
            })
            .on("mouseout", function() {
              //d3.select(this).attr("r", 10).style("stroke-width", 2);
            });
    };

    for (let ch = 0; ch < numChannels; ch++) {
        drawLines(ch);
    }
}

export const Sample9 = () => {
  const [seq, setSeq] = useState(0);
  const d3Container = useRef(null);
  const scaledValue = (v, v2) => {
    return Math.sin(seq + v+v2) * 0.5 + (v2*0.9);
  }

  const data = [...Array(10).keys()].map((v) => ({time: seq*1000 + v*1000, temp: [...Array(3).keys()].map(v2 => scaledValue(v, v2))}));

  d3.select(window).on("resize", () => {
    redraw(d3Container, data);
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      await new Promise(s => setTimeout(s, 500));
      if (mounted) setSeq(seq+1);
    })();

    // チャートの再描画
    redraw(d3Container, data);

    return () => {
        mounted = false;
    }
  }, [seq]);

  return (
    <div>
      <h3>this is Sample8</h3>
      <div style={{ width: "80%", height: "900px", background: "rgb(255, 255, 255)"}}>
        <svg ref={d3Container} height="100%" width="100%">
          <g id="main">
          </g>
        </svg>
      </div>
    </div>
  );
};