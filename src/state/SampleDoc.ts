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
    StateMethods.accountAdd(state, 'アデリー銀行', Types.AccountKind.AssetsBank, 504000);
    StateMethods.accountAdd(state, 'コウテイ銀行', Types.AccountKind.AssetsBank, 12036756);
    StateMethods.accountAdd(state, 'PPPカード', Types.AccountKind.LiabilitiesCard, 0);
    StateMethods.accountAdd(state, 'キングカード', Types.AccountKind.LiabilitiesCard, 0);

    // 入金
    // const categoryId = state.incomeCategoryAdd('お小遣い', null);
    // state.incomeRecordAdd(
    //   YearMonthDayDate.FromText('2018-01-02'),
    //   '1月分お小遣い',
    //   state.accounts[accountId],
    //   state.income.categories[categoryId],
    //   3000,
    // );

    // 出金
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
