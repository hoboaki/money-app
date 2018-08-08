import YearMonthDayDate from './YearMonthDayDate';

/// 入出金レコード共通クラス。
class Record {
  public id: number = 0; // レコードId。
  public date: YearMonthDayDate = new YearMonthDayDate(); // 入出金発生日付。
  public memo: string = ''; // メモ。
}

export default Record;
