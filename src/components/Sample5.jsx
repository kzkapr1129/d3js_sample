import * as d3 from "d3";
import { useEffect, useRef } from "react";

export const Sample5 = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    const svg = d3.select(d3Container.current);
    let parentNode = svg.node().parentNode;
    console.log(`svg size: (${parentNode.clientWidth}, ${parentNode.clientHeight})`);

    // <svg>の大きさを自動で計算(親のサイズと同じにする)
    svg.attr("width", parentNode.clientWidth).attr("height", parentNode.clientHeight);
    
    let data = [
      {x: "10", y: "10", width: "50", height: "50"},
      {x: "25", y: "25", width: "50", height: "50"}
    ];

    // 既存の<rect>を選択する。
    let rects = svg.selectAll("rect").data(data);
    // 既存の<rect>と必要であれば追加で<rect>を作成する
    rects.enter().append("rect")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", d => d.width)
      .attr("height", d => d.height)
      .attr("fill", "blue");

  }, []);

  return (
    <div>
      <h3>this is Sample5</h3>
      <div style={{ width: "80%", height: "80%", background: "gray"}}>
        <svg ref={d3Container}/>
      </div>
    </div>

  );
};