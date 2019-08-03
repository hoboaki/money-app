import Clone from 'clone';

import * as IYearMonthDayDateUtils from 'src/util/IYearMonthDayDateUtils';
import * as StateMethods from './doc/StateMethods';
import * as States from './doc/States';
import * as Types from './doc/Types';

interface ICategory {
  name: string;
  items: Array<{
    name: string;
  }>;
}

interface ISampleRecord {
  day: number;
  account: string;
  category: string;
  amount: number;
  memo: string;
}

interface ISampleTransferRecord {
  day: number;
  accountFrom: string;
  accountTo: string;
  amount: number;
  memo: string;
}

/// サンプルドキュメントデータ。
class SampleDoc {
  /// サンプルドキュメントの作成。
  public static Create() {
    const state = Clone(States.defaultState);

    // 口座
    const accountStartDate =
      IYearMonthDayDateUtils.prevMonth(IYearMonthDayDateUtils.prevMonth(
        IYearMonthDayDateUtils.today(),
      ));
    StateMethods.accountAdd(state, '財布', Types.AccountKind.AssetsCash, 2020, accountStartDate);
    StateMethods.accountAdd(state, 'アデリー銀行', Types.AccountKind.AssetsBank, 504000, accountStartDate);
    StateMethods.accountAdd(state, 'コウテイ銀行', Types.AccountKind.AssetsBank, 12036756, accountStartDate);
    StateMethods.accountAdd(state, 'PPPカード', Types.AccountKind.LiabilitiesCard, 0, accountStartDate);
    StateMethods.accountAdd(state, 'キングカード', Types.AccountKind.LiabilitiesCard, 0, accountStartDate);
    global.console.assert(state.account.order.length === 5);

    // 入金
    {
      // カテゴリ作成
      const sampleCategories: ICategory[] = [
        {
          name: '給料',
          items: [
            {name: '固定給'},
            {name: '年俸給'},
            {name: '残業代'},
            {name: '通勤手当'},
            {name: '住宅手当'},
            {name: '家族手当'},
          ],
        },
        {
          name: '賞与',
          items: [
            {name: '年俸給分'},
            {name: '調整給料分'},
          ],
        },
        {
          name: '児童手当',
          items: [],
        },
        {
          name: '太陽光発電',
          items: [],
        },
        {
          name: 'お小遣い',
          items: [],
        },
      ];
      sampleCategories.forEach((parent) => {
        const parentId = StateMethods.incomeCategoryAdd(state, parent.name, null);
        parent.items.forEach((child) => {
          StateMethods.incomeCategoryAdd(state, child.name, parentId);
        });
      });

      // テスト用レコード作成
      const sampleRecords: ISampleRecord[] = [
        {
          day: -2,
          account: 'アデリー銀行',
          category: '給料/固定給',
          amount: 150000,
          memo: '',
        },
        {
          day: 0,
          account: '財布',
          category: 'お小遣い',
          amount: 100,
          memo: '',
        },
        {
          day: 4,
          account: '財布',
          category: 'お小遣い',
          amount: 1000,
          memo: 'お手伝い',
        },
        {
          day: 6,
          account: '財布',
          category: 'お小遣い',
          amount: 200,
          memo: 'アイス代',
        },
        {
          day: 9,
          account: '財布',
          category: 'お小遣い',
          amount: 200,
          memo: '遠足代',
        },
      ];
      const currentDate = new Date();
      sampleRecords.forEach((rec) => {
        StateMethods.incomeRecordAdd(
          state,
          currentDate,
          currentDate,
          IYearMonthDayDateUtils.fromDate(new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            rec.day,
            )),
          rec.memo,
          StateMethods.accountByName(state, rec.account).id,
          StateMethods.categoryByPath(state.income.categories, rec.category).id,
          rec.amount,
        );
      });
    }

    // 出金
    {
      // カテゴリ作成
      const sampleCategories: ICategory[] = [
        {
          name: '家事費',
          items: [
            {name: '食費'},
            {name: '日用品'},
            {name: '妻小遣い'},
          ],
        },
        {
          name: '光熱・通信費',
          items: [
            {name: '電気'},
            {name: 'プロバイダ・光電話'},
            {name: '水道'},
            {name: 'CATV'},
            {name: 'NHK'},
          ],
        },
        {
          name: '通勤・通学費',
          items: [
            {name: '洗車'},
            {name: 'ガソリン'},
          ],
        },
      ];
      sampleCategories.forEach((parent) => {
        const parentId = StateMethods.outgoCategoryAdd(state, parent.name, null);
        parent.items.forEach((child) => {
          StateMethods.outgoCategoryAdd(state, child.name, parentId);
        });
      });

      // テスト用レコード作成
      const sampleRecords: ISampleRecord[] = [
        {
          day: -1,
          account: 'アデリー銀行',
          category: '光熱・通信費/電気',
          amount: 10000,
          memo: '',
        },
        {
          day: 5,
          account: '財布',
          category: '家事費/食費',
          amount: 1000,
          memo: '夕飯代',
        },
        {
          day: 6,
          account: '財布',
          category: '家事費/日用品',
          amount: 100,
          memo: 'ティッシュ',
        },
        {
          day: 7,
          account: '財布',
          category: '家事費/食費',
          amount: 200,
          memo: 'アイス',
        },
        {
          day: 9,
          account: '財布',
          category: '家事費/食費',
          amount: 100,
          memo: 'バナナ',
        },
      ];
      const currentDate = new Date();
      sampleRecords.forEach((rec) => {
        StateMethods.outgoRecordAdd(
          state,
          currentDate,
          currentDate,
          IYearMonthDayDateUtils.fromDate(new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            rec.day,
            )),
          rec.memo,
          StateMethods.accountByName(state, rec.account).id,
          StateMethods.categoryByPath(state.outgo.categories, rec.category).id,
          rec.amount,
        );
      });
    }

    // 送金
    {
      const sampleRecords: ISampleTransferRecord[] = [
        {
          day: 1,
          accountFrom: 'アデリー銀行',
          accountTo: '財布',
          amount: 30000,
          memo: '今月分のお小遣い',
        },
        {
          day: 6,
          accountFrom: 'アデリー銀行',
          accountTo: '財布',
          amount: 10000,
          memo: '追加のお小遣い',
        },
      ];
      const currentDate = new Date();
      sampleRecords.forEach((rec) => {
        StateMethods.transferRecordAdd(
          state,
          currentDate,
          currentDate,
          IYearMonthDayDateUtils.fromDate(new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            rec.day,
            )),
          rec.memo,
          StateMethods.accountByName(state, rec.accountFrom).id,
          StateMethods.accountByName(state, rec.accountTo).id,
          rec.amount,
        );
      });
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
