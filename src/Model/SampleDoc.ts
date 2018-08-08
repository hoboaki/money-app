import AccountKind from './Doc/AccountKind';
import Root from './Doc/Root';
import YearMonthDayDate from './Doc/YearMonthDayDate';

/// サンプルドキュメントデータ。
class SampleDoc {
  /// サンプルドキュメントの作成。
  public static Create() {
    const doc = new Root();

    // 口座
    const accountId = doc.accountAdd('財布', AccountKind.AssetsCash, 2020);
    doc.accountAdd('アデリー銀行', AccountKind.AssetsBank, 504000);
    doc.accountAdd('コウテイ銀行', AccountKind.AssetsBank, 12036756);
    doc.accountAdd('PPPカード', AccountKind.LiabilitiesCard, 0);
    doc.accountAdd('キングカード', AccountKind.LiabilitiesCard, 0);

    // 入金
    const categoryId = doc.incomeCategoryAdd('お小遣い', null);
    doc.incomeRecordAdd(
      YearMonthDayDate.FromText('2018-01-02'),
      '1月分お小遣い',
      doc.accounts[accountId],
      doc.income.categories[categoryId],
      3000,
    );

    return doc;
  }

  /// サンプルコード実行。
  public static Test() {
    // Doc -> DocData -> Doc テスト
    if (true) {
      const doc0 = this.Create();
      const data0 = doc0.toData();
      const doc1 = Root.FromData(data0);
      const data1 = doc1.toData();
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
