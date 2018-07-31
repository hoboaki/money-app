/// @file
/// ドキュメントモデルに関わるクラス定義。

/// 口座。
var Account = function() {
};

/// カテゴリ。
var Category = function() {
};

/// 年月日のみ表す日付。
var YearMonthDayDate = function() {
    this.text = '2018-01-01';
};

/// 出入金レコード。
var Record = function() {
    this.date = new YearMonthDayDate();
    this.memo = "";
    this.price = 0;
    this.categoryId = 0;
    this.accountId = 0;
};

/// ドキュメント。ビルトイン型の名前かぶりを配慮して省略形に。
var Doc = function() {
    this.accounts = {};
    this.categories = {};
    this.records = [];
};
Doc.prototype.func = function() {}; // sample

/// エクスポート。
module.exports = {
    Account: Account,
    Category: Category,
    Doc: Doc,
    Record: Record,
    YearMonthDayDate: YearMonthDayDate,
}

// EOF
