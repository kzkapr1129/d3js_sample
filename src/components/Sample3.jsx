import * as d3 from "d3";
import { useEffect, useRef } from "react";

const selectByIdOrAdd = (element, tag, id) => {
  let target = element.select(`#${id}`);
  if (target.node()) return target;
  target = element.append(tag).attr("id", id);
  return target;
}

export const Sample3 = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    const svg = d3.select(d3Container.current);
    svg
      .attr("width", "320")
      .attr("height", "240");

    let isFirstDraw = svg.node().children.length == 0;
    if (isFirstDraw) {
      let g = selectByIdOrAdd(svg, "g", "main-wrap");

      let data = [
        {x1: 10, y1: 10, x2: 310, y2: 230, color: "red"},
        {x1: 310, y1: 10, x2: 10, y2: 230, color: "blue"}
      ];

      g.selectAll("line")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", c => c.x1)
        .attr("y1", c => c.y1)
        .attr("x2", c => c.x2)
        .attr("y2", c => c.y2)
        .attr("stroke", c => c.color);
    }

  }, []);

  return (
    <div>
      <h3>this is Sample3</h3>
      <div>
        <svg
          ref={d3Container}
          />
      </div>
    </div>

  );
};