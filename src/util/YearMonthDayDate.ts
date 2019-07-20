/// 年月日のみ表す日付。
class YearMonthDayDate {
  // Date オブジェクトから作成。
  public static fromDate(aDate: Date) {
    const date = new YearMonthDayDate();
    date.date = new Date(
      aDate.getFullYear(),
      aDate.getMonth(),
      aDate.getDate(),
      0,
      0,
      0,
      0);
    return date;
  }

  /// YYYY-MM-DD 形式のテキストから作成。
  public static fromText(aText: string) {
    return this.fromDate(new Date(aText));
  }

  /// Date データ。（初期値：今日の0時0分0秒）
  public date: Date;

  /// コンストラクタ。
  public constructor() {
    const today = new Date();
    this.date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  }

  /// 前の月の1日。
  public prevMonth() {
    return YearMonthDayDate.fromDate(new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1));
  }

  /// 次の月の1日。
  public nextMonth() {
    return YearMonthDayDate.fromDate(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1));
  }

  /// 前の日。
  public prevDay() {
    return YearMonthDayDate.fromDate(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1));
  }

  /// 次の日。
  public nextDay() {
    return YearMonthDayDate.fromDate(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() + 1));
  }

  /// 今指している月の1日。
  public firstDayOfMonth() {
    return YearMonthDayDate.fromDate(new Date(this.date.getFullYear(), this.date.getMonth(), 1));
  }

  /// 今指している月の末日。
  public lastDayOfMonth() {
    return YearMonthDayDate.fromDate(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0));
  }

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
