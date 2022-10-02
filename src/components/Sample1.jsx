import * as d3 from "d3";
import { useEffect, useRef } from "react";

const selectByIdOrAdd = (element, tag, id) => {
  let target = element.select(`#${id}`);
  if (target.node()) return target;
  target = element.append(tag).attr("id", id);
  return target;
}

export const Sample1 = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    const svg = d3.select(d3Container.current);
    svg
      .attr("width", "320")
      .attr("height", "240");

      let rect = selectByIdOrAdd(svg, "rect", "main");
      rect.attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "gray");

  }, []);

  return (
    <div>
      <h3>this is Sample1</h3>
      <div>
        <svg
          ref={d3Container}
          />
      </div>
    </div>
  );
};