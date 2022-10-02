import * as d3 from "d3";
import { useEffect, useRef } from "react";

const redraw = (d3Container) => {
  const svg = d3.select(d3Container.current);
  let node = svg.node();
  let parentNode = node.parentNode;

  let padding = 5;
  let data = [
    {x1: padding, y1: padding, x2: parentNode.clientWidth - padding, y2: parentNode.clientHeight - padding}
  ];
  console.log(data[0]);

  // 既存の<rect>を選択する。
  let rects = svg.selectAll("rect").data(data);
  // 既存の<rect>と必要であれば追加で<rect>を作成する
  rects.enter().append("rect").merge(rects)
    .attr("x", d => d.x1)
    .attr("y", d => d.y1)
    .attr("width", d => d.x2 - d.x1)
    .attr("height", d => d.y2 - d.y1)
    .attr("fill", "white")
    .attr("stroke", "blue");
}

export const Sample6 = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    redraw(d3Container);

    d3.select(window).on("resize", () => {
      redraw(d3Container); 
    })
  }, []);

  return (
    <div>
      <h3>this is Sample6</h3>
      <div style={{ width: "80%", height: "300px", background: "gray"}}>
        <svg ref={d3Container} height="100%" width="100%"/>
      </div>
    </div>

  );
};