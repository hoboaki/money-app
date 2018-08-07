import YearMonthDayDate from "./YearMonthDate";

/// 入出金レコード共通クラス。
class Record {
    date: YearMonthDayDate = new YearMonthDayDate(); ///< 入出金発生日付。
    memo: string = ""; ///< メモ。
};

export default Record;
