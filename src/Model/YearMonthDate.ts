/// 年月日のみ表す日付。
class YearMonthDayDate {
  // Date オブジェクトから作成。
  public static FromDate(aDate: Date) {
    let date = new YearMonthDayDate();
    date.date = aDate;
    return date;
  }

  /// YYYY-MM-DD 形式のテキストから作成。
  public static FromText(aText: string) {
      return this.FromDate(new Date(aText));
  }

  /// Date データ。
  date: Date = new Date(2018, 1, 1);

  // yyyy-mm-dd 形式に変換。
  toText() {
    const toDoubleDigits = (num: number) => {
      let text = String(num);
      if (text.length === 1) {
        text = "0" + text;
      }
      return text;     
    };
    return `${this.date.getFullYear()}-${toDoubleDigits(this.date.getMonth() + 1)}-${toDoubleDigits(this.date.getDate())}`;
  };
  
};

export default YearMonthDayDate;
