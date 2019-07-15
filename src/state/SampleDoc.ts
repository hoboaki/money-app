import Clone from 'clone';
import YearMonthDayDate from '../util/YearMonthDayDate';
import * as StateMethods from './doc/StateMethods';
import * as States from './doc/States';
import * as Types from './doc/Types';

/// サンプルドキュメントデータ。
class SampleDoc {
  /// サンプルドキュメントの作成。
  public static Create() {
    const state = Clone(States.defaultState);

    // 口座
    const accountId = StateMethods.accountAdd(state, '財布', Types.AccountKind.AssetsCash, 2020);
    const bankAccountId = StateMethods.accountAdd(state, 'アデリー銀行', Types.AccountKind.AssetsBank, 504000);
    StateMethods.accountAdd(state, 'コウテイ銀行', Types.AccountKind.AssetsBank, 12036756);
    const creditCardAccountId = StateMethods.accountAdd(state, 'PPPカード', Types.AccountKind.LiabilitiesCard, 0);
    StateMethods.accountAdd(state, 'キングカード', Types.AccountKind.LiabilitiesCard, 0);
    global.console.assert(Object.keys(state.accounts).length === 5);

    // 入金
    {
      const categoryId = StateMethods.incomeCategoryAdd(state, 'お小遣い', null);
      const currentDate = new Date();
      StateMethods.incomeRecordAdd(
        state,
        currentDate,
        currentDate,
        YearMonthDayDate.fromText('2018-01-02'),
        '1月分お小遣い',
        accountId,
        categoryId,
        3000,
      );
      global.console.assert(Object.keys(state.income.categories).length === 1);
      global.console.assert(Object.keys(state.income.records).length === 1);
    }

    // 出金
    {
      const categoryId = StateMethods.outgoCategoryAdd(state, '雑費', null);
      const currentDate = new Date();
      StateMethods.outgoRecordAdd(
        state,
        currentDate,
        currentDate,
        YearMonthDayDate.fromText('2018-01-02'),
        'メガネケース',
        accountId,
        categoryId,
        3000,
      );
      global.console.assert(Object.keys(state.outgo.categories).length === 1);
      global.console.assert(Object.keys(state.outgo.records).length === 1);
    }

    // 送金
    {
      const currentDate = new Date();
      StateMethods.transferRecordAdd(
        state,
        currentDate,
        currentDate,
        YearMonthDayDate.fromText('2018-02-01'),
        '1月分請求',
        bankAccountId,
        creditCardAccountId,
        20000,
      );
      global.console.assert(Object.keys(state.transfer.records).length === 1);
    }

    return state;
  }

  /// サンプルコード実行。
  public static Test() {
    // Doc -> DocData -> Doc テスト
    if (true) {
      const doc0 = this.Create();
      const data0 = StateMethods.toData(doc0);
      const doc1 = StateMethods.fromData(data0);
      const data1 = StateMethods.toData(doc1);
      if (JSON.stringify(data0) !== JSON.stringify(data1)) {
          global.console.log(JSON.stringify(data0));
          global.console.log(JSON.stringify(data1));
          throw new Error('Error: Doc to DocData test failed.');
      }
      global.console.log('[Test] Successed.');
    }
  }
}

export default SampleDoc;
