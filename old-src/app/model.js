/**
 * @fileOverview
 * ドキュメントモデルに関わるクラス定義。
 *  〜Data はファイル読み書き用のクラス。
 */

//------------------------------------------------------------------------------
/**
 * 口座。
 * @constructor
 */
let Account = function() {
    this.id = 0; ///< Id。
    this.name = ""; ///< 口座名。
    this.kind = AccountKind.Invalid; ///< 種類。
    this.initialAmount = 0.0; ///< 初期金額。プラスが貯蓄。マイナスが負債。
};

/**
 * 口座。（データ版）
 * @constructor
 */
let AccountData = function() {
    this.id = 0; ///< Id。
    this.name = ""; ///< 口座名。
    this.kind = ""; ///< 種類。
    this.initialAmount = 0.0; ///< 初期金額。プラスが貯蓄。マイナスが負債。
};

//------------------------------------------------------------------------------
/**
 * 口座グループ。
 * @enum {number}
 */
let AccountGroup = {
    Invalid: 0,    
    Assets: 1, ///< 資産。
    Liabilities: 2, ///< 負債。
};

//------------------------------------------------------------------------------
/**
 * 口座種類。
 * @enum {number}
 */
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
/**
 * カテゴリ。
 * @constructor
 */
let Category = function() {
    this.id = 0; ///< Id。
    this.name = ""; ///< カテゴリ名。
    this.parent = null; ///< 親 Category の参照。null ならルート。
    this.childs = []; ///< 子 Category の配列。
};

/**
 * カテゴリ。（データ版）
 * @constructor
 */
let CategoryData = function() {
    this.id = 0; ///< Id。
    this.name = ""; ///< カテゴリ名。
    this.parent = 0; ///< 親カテゴリのId。0 ならルート。
};

//------------------------------------------------------------------------------
/**
 * カテゴリの種類。
 * @enum {number}
 */
let CategoryKind = {
    Invalid: 0, ///< 無効値。
    Income: 1, ///< 入金。
    Outgo: 2, ///< 出金。
};

//------------------------------------------------------------------------------
/**
 * 年月日のみ表す日付。
 * @constructor
 */
let YearMonthDayDate = function() {
    this.date = new Date(2018, 1, 1);

    // yyyy-mm-dd 形式に変換。
    this.toText = function() {
        let toDoubleDigits = function(num) {
            num += "";
            if (num.length === 1) {
              num = "0" + num;
            }
           return num;     
        };
        return `${this.date.getFullYear()}-${toDoubleDigits(this.date.getMonth() + 1)}-${toDoubleDigits(this.date.getDate())}`;
    };
};

/**
 * YearMonthDayDate 便利関数群。
 */
let YearMonthDayDateUtil = {
    /**
     * Date オブジェクトから作成。
     * @return {YearMonthDayDate}
     * @param {Date} aDate
     */
    FromDate: function(aDate) {
        let date = new YearMonthDayDate();
        date.date = aDate;
        return date;
    },

    /**
     * YYYY-MM-DD 形式のテキストから作成。
     * @return {YearMonthDayDate}
     * @param {string} aText
     */
    FromText: function(aText) {
        return this.FromDate(new Date(aText));
    },
};

//------------------------------------------------------------------------------
/**
 * 入出金レコード共通クラス。
 * @constructor
 */
let Record = function() {
    this.date = new YearMonthDayDate(); ///< 入出金発生日付。
    this.memo = ""; ///< メモ。
};

/**
 * 入出金レコード共通クラス。（データ版）
 * @constructor
 */
let RecordData = function() {
    this.date = ""; ///< 入出金発生日付。
    this.memo = ""; ///< メモ。
};

/**
 * 入金レコード。
 * @constructor
 * @extends Record
 */
let RecordIncome = function() {
    Record.call(this);
    this.account = null; ///< 口座。
    this.category = null; ///< 入金カテゴリ。
    this.amount = 0; ///< 金額。(入金がプラス・出金がマイナス)
}

/**
 * 入金レコード。（データ版）
 * @constructor
 * @extends RecordData
 */
let RecordIncomeData = function() {
    RecordData.call(this);
    this.account = 0; ///< 口座Id。
    this.category = 0; ///< 入金カテゴリId。
    this.amount = 0; ///< 金額。(入金がプラス・出金がマイナス)
}
/**
 * 出金レコード。
 * @constructor
 * @extends Record
 */
