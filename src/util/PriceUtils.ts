// 金額に関する便利機能群。

/** 数値をカンマ区切りの文字列に変換。 */
export const numToLocaleString = (num: number) => {
  return (
    (num < 0 ? '-' : '') +
    Math.abs(num)
      .toString()
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
  );
};
