/// @file
/// ドキュメントモデルに関わるクラス定義。

//------------------------------------------------------------------------------
/// 口座。
let Account = function() {
    this.name = ""; ///< 口座名。
    this.kind = AccountKind.Invalid; ///< 種類。
    this.initialAmount = 0.0; ///< 初期金額。
};

//------------------------------------------------------------------------------
/// 口座グループ。
let AccountGroup = {
    Invalid: 0,    
    Assets: 1, ///< 資産。
    Liabilities: 2, ///< 負債。
};

//------------------------------------------------------------------------------
/// 口座種類。
let AccountKind = {
    Invalid: 0,
    AssetsCash: 10, ///< 資産：現金。
    AssetsBank: 11, ///< 資産：銀行口座。
    AssetsInvesting: 12, ///< 資産：:投資。
    AssetsOther: 19, ///< 資産：その他。
    LiabilitiesLoan: 20, ///< 負債：ローン。    
    LiabilitiesCard: 21, ///< 負債：クレジットカード。
    LiabilitiesOther: 29, ///< 負債：その他。
};

//------------------------------------------------------------------------------
/// カテゴリ。
let Category = function() {
};

//------------------------------------------------------------------------------
/// 年月日のみ表す日付。
let YearMonthDayDate = function() {
    this.text = '2018-01-01';
};

//------------------------------------------------------------------------------
/// 入出金レコード。
let Record = function() {
    this.date = new YearMonthDayDate(); ///< 入出金発生日付。
    this.memo = ""; ///< メモ。
    this.amount = 0; ///< 金額。
    this.categoryId = 0; ///< カテゴリId。
    this.accountId = 0; ///< 口座Id。
};

//------------------------------------------------------------------------------
/// ドキュメント。ビルトイン型の名前かぶりを配慮して省略形に。
let Doc = function() {
    this.accounts = {}; ///< 口座Idがキーの口座ハッシュ。
    this.categories = {}; ///< カテゴリIdがキーのカテゴリハッシュ。
    this.records = []; ///< 全レコード。
};

/// 口座の追加。
Doc.prototype.accountAdd = function(aName, aKind, aInitialAmount) {
    // オブジェクト作成
    let account = new Account();
    account.name = aName;
    account.kind = aKind;
    account.initialAmount = aInitialAmount;
    
    // 最大 Id 値 + 1 を Id とする。
    let maxKey = 0;
    for (key in this.accounts) {
        maxKey = Math.max(key, maxKey);
    }
    this.accounts[maxKey + 1] = account;
};

/// エクスポート。
module.exports = {
    Account: Account,
    AccountGroup: AccountGroup,
    AccountKind: AccountKind,
    Category: Category,
    Doc: Doc,
    Record: Record,
    YearMonthDayDate: YearMonthDayDate,
}

// EOF