let RecordOutgo = function() {
    Record.call(this);
    this.account = null; ///< 口座。
    this.category = null; ///< カテゴリ。
    this.amount = 0; ///< 金額。(出金がプラス・入金がマイナス)
}

/**
 * 出金レコード。（データ版）
 * @constructor
 * @extends RecordData
 */
let RecordOutgoData = function() {
    RecordData.call(this);
    this.account = 0; ///< 口座Id。
    this.category = 0; ///< 出金カテゴリId。
    this.amount = 0; ///< 金額。(出金がプラス・入金がマイナス)
}

/**
 * 資金移動レコード。
 * @constructor
 * @extends Record
 */
let RecordTransfer = function() {
    Record.call(this);
    this.accountFrom = null; ///< 送金元口座。
    this.accountTo = null; ///< 送金先口座。
    this.amount = 0; ///< 金額。
}

/**
 * 資金移動レコード。（データ版）
 * @constructor
 * @extends RecordData
 */
let RecordTransferData = function() {
    RecordData.call(this);
    this.accountFrom = 0; ///< 送金元口座Id。amount が加算される。
    this.accountTo = 0; ///< 送金先口座Id。amount が減算される。
    this.amount = 0; ///< 金額。
}

//------------------------------------------------------------------------------
/**
 * 入出金レコードの種類。
 * @enum {number}
 */
let RecordKind = {
    Invalid: 0, ///< 無効値。
    Income: 1, ///< 入金。
    Outgo: 2, ///< 出金。
    Transfer: 3, ///< 資金移動。
};

//------------------------------------------------------------------------------
/**
 * ドキュメント。
 * クラス名はビルトイン型の名前かぶりを配慮して省略形にしました。
 * @constructor
 */
let Doc = function() {
    // 変数定義
    this.accounts = {}; ///< 口座Idがキーの口座ハッシュ。
    this.income = new function() {
        this.categories = {}; ///< 入金カテゴリIdがキーの入金カテゴリハッシュ。
        this.records = {}; ///< 入金レコードIdがキーの入金レコード。
    };
    this.outgo = new function() {
        this.categories = {}; ///< 出金カテゴリIdがキーの出金カテゴリハッシュ。
        this.records = {}; ///< 出金レコードIdがキーの出金レコード。
    };
    this.transfer = new function() {
        this.records = {}; ///< 資金移動レコードIdがキーの資金移動レコード。
    };
    this.records = []; ///< 全レコード。
    this.nextId = new function() { ///< 次に使用するId。
        this.account = 1;
        this.income = new function() {
            this.category = 1;
            this.record = 1;
        };
        this.outgo = new function() {
            this.category = 1;
            this.record = 1;
        };
        this.transfer = new function() {
            this.record = 1;
        };
    };
};

/**
 * ドキュメント。（データ版）
 * @constructor
 */
let DocData = function() {
    this.accounts = []; ///< 全口座。
    this.income = new function() {
        this.categories = []; ///< 入金カテゴリの配列。
        this.records = []; ///< 入金レコードの配列。
    };
    this.outgo = new function() {
        this.categories = []; ///< 出金カテゴリの配列。
        this.records = []; ///< 出金レコードの配列。
    };
    this.transfer = new function() {
        this.records = []; ///< 資金移動レコードの配列。
    };
};

/**
 * データをインポート。（初期化直後のオブジェクトに使用することを想定）
 * @param {DocData} aData。
 */
Doc.prototype.importData = function(aData) {
    // enum 変換
    let enumKeyToInt = function(aText, aEnumType) {
        let val = aEnumType[aText];
        if (val != null) {
            return aEnumType[aText];
        }
        throw `Error: Not found key '${aText}' in '${aEnumType}'.`;
    };

    //  口座
    let accountIdDict = {}; // Data内Id → オブジェクトId 変換テーブル
    for (let data of aData.accounts) {
        let key = this.accountAdd(data.name, enumKeyToInt(data.kind, AccountKind), data.initialAmount);
        accountIdDict[data.id] = key;
    }

    // 入金
    {
        let categoryIdDict = {}; // Data内Id -> オブジェクトId 変換テーブル
        for (let data of aData.income.categories) {
            let parentId = 0;
            if (data.parent != 0) {
                parentId = categoryIdDict[data.parent];
                if (parentId == null) {
                    throw `Error: Invalid parent value(${data.parent}) in income category (id: '${data.id}').`;
                }
            }
            let key = this.incomeCategoryAdd(data.name, parentId);
            categoryIdDict[data.id] = key;
        }
        for (let data of aData.income.records) {
            let categoryId = categoryIdDict[data.category];
            if (categoryId == null) {
                throw `Error: Invalid category value(${data.category}) in income record (id: '${data.id}').`;
            }
            let accountId = accountIdDict[data.account];
            if (accountId == null) {
                throw `Error: Invalid account value(${data.account}) in income record (id: '${data.id}').`;
            }
            this.incomeRecordAdd(YearMonthDayDateUtil.FromText(data.date), data.memo, accountId, categoryId, data.amount);
        }
    }
}

