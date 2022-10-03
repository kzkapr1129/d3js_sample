import * as d3 from "d3";
import { useEffect, useRef } from "react";

const redraw = (d3Container) => {
  const svg = d3.select(d3Container.current);
  let node = svg.node();
  let parentNode = node.parentNode;

  let padding = 5;
  let contentRect = {x1: padding, y1: padding, x2: parentNode.clientWidth - padding, y2: parentNode.clientHeight - padding};

  var xScale = d3.scaleLinear().domain([-1, 1]).range([contentRect.x1, contentRect.x2]);
  var yScale = d3.scaleLinear().domain([-1, 1]).range([contentRect.y2, contentRect.y1]);

  let points = [...Array(100).keys()].map((v) => ({x: Math.random() * 2.0 - 1.0, y: Math.random() * 2.0 - 1.0}))

  // 既存の<rect>を選択する。
  let circles = svg.selectAll("circle").data(points);
  // 既存の<rect>と必要であれば追加で<rect>を作成する
  circles.enter().append("circle").merge(circles)
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("x-val", d => d.x)
    .attr("y-val", d => d.y)
    .attr("r", d => 2.6)
    .attr("fill", "blue")
    .attr("stroke", "blue")
    .on("mouseover", function(){
      d3.select(this) // マウスに重なった要素を選択
        .attr("fill", "rgb(255,0,255)");
      console.log("over");
    })
}

export const Sample7 = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    redraw(d3Container);

    d3.select(window).on("resize", () => {
      redraw(d3Container); 
    })
  }, []);

  return (
    <div>
      <h3>this is Sample7</h3>
      <div style={{ width: "80%", height: "300px", background: "rgb(200, 200, 200)"}}>
        <svg ref={d3Container} height="100%" width="100%"/>
      </div>
    </div>

  );
};