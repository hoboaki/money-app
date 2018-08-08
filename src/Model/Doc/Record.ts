import YearMonthDayDate from "./YearMonthDayDate";

/// 入出金レコード共通クラス。
class Record {
  id: number = 0; // レコードId。
  date: YearMonthDayDate = new YearMonthDayDate(); // 入出金発生日付。
  memo: string = ""; // メモ。
};

export default Record;
