import * as d3 from "d3";
import { useEffect, useRef } from "react";

export const Sample4 = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    const svg = d3.select(d3Container.current);
    svg
      .attr("width", "320")
      .attr("height", "240");

      let data1 = [
        {x1: 10, y1: 10, x2: 310, y2: 10, color: "red"},
        {x1: 10, y1: 20, x2: 310, y2: 20, color: "red"}
      ];

      let data2 = [
        {x1: 10, y1: 30, x2: 310, y2: 30, color: "blue"},
        {x1: 10, y1: 40, x2: 310, y2: 40, color: "blue"}
      ];

      let data3 = [
        {x1: 10, y1: 50, x2: 310, y2: 50, color: "purple"}
      ];

      let lines1 = svg.select("#g1").selectAll("line");

      // 既存の<line>にdata[0]を適用する。data[1]は作成しない
      lines1.data(data1).attr("x1", d => d.x1).attr("y1", d => d.y1).attr("x2", d => d.x2).attr("y2", d => d.y2).attr("stroke", d => d.color);

      // 既存の<line>にdata[0]を適用し、さらに新規<line>を追加してdata[1]を適用する。
      let lines2 = svg.select("#g2").selectAll("line").data(data2);
      lines2.enter().append("line").merge(lines2).attr("x1", d => d.x1).attr("y1", d => d.y1).attr("x2", d => d.x2).attr("y2", d => d.y2).attr("stroke", d => d.color);

      // 既存の<line>の一つ目にdata[0]を適用し、それ以外の既存<line>はそのままにする(dataの個数が1コのため)
      let lines3 = svg.select("#g3").selectAll("line").data(data3);
      lines3.enter().append("line").merge(lines3).attr("x1", d => d.x1).attr("y1", d => d.y1).attr("x2", d => d.x2).attr("y2", d => d.y2).attr("stroke", d => d.color);


  }, []);

  return (
    <div>
      <h3>this is Sample4</h3>
      <div>
        <svg ref={d3Container}>
          <g id="g1">
            <line x1="10" y1="10" x2="310" y2="10" stroke="green"/>
          </g>
          <g id="g2">
            <line x1="10" y1="210" x2="310" y2="210" stroke="green"/>
          </g>
          <g id="g3">
          <line x1="10" y1="180" x2="310" y2="180" stroke="green"/>
            <line x1="10" y1="190" x2="310" y2="190" stroke="green"/>
            <line x1="10" y1="200" x2="310" y2="200" stroke="green"/>
          </g>
        </svg>
      </div>
    </div>

  );
};