/**
 * データにエクスポート。
 * @return {DocData}
 */
Doc.prototype.exportData = function() {
    // enum 変換
    let enumValToKey = function(aVal, aEnumType) {
        for(key in aEnumType) {
            if (aEnumType[key] == aVal) {
                return key;
            }
        }
        throw `Error: Not found val '${aVal}' in '${aEnumType}'.`;
    };

    //　結果オブジェクト
    let result = new DocData();

    // 口座    
    for (let key in this.accounts) {
        let src = this.accounts[key];
        let data = new AccountData();
        data.id = key;
        data.name = src.name;
        data.kind = enumValToKey(src.kind, AccountKind);
        data.initialAmount = src.initialAmount;
        result.accounts.push(data);
    }

    // 入金
    {
        // カテゴリ
        for (let key in this.income.categories) {
            let src = this.income.categories[key];
            let data = new CategoryData();
            data.id = src.id;
            data.name = src.name;
            if (src.parent != null) {
                data.parent = src.parent.id;
            }
            result.income.categories.push(data);
        }

        // レコード
        for (let key in this.income.records) {
            let src = this.income.records[key];
            let data = new RecordIncomeData();
            data.date = src.date.toText();
            data.memo = src.memo;
            data.amount = src.amount;
            data.category = src.category.id;
            data.account = src.account.id;
            result.income.records.push(data);
        }
    }

    // 結果を返す
    return result;
}

/**
 * 口座の追加。
 * @return {number} 追加した口座のId。
 */
Doc.prototype.accountAdd = function(aName, aKind, aInitialAmount) {
    // オブジェクト作成
    let obj = new Account();
    obj.name = aName;
    obj.kind = aKind;
    obj.initialAmount = aInitialAmount;
    
    // 追加
    obj.id = this.nextId.account;
    this.nextId.account++;
    this.accounts[obj.id] = obj;
    return obj.id;
};

/**
 * 入金カテゴリの追加。
 * @return {number} 追加したカテゴリのId。
 * @param {string} aName
 * @param {number} aParentId
 */
Doc.prototype.incomeCategoryAdd = function(aName, aParentId) {
    // オブジェクト作成
    let obj = new Category();
    obj.name = aName;
    if (aParentId != 0) {
        obj.parent = this.income.categories[aParentId];
        console.assert(obj.parent != null);
    }
    
    // 追加
    obj.id = this.nextId.income.category;
    this.nextId.income.category++;
    this.income.categories[obj.id] = obj;
    return obj.id;
};

/**
 * 入金レコードの追加。
 * @return {number} 追加したレコードのId。
 * @param {YearMonthDayDate} aDate
 * @param {string} aMemo
 * @param {number} aAccountId
 * @param {number} aCategoryId
 * @param {number} aAmount 仕様は RecordIncome.amount を参照。
 */
Doc.prototype.incomeRecordAdd = function(aDate, aMemo, aAccountId, aCategoryId, aAmount) {
    // オブジェクト作成
    let obj = new RecordIncome();
    obj.date = aDate;
    obj.memo = aMemo;
    obj.account = this.accounts[aAccountId];
    console.assert(obj.account != null);
    obj.category = this.income.categories[aCategoryId];
    console.assert(obj.category != null);
    obj.amount = aAmount;
    
    // 追加
    obj.id = this.nextId.income.record;
    this.nextId.income.record++;
    this.income.records[obj.id] = obj;
    return obj.id;
};

// エクスポート
module.exports = {
    Account: Account,
    AccountGroup: AccountGroup,
    AccountKind: AccountKind,
    Category: Category,
    Doc: Doc,
    Record: Record,
    YearMonthDayDate: YearMonthDayDate,
    YeadMonthDayDateUtil: YearMonthDayDateUtil,
}

// EOF
