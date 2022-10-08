import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { makeScaleData, makeScaleMaterial } from "./scaleMaker";

const redraw = (d3Container) => {
  const svg = d3.select(d3Container.current);
  let node = svg.node();
  let parentNode = node.parentNode;

  let padding = 5;
  let contentRect = {x1: padding, y1: padding, x2: parentNode.clientWidth - padding, y2: parentNode.clientHeight - padding};
  let xScale = d3.scaleLinear().domain([-1, 1]).range([contentRect.x1, contentRect.x2]);
  let yScale = d3.scaleLinear().domain([-1, 1]).range([contentRect.y2, contentRect.y1]);

  let scaleMaterial = makeScaleMaterial([-1, 1]);
  let majorScaleData = makeScaleData(scaleMaterial.min, scaleMaterial.max, scaleMaterial.maxDigitMask);
  let mainorScaleData = makeScaleData(scaleMaterial.min, scaleMaterial.max, scaleMaterial.maxDigitMask/10);
  mainorScaleData = mainorScaleData.filter(v => !majorScaleData.includes(v));

  let mainorScales = svg.select("#scale-bar").select("#scale-minor").selectAll("line").data(mainorScaleData);
  mainorScales.enter().append("line").merge(mainorScales)
    .attr("x1", d => xScale(d))
    .attr("y1", yScale(-1))
    .attr("x2", d => xScale(d))
    .attr("y2", yScale(-0.9))
    .attr("stroke", "black");

  let majorScales = svg.select("#scale-bar").select("#scale-major").selectAll("line").data(majorScaleData);
  majorScales.enter().append("line").merge(majorScales)
    .attr("x1", d => xScale(d))
    .attr("y1", yScale(-1))
    .attr("x2", d => xScale(d))
    .attr("y2", yScale(-0.8))
    .attr("stroke", "red");
}

export const Sample8 = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    redraw(d3Container);

    d3.select(window).on("resize", () => {
      redraw(d3Container);
    })
  }, []);

  return (
    <div>
      <h3>this is Sample8</h3>
      <div style={{ width: "80%", height: "300px", background: "rgb(200, 200, 200)"}}>
        <svg ref={d3Container} height="100%" width="100%">
          <g id="scale-bar">
            <g id="scale-minor"/>
            <g id="scale-major"/>
          </g>
        </svg>
      </div>
    </div>

  );
};