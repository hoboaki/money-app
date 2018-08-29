/// 年月日のみ表す日付。
class YearMonthDayDate {
  // Date オブジェクトから作成。
  public static FromDate(aDate: Date) {
    const date = new YearMonthDayDate();
    date.date = aDate;
    return date;
  }

  /// YYYY-MM-DD 形式のテキストから作成。
  public static FromText(aText: string) {
      return this.FromDate(new Date(aText));
  }

  /// Date データ。
  public date: Date = new Date(2018, 1, 1);

  // yyyy-mm-dd 形式に変換。
  public toText() {
    const toDoubleDigits = (num: number) => {
      let text = String(num);
      if (text.length === 1) {
        text = '0' + text;
      }
      return text;
    };
    const year = this.date.getFullYear();
    const month = toDoubleDigits(this.date.getMonth() + 1);
    const day = toDoubleDigits(this.date.getDate());
    return `${year}-${month}-${day}`;
  }

}

export default YearMonthDayDate;
