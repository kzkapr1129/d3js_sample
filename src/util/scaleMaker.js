export const makeScaleMaterial = (array) => {
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

export const makeScaleData = (min, max, digitMask) => {
  // 目盛り線の位置を配列で返却する
  if (!digitMask) return [];
  let scaleStart = parseInt(min / digitMask, 10) * digitMask;
  let scaleEnd   = parseInt(max / digitMask, 10) * digitMask;
  let numScale = Math.ceil((scaleEnd - scaleStart) / digitMask) + 1;
  const countDecimalDigit = (v) => {
    // 小数点以下の桁数を返却する
    let valueComponents = v.toString().split(".");
    switch (valueComponents.length) {
      case 0: return 0;
      case 1: return (v < 0) ? valueComponents[0].length : 0;
      case 2: return valueComponents[1].length;
      default: return 0;
    }
  }
  let fixedParam = countDecimalDigit(digitMask);
  return [...Array(numScale).keys()].map((v) => parseFloat((scaleStart + v * digitMask).toFixed(fixedParam)));
}