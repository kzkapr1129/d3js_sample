import * as d3 from "d3";
import { useEffect, useRef } from "react";

const redraw = (d3Container) => {
  //const svg = d3.select(d3Container.current);
  //let node = svg.node();
  //let parentNode = node.parentNode;

  //let padding = 5;
  //let contentRect = {x1: padding, y1: padding, x2: parentNode.clientWidth - padding, y2: parentNode.clientHeight - padding};

  //let xrange = [0.3234, 0.1234];

  const makeScaleMaterial = (array) => {
    const min = array.reduce((a, b) => Math.min(a, b));
    const max = array.reduce((a, b) => Math.max(a, b));

    const calcMaxIntDigitMask = (v) => {
      if (!v || v === "0") return 0;
      let reg = v.match(/^0+/);
      let correction = reg ? v.length - reg[0].length - 1: v.length - 1;
      return Math.pow(10, correction);
    }

    const calcMaxDecimalDigitMask = (v) => {
      if (!v || v === "0") return 0;
      // 小数点の最大桁数をマスクする値を返却する
      let reg = v.match(/^0+/);
      let correction = reg ? reg[0].length + 1 : 1;
      return 1.0 / Math.pow(10, correction);
    }

    const makeScaleMaterialImpl = (v) => {
      const absValue = Math.abs(v);
      // 目盛りを作成するための材料となる値を計算する
      const valueComponents = v.toString().split(".");
      switch (valueComponents.length) {
        // 空文字の場合
        case 0: return {maxDigitMask: 0};
        // 整数値、または整数値を省略した小数 例) .123
        case 1: {
          if (absValue < 1) {
            // 指定数値が0~1の場合
            let maxDigitMask = calcMaxDecimalDigitMask(valueComponents[0]);
            return {maxDigitMask};
          }
          let maxDigitMask = calcMaxIntDigitMask(valueComponents[0]);
          return {maxDigitMask};
        }
        // 整数値+少数の場合
        case 2: {
          if (v < 1) {
            // 指定数値が0~1の場合
            let maxDigitMask = calcMaxDecimalDigitMask(valueComponents[1]);
            return {maxDigitMask};
          }
          // 1以上の場合は整数のみを対象とする
          let maxDigitMask = calcMaxIntDigitMask(valueComponents[0]);
          return {maxDigitMask};
        }
        default:
          return {maxDigitMask: 0};
      }
    };
    return {...{min, max}, ...makeScaleMaterialImpl(max-min)};
  };

  const countDecimalDigit = (v) => {
    let valueComponents = v.toString().split(".");
    switch (valueComponents.length) {
      case 0: return 0;
      case 1: return (v < 0) ? valueComponents[0].length : 0;
      case 2: return valueComponents[1].length;
      default: return 0;
    }
  }

  try {
    let scaleMaterial = makeScaleMaterial([13.5, 13.71]);
    let scaleStart = parseInt(scaleMaterial.min / scaleMaterial.maxDigitMask, 10) * scaleMaterial.maxDigitMask;
    let scaleEnd   = parseInt(scaleMaterial.max / scaleMaterial.maxDigitMask, 10) * scaleMaterial.maxDigitMask;
    let numScale = Math.ceil((scaleEnd - scaleStart) / scaleMaterial.maxDigitMask) + 1;
    let fixedParam = countDecimalDigit(scaleMaterial.maxDigitMask);
    let scale = [...Array(numScale).keys()].map((v) => (scaleStart + v * scaleMaterial.maxDigitMask).toFixed(fixedParam));
    console.log(scaleMaterial.maxDigitMask, fixedParam, scale);
  } catch {

  }
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