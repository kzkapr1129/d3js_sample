import * as d3 from "d3";
import { useEffect, useRef } from "react";

const selectByIdOrAdd = (element, tag, id) => {
  let target = element.select(`#${id}`);
  if (target.node()) return target;
  target = element.append(tag).attr("id", id);
  return target;
}

export const Sample2 = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    const svg = d3.select(d3Container.current);
    svg
      .attr("width", "320")
      .attr("height", "240");

    let g = selectByIdOrAdd(svg, "g", "main-wrap");

    let rect = selectByIdOrAdd(g, "rect", "rect");
    rect.attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "gray");

    let line = selectByIdOrAdd(g, "line", "line");
    line.attr("x1", 10).attr("y1", 10).attr("x2", 310).attr("y2", 230).attr("stroke", "red");

  }, []);

  return (
    <div>
      <h3>this is Sample2</h3>
      <div>
        <svg
          ref={d3Container}
          />
      </div>
    </div>

  );
};