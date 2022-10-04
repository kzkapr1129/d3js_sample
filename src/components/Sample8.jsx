import * as d3 from "d3";
import { useEffect, useRef } from "react";

const redraw = (d3Container) => {
  const svg = d3.select(d3Container.current);
  let node = svg.node();
  let parentNode = node.parentNode;

  let padding = 5;
  let contentRect = {x1: padding, y1: padding, x2: parentNode.clientWidth - padding, y2: parentNode.clientHeight - padding};

  let xrange = [0.3234, 0.1234];

  // 10   => 1
  // 1    => 0.1
  // 20   => 1
  // 33   => 1
  // 0.2  => 0.01
  // 0.02 => 0.001

  const getScale2 = (array) => {
    const min = array.reduce((a, b) => Math.min(a, b));
    const max = array.reduce((a, b) => Math.max(a, b));
    const  minorScaleSpan = ((v) => {
      const vcompoents = v.toString().split(".");
      switch (vcompoents.length) {
      // 整数と小数点で分割できない時
      case 0: return 0;

      // 整数部だけ分割できた時
      case 1: {
        if (0 > v) {
          // 整数のみと判断したにも関わらず1未満の場合(".1"とか)
          throw {errMsg: `invalid number: ${v}`};
        }
        return Math.pow(10, vcompoents[0].length-1) / 10;
      }

      // 整数部と少数部を分割できたとき
      case 2: {
        if (vcompoents[0] === '0') {
          // 整数が0、小数点以下が0ではない場合
          let reg = vcompoents[1].match(/^0+/);
          let correction = reg ? reg[0].length + 2 : 2;
          return 1.0 / Math.pow(10, correction);
        }
        return Math.pow(10, vcompoents[0].length-1) / 10;
      }

      // それ以外の場合
      default:
        throw {errMsg: `invalid number: ${v}`};
      }
    })(max-min);

    let countDecimalDigit = (v) => {
      const vcompoents = v.toString().split(".");
      switch (vcompoents.length) {
        case 0: return 0;
        case 1: return v < 0 ? vcompoents[0].length : 0;
        case 2: return vcompoents[1].length;
        default:
          throw {errMsg: `invalid number: ${v}`};
      }
    };

    let makeScales = (min, max, scaleSpan) => {
      let scaleStart = parseInt(min / scaleSpan, 10) * scaleSpan;
      let scaleEnd   = parseInt(max / scaleSpan, 10) * scaleSpan;
      let numScale = parseInt((scaleEnd - scaleStart) / scaleSpan);
      return [...Array(numScale+2).keys()].map(v => (scaleStart + scaleSpan * v).toFixed(countDecimalDigit(scaleSpan)));
    };
    const majorScaleSpan = minorScaleSpan * 10;
    return [makeScales(min, max, majorScaleSpan), makeScales(min, max, minorScaleSpan)];
  };


  let val = 0.1;
  console.log(`${val}: `, getScale2([12.123, 13.0]));


  let xScale = d3.scaleLinear().domain([xrange[0], xrange[1]]).range([contentRect.x1, contentRect.x2]);
  let yScale = d3.scaleLinear().domain([-1, 1]).range([contentRect.y2, contentRect.y1]);
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
        <svg ref={d3Container} height="100%" width="100%"/>
      </div>
    </div>

  );
};