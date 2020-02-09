import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import Split from 'split.js';
import * as DocActions from 'src/state/doc/Actions';
import * as DocStateMethods from 'src/state/doc/StateMethods';
import * as DocStates from 'src/state/doc/States';
import * as DocTypes from 'src/state/doc/Types';
import IStoreState from 'src/state/IStoreState';
import Store from 'src/state/Store';
import * as UiActions from 'src/state/ui/Actions';
import * as UiStates from 'src/state/ui/States';
import * as UiTypes from 'src/state/ui/Types';
import BalanceCalculator from 'src/util/doc/BalanceCalculator';
import IRecordFilter from 'src/util/doc/IRecordFilter';
import IRecordKey from 'src/util/doc/IRecordKey';
import RecordCollection from 'src/util/doc/RecordCollection';
import * as RecordFilters from 'src/util/doc/RecordFilters';
import IYearMonthDayDate from 'src/util/IYearMonthDayDate';
import * as IYearMonthDateUtils from 'src/util/IYearMonthDayDateUtils';
import * as PriceUtils from 'src/util/PriceUtils';
import * as BasicStyles from 'src/view/Basic.css';
import RecordEditDialog from 'src/view/widget/record-edit-dialog';
import { v4 as UUID } from 'uuid';

import * as Styles from './Body.css';

interface ISelectedCellInfo {
  colIdx: number;
  date: IYearMonthDayDate;
  accountGroup: DocTypes.AccountGroup | null;
  accountId: number | null;
  aggregateAccountRoot: number | null; // 数値は特に意味は無い値。
  aggregateAccountId: number | null;
  recordKind: DocTypes.RecordKind | null;
  categoryId: number | null;
}

interface IProps {
  doc: DocStates.IState;
  page: UiStates.IPageSheet;
}

interface IState {
  colCount: number;
  selectedCell: ISelectedCellInfo | null;
  modalRecordEdit: boolean;
  recordEditDefaultValue: {
    recordKind: DocTypes.RecordKind;
    date: IYearMonthDayDate;
    accountId: number | null;
    categoryId: number | null;
  };
  recordEditAdditionalRecordKeys: IRecordKey[];
}

const idPageSheetBodyTop = 'pageSheetBodyTop';
const idPageSheetBodyBottom = 'pageSheetBodyBottom';

class Body extends React.Component<IProps, IState> {
  private elementIdRoot: string;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      colCount: 1,
      selectedCell: null,
      modalRecordEdit: false,
      recordEditDefaultValue: {
        recordKind: DocTypes.RecordKind.Invalid,
        date: IYearMonthDateUtils.today(),
        accountId: null,
        categoryId: null,
      },
      recordEditAdditionalRecordKeys: [],
    };
    this.elementIdRoot = `elem-${UUID()}`;
  }

  public componentDidMount() {
    // スピリッター登録
    Split([`#${idPageSheetBodyTop}`, `#${idPageSheetBodyBottom}`], {
      sizes: [25, 75],
      gutterSize: 12,
      cursor: 'row-resize',
      direction: 'vertical',
    });

    // サイズ変更イベント登録＆初回更新
    window.addEventListener('resize', () => {
      this.updateColCount();
    });
    this.updateColCount();
  }

  public render() {
    const rootClass = ClassNames(Styles.Root);
    const headTableRecordClass = ClassNames(Styles.Table, Styles.HeadTableRecord);

    // colHead
    const colHeadAccountNameClass = ClassNames(Styles.TableColHead, Styles.TableColHeadAccountName);
    const colHeadAccountCategoryClass = ClassNames(Styles.TableColHead, Styles.TableColHeadAccountCategory);
    const colHeadCarriedClass = ClassNames(Styles.TableColHead, Styles.TableColHeadCarried);
    const colHeadCellClass = ClassNames(Styles.TableColHead, Styles.TableColHeadCell);
    const colHeadSpaceClass = ClassNames(Styles.TableColHead, Styles.TableColHeadSpace);
    const colHeadBalanceClass = ClassNames(Styles.TableColHead, Styles.TableColHeadBalance);
    const colHeadCategoryClass = ClassNames(Styles.TableColHead, Styles.TableColHeadCategory);
    const colHeadTotalClass = ClassNames(Styles.TableColHead, Styles.TableColHeadTotal);
    const colHeadScrollBarSpaceClass = ClassNames(Styles.TableColHead, Styles.TableColHeadScrollBarSpace);

    // rowHead
    const rowHeadHolderAccountClass = ClassNames(
      Styles.TableRowHead,
      Styles.TableRowHeadHolder,
      Styles.TableRowHeadHolderAccount,
    );
    const rowHeadHolderCategoryClass = ClassNames(
      Styles.TableRowHead,
      Styles.TableRowHeadHolder,
      Styles.TableRowHeadHolderCategory,
    );
    const rowHeadAccountCategoryClass = ClassNames(
      Styles.TableRowHead,
      Styles.TableRowHeadAccount,
      Styles.TableRowHeadAccountCategory,
    );
    const rowHeadAccountCarriedClass = ClassNames(
      Styles.TableRowHead,
      Styles.TableRowHeadAccount,
      Styles.TableRowHeadCarried,
    );

    // rowTail
    const rowTailAccountBalance = ClassNames(Styles.TableRowTail, Styles.TableRowTailBalance);
    const rowTailTotal = ClassNames(Styles.TableRowTail, Styles.TableRowTailTotal);

    // holderEntry
    const holderEntryNormalExpanderSpaceClass = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryExpanderSpace,
      Styles.HolderEntryNormalExpanderSpace,
    );
    const holderEntryAccountNameClass = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryAccountName,
      Styles.HolderEntryNormalAccountName,
    );
    const holderEntryCategoryNameClass = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryCategoryName,
      Styles.HolderEntryNormalCategoryName,
    );

    // その他
    const expanderBtnClass = ClassNames(BasicStyles.IconBtn, Styles.ExpanderBtn);

    // 列情報生成
    const colInfos: { date: IYearMonthDayDate }[] = [];
    const colCount = this.state.colCount;
    const colBeginDate = this.props.page.currentDate;
    let colEndDate = colBeginDate;
    {
      let date = this.props.page.currentDate;
      for (let colIdx = 0; colIdx < colCount; ++colIdx) {
        colInfos.push({
          date,
        });
        date = IYearMonthDateUtils.nextDate(date, UiTypes.sheetViewUnitToDateUnit(this.props.page.viewUnit));
      }
      colEndDate = date;
    }

    // 表示単位で変わる値の選択
    let totalBeginDate: IYearMonthDayDate | null = null;
    let totalEndDate: IYearMonthDayDate | null = null;
    let carriedVisible = false;
    let labelBalance = '#';
    let labelTotal = '#';
    switch (this.props.page.viewUnit) {
      case UiTypes.SheetViewUnit.Day:
        totalBeginDate = IYearMonthDateUtils.firstDayOfMonth(colBeginDate);
        totalEndDate = IYearMonthDateUtils.nextMonth(totalBeginDate);
        carriedVisible = true;
        labelBalance = '月末残高';
        labelTotal = '月間合計';
        carriedVisible = true;
        break;
      case UiTypes.SheetViewUnit.Month:
        totalBeginDate = IYearMonthDateUtils.firstDayOfYear(colBeginDate);
        totalEndDate = IYearMonthDateUtils.nextYear(totalBeginDate);
        carriedVisible = true;
        labelBalance = '年末残高';
        labelTotal = '年間合計';
        break;
      case UiTypes.SheetViewUnit.Year:
        totalBeginDate = null;
        totalEndDate = null;
        carriedVisible = false;
        labelBalance = '残高';
        labelTotal = '合計';
        break;
    }

    // 使い回す値の定義
    const accountGroups = [DocTypes.AccountGroup.Assets, DocTypes.AccountGroup.Liabilities];
    const recordKinds = [DocTypes.RecordKind.Transfer, DocTypes.RecordKind.Income, DocTypes.RecordKind.Outgo];

    // 口座テーブルのデータ作成
    const accountTableBuildTimeBegin = performance.now();
    const accountCarriedData: { [key: number]: number } = {};
    const accountCellDataArray: { [key: number]: number[] } = {};
    const accountBalanceData: { [key: number]: number } = {};
    const calculateCarriedResult = new BalanceCalculator(
      this.props.doc,
      colBeginDate,
      this.props.doc.account.order,
      null,
    );
    const calculateColResults: BalanceCalculator[] = [];
    {
      let calculator = calculateCarriedResult;
      colInfos.forEach((colInfo, colIdx) => {
        const nextColIdx = colIdx + 1;
        calculator = new BalanceCalculator(
          this.props.doc,
          nextColIdx < colInfos.length ? colInfos[nextColIdx].date : colEndDate,
          this.props.doc.account.order,
          calculator,
        );
        global.console.assert(calculateColResults.length === colIdx);
        calculateColResults.push(calculator);
      });
    }
    const calculateBalanceResult = new BalanceCalculator(
      this.props.doc,
      totalEndDate,
      this.props.doc.account.order,
      calculateCarriedResult,
    );
    this.props.doc.account.order.forEach((accountId) => {
      // 繰り越しデータ代入
      const account = this.props.doc.account.accounts[accountId];
      const sign = DocTypes.accountKindToAccountGroup(account.kind) !== DocTypes.AccountGroup.Liabilities ? 1 : -1;
      accountCarriedData[accountId] = sign * calculateCarriedResult.balances[accountId];

      // 各列のデータ代入
      const cellDataArray: number[] = [];
      colInfos.forEach((colInfo, colIdx) => {
        cellDataArray[colIdx] = sign * calculateColResults[colIdx].balances[accountId];
      });
      accountCellDataArray[accountId] = cellDataArray;

      // 残高データ代入
      accountBalanceData[accountId] = sign * calculateBalanceResult.balances[accountId];
    });
    const accountTableBuildTimeEnd = performance.now();

    // 口座ルート行のデータ作成
    const accountRootsBuildTimeBegin = performance.now();
    const accountGroupCarriedData: { [key: number]: number } = {};
    const accountGroupCellDataArray: { [key: number]: number[] } = {};
    const accountGroupBalanceData: { [key: number]: number } = {};
    accountGroups.forEach((accountGroup) => {
      // メモ
      const accountIdArray = Object.keys(accountCarriedData).filter(
        (data) =>
          DocTypes.accountKindToAccountGroup(this.props.doc.account.accounts[Number(data)].kind) === accountGroup,
      );

      // 繰り越しデータ計算
      accountGroupCarriedData[accountGroup] = accountIdArray
        .map((accountId) => accountCarriedData[Number(accountId)])
        .reduce((prev, current) => prev + current);

      // 各列のデータ
      const cellDataArray: number[] = [];
      colInfos.forEach((colInfo, colIdx) => {
        cellDataArray[colIdx] = accountIdArray
          .map((accountId) => accountCellDataArray[Number(accountId)][colIdx])
          .reduce((prev, current) => prev + current);
      });
      accountGroupCellDataArray[accountGroup] = cellDataArray;

      // 残高データ計算
      accountGroupBalanceData[accountGroup] = accountIdArray
        .map((accountId) => accountBalanceData[Number(accountId)])
        .reduce((prev, current) => prev + current);
    });
    const accountRootsBuildTimeEnd = performance.now();

    // 集計口座のデータ作成
    const aggregateAccountCarriedData: { [key: number]: number } = {};
    const aggregateAccountCellDataArray: { [key: number]: number[] } = {};
    const aggregateAccountBalanceData: { [key: number]: number } = {};
    this.props.doc.aggregateAccount.order.forEach((aggregateAccount) => {
      // メモ
      const accountIdArray = this.props.doc.aggregateAccount.accounts[aggregateAccount].accounts;

      // 繰り越しデータ計算
      aggregateAccountCarriedData[aggregateAccount] = accountIdArray
        .map((accountId) => accountCarriedData[Number(accountId)])
        .reduce((prev, current) => prev + current);

      // 各列のデータ
      const cellDataArray: number[] = [];
      colInfos.forEach((colInfo, colIdx) => {
        cellDataArray[colIdx] = accountIdArray
          .map((accountId) => accountCellDataArray[Number(accountId)][colIdx])
          .reduce((prev, current) => prev + current);
      });
      aggregateAccountCellDataArray[aggregateAccount] = cellDataArray;

      // 残高データ計算
      aggregateAccountBalanceData[aggregateAccount] = accountIdArray
        .map((accountId) => accountBalanceData[Number(accountId)])
        .reduce((prev, current) => prev + current);
    });
    const aggregateAccountSumCarried = Object.values(aggregateAccountCarriedData).reduce((prev, cur) => prev + cur, 0);
    const aggregateAccountSumCellDataArray: number[] = [];
    colInfos.forEach((colInfo, colIdx) => {
      aggregateAccountSumCellDataArray[colIdx] = Object.keys(aggregateAccountCellDataArray)
        .map((id) => aggregateAccountCellDataArray[Number(id)][colIdx])
        .reduce((prev, cur) => prev + cur, 0);
    });
    const aggregateAccountSumBalance = Object.values(aggregateAccountBalanceData).reduce((prev, cur) => prev + cur, 0);

    // カテゴリテーブルのデータ生成の準備
    const categoryPrepareTimeBegin = performance.now();
    const recordsForCellData = new RecordCollection(this.props.doc, null).filter([
      RecordFilters.createDateRangeFilter({ startDate: colBeginDate, endDate: colEndDate }),
    ]);
    const recordsForTotal = new RecordCollection(this.props.doc, null).filter([
      RecordFilters.createDateRangeFilter({ startDate: totalBeginDate, endDate: totalEndDate }),
    ]);
    const recordKindCellDataDictArray = new Array<{ [key: number]: number | null }>(colInfos.length);
    const recordKindTotalArray: { [key: number]: number | null } = {};
    const incomeLeafCategoriesArray: { [key: number]: number[] } = {};
    const incomeCellDataDictArray = new Array<{ [key: number]: number | null }>(colInfos.length);
    const incomeTotalArray: { [key: number]: number | null } = {};
    const outgoLeafCategoriesArray: { [key: number]: number[] } = {};
    const outgoCellDataDictArray = new Array<{ [key: number]: number | null }>(colInfos.length);
    const outgoTotalArray: { [key: number]: number | null } = {};
    colInfos.forEach((entry, idx) => {
      recordKindCellDataDictArray[idx] = {};
      incomeCellDataDictArray[idx] = {};
      outgoCellDataDictArray[idx] = {};
    });
    recordKinds.forEach((kind) => {
      recordKindCellDataDictArray.forEach((entry, colIdx) => {
        recordKindCellDataDictArray[colIdx][kind] = null;
      });
      recordKindTotalArray[kind] = null;
    });
    DocStateMethods.categoryIdArray(this.props.doc.income.rootCategoryId, this.props.doc.income.categories).forEach(
      (id) => {
        incomeLeafCategoriesArray[id] = DocStateMethods.leafCategoryIdArray(id, this.props.doc.income.categories);
        incomeCellDataDictArray.forEach((entry, colIdx) => {
          incomeCellDataDictArray[colIdx][id] = null;
        });
        incomeTotalArray[id] = null;
      },
    );
    DocStateMethods.categoryIdArray(this.props.doc.outgo.rootCategoryId, this.props.doc.outgo.categories).forEach(
      (id) => {
        outgoLeafCategoriesArray[id] = DocStateMethods.leafCategoryIdArray(id, this.props.doc.outgo.categories);
        outgoCellDataDictArray.forEach((entry, colIdx) => {
          outgoCellDataDictArray[colIdx][id] = null;
        });
        outgoTotalArray[id] = null;
      },
    );
    const categoryPrepareTimeEnd = performance.now();

    // カテゴリテーブルの各列データ生成
    const categoryTableBuildTimeBegin = performance.now();
    const toCellDataFuncs: { [key: number]: (ids: number[]) => number | null } = {};
    toCellDataFuncs[DocTypes.RecordKind.Transfer] = (ids) => {
      return ids.length === 0
        ? null
        : ids.map((id) => this.props.doc.transfer.records[id].amount).reduce((prev, cur) => prev + cur, 0);
    };
    toCellDataFuncs[DocTypes.RecordKind.Income] = (ids) => {
      return ids.length === 0
        ? null
        : ids.map((id) => this.props.doc.income.records[id].amount).reduce((prev, cur) => prev + cur, 0);
    };
    toCellDataFuncs[DocTypes.RecordKind.Outgo] = (ids) => {
      return ids.length === 0
        ? null
        : ids.map((id) => this.props.doc.outgo.records[id].amount).reduce((prev, cur) => prev + cur, 0);
    };
    const calcSumFunc = (catIds: number[], data: { [key: number]: number | null }): number | null => {
      let sum: number | null = null;
      catIds.forEach((catId) => {
        const val = data[catId];
        if (val === null) {
          return;
        }
        sum = (sum === null ? 0 : sum) + val;
      });
      return sum;
    };
    colInfos.forEach((colInfo, colIdx) => {
      const nextColIdx = colIdx + 1;
      const nextDate = nextColIdx < colInfos.length ? colInfos[nextColIdx].date : colEndDate;
      const records = recordsForCellData.filter([
        RecordFilters.createDateRangeFilter({ startDate: colInfo.date, endDate: nextDate }),
      ]);

      // RecordKind 毎の全レコード集計
      recordKindCellDataDictArray[colIdx][DocTypes.RecordKind.Transfer] = toCellDataFuncs[DocTypes.RecordKind.Transfer](
        records.transfers,
      );
      recordKindCellDataDictArray[colIdx][DocTypes.RecordKind.Income] = toCellDataFuncs[DocTypes.RecordKind.Income](
        records.incomes,
      );
      recordKindCellDataDictArray[colIdx][DocTypes.RecordKind.Outgo] = toCellDataFuncs[DocTypes.RecordKind.Outgo](
        records.outgos,
      );

      // 末端カテゴリ毎の集計
      records.incomes.forEach((id) => {
        const state = this.props.doc.income;
        const record = state.records[id];
        const categoryId = record.category;
        const prevValue = incomeCellDataDictArray[colIdx][categoryId];
        incomeCellDataDictArray[colIdx][categoryId] = (prevValue === null ? 0 : prevValue) + record.amount;
      });
      records.outgos.forEach((id) => {
        const state = this.props.doc.outgo;
        const record = state.records[id];
        const categoryId = record.category;
        const prevValue = outgoCellDataDictArray[colIdx][categoryId];
        outgoCellDataDictArray[colIdx][categoryId] = (prevValue === null ? 0 : prevValue) + record.amount;
      });

      // 親カテゴリの集計
      Object.keys(incomeCellDataDictArray[colIdx]).forEach((id) => {
        const catId = Number(id);
        incomeCellDataDictArray[colIdx][catId] = calcSumFunc(
          incomeLeafCategoriesArray[catId],
          incomeCellDataDictArray[colIdx],
        );
      });
      Object.keys(outgoCellDataDictArray[colIdx]).forEach((id) => {
        const catId = Number(id);
        outgoCellDataDictArray[colIdx][catId] = calcSumFunc(
          outgoLeafCategoriesArray[catId],
          outgoCellDataDictArray[colIdx],
        );
      });
    });
    const categoryTableBuildTimeEnd = performance.now();

    // カテゴリテーブルの合計データ生成
    const categoryTotalBuildTimeBegin = performance.now();
    Object.keys(recordKindTotalArray).forEach((key) => {
      const id = Number(key);
      switch (id) {
        case DocTypes.RecordKind.Transfer:
          recordKindTotalArray[id] =
            recordsForTotal.transfers.length === 0 ? null : recordsForTotal.sumAmountTransfer();
          break;
        case DocTypes.RecordKind.Income:
          recordKindTotalArray[id] = recordsForTotal.incomes.length === 0 ? null : recordsForTotal.sumAmountIncome();
          break;
        case DocTypes.RecordKind.Outgo:
          recordKindTotalArray[id] = recordsForTotal.outgos.length === 0 ? null : recordsForTotal.sumAmountOutgo();
          break;
      }
    });
    recordsForCellData.incomes.forEach((id) => {
      const state = this.props.doc.income;
      const record = state.records[id];
      const categoryId = record.category;
      const prevValue = incomeTotalArray[categoryId];
      incomeTotalArray[categoryId] = (prevValue === null ? 0 : prevValue) + record.amount;
    });
    recordsForCellData.outgos.forEach((id) => {
      const state = this.props.doc.outgo;
      const record = state.records[id];
      const categoryId = record.category;
      const prevValue = outgoTotalArray[categoryId];
      outgoTotalArray[categoryId] = (prevValue === null ? 0 : prevValue) + record.amount;
    });
    {
      Object.keys(incomeTotalArray).forEach((id) => {
        const catId = Number(id);
        incomeTotalArray[catId] = calcSumFunc(incomeLeafCategoriesArray[catId], incomeTotalArray);
      });
      Object.keys(outgoTotalArray).forEach((id) => {
        const catId = Number(id);
        outgoTotalArray[catId] = calcSumFunc(outgoLeafCategoriesArray[catId], outgoTotalArray);
      });
    }
    const categoryTotalBuildTimeEnd = performance.now();

    // 計測値ダンプ
    if (false) {
      const profileResults = [
        { label: 'AccountTableBuild', time: accountTableBuildTimeEnd - accountTableBuildTimeBegin },
        { label: 'AccountRootsBuild', time: accountRootsBuildTimeEnd - accountRootsBuildTimeBegin },
        { label: 'CategoryPrepare', time: categoryPrepareTimeEnd - categoryPrepareTimeBegin },
        { label: 'CategoryTableBuild', time: categoryTableBuildTimeEnd - categoryTableBuildTimeBegin },
        { label: 'CategoryTotalBuild', time: categoryTotalBuildTimeEnd - categoryTotalBuildTimeBegin },
      ];
      global.console.log('Profile:');
      profileResults.forEach((result) => {
        global.console.log(`${result.label}: ${result.time.toFixed(3)}msec`);
      });
    }

    // 口座テーブルの列ヘッダ生成
    const accountColHeadCells: JSX.Element[] = [];
    colInfos.forEach((colInfo, colIdx) => {
      let dateText = '#';
      switch (this.props.page.viewUnit) {
        case UiTypes.SheetViewUnit.Day:
          dateText = `${('0' + colInfo.date.year).slice(-2)}/
            ${colInfo.date.month}/${colInfo.date.day} ${IYearMonthDateUtils.localaizedDow(colInfo.date)}`;
          break;
        case UiTypes.SheetViewUnit.Month:
          dateText = `${('000' + colInfo.date.year).slice(-4)}/${colInfo.date.month}`;
          break;
        case UiTypes.SheetViewUnit.Year:
          dateText = `${('000' + colInfo.date.year).slice(-4)}`;
          break;
      }
      accountColHeadCells.push(
        <td key={`account-table-head-col-${colIdx}`} className={colHeadCellClass}>
          {dateText}
        </td>,
      );
    });

    // 口座テーブルのルート行生成
    const accountRootRowDict: { [key: number]: JSX.Element } = {};
    accountGroups.forEach((accountGroup) => {
      let label = '#';
      switch (accountGroup) {
        case DocTypes.AccountGroup.Assets:
          label = '資産';
          break;
        case DocTypes.AccountGroup.Liabilities:
          label = '負債';
          break;
      }
      const cols: JSX.Element[] = [];
      colInfos.forEach((colInfo, colIdx) => {
        const cellInfo: ISelectedCellInfo = {
          colIdx,
          date: colInfo.date,
          accountGroup,
          accountId: null,
          aggregateAccountRoot: null,
          aggregateAccountId: null,
          recordKind: null,
          categoryId: null,
        };
        cols.push(
          <td
            key={`account-root-${accountGroup}-col-${colIdx}`}
            className={Styles.TableCell}
            data-account-group={accountGroup}
            data-col-idx={colIdx}
            data-date={IYearMonthDateUtils.toDataFormatText(colInfo.date)}
            data-root-row={true}
            data-selected={this.isSelectedCell(cellInfo)}
            onClick={(e) => this.onCellClicked(e, cellInfo)}
          >
            {PriceUtils.numToLocaleString(accountGroupCellDataArray[accountGroup][colIdx])}
          </td>,
        );
      });
      accountRootRowDict[accountGroup] = (
        <tr key={`account-root-${accountGroup}`}>
          <td className={rowHeadHolderAccountClass}>
            <div className={Styles.Holder} data-root-row={true}>
              <div className={holderEntryNormalExpanderSpaceClass} data-indent-level={0} data-root-row={true}>
                <button className={expanderBtnClass}>▼</button>
              </div>
              <span className={holderEntryAccountNameClass} data-root-row={true}>
                {label}
              </span>
            </div>
          </td>
          <td className={rowHeadAccountCategoryClass} data-root-row={true}></td>
          <td className={rowHeadAccountCarriedClass} data-root-row={true}>
            {carriedVisible ? PriceUtils.numToLocaleString(accountGroupCarriedData[accountGroup]) : ''}
          </td>
          {cols}
          <td className={Styles.TableCellSpace} data-root-row={true} />
          <td className={rowTailAccountBalance} data-root-row={true}>
            {PriceUtils.numToLocaleString(accountGroupBalanceData[accountGroup])}
          </td>
        </tr>
      );
    });

    // 口座テーブルの非ルート行生成
    const accountRowDict: { [key: number]: JSX.Element[] } = {};
    accountGroups.forEach((accountGroup) => {
      accountRowDict[accountGroup] = new Array<JSX.Element>();
    });
    this.props.doc.account.order.forEach((accountId) => {
      const account = this.props.doc.account.accounts[accountId];
      const accountGroup = DocTypes.accountKindToAccountGroup(account.kind);
      const targetArray = accountRowDict[accountGroup];
      const cols: JSX.Element[] = [];
      colInfos.forEach((colInfo, colIdx) => {
        const cellInfo: ISelectedCellInfo = {
          colIdx,
          date: colInfo.date,
          accountGroup,
          accountId,
          aggregateAccountRoot: null,
          aggregateAccountId: null,
          recordKind: null,
          categoryId: null,
        };
        cols.push(
          <td
            key={`account-${accountId}-col-${colIdx}`}
            className={Styles.TableCell}
            data-account-group={accountGroup}
            data-account-id={account.id}
            data-cell-even={targetArray.length % 2 === 0}
            data-col-idx={colIdx}
            data-date={IYearMonthDateUtils.toDataFormatText(colInfo.date)}
            data-selected={this.isSelectedCell(cellInfo)}
            onClick={(e) => this.onCellClicked(e, cellInfo)}
          >
            {PriceUtils.numToLocaleString(accountCellDataArray[accountId][colIdx])}
          </td>,
        );
      });
      targetArray.push(
        <tr key={`account-${accountId}`}>
          <td className={rowHeadHolderAccountClass}>
            <div className={Styles.Holder}>
              <div className={holderEntryNormalExpanderSpaceClass} data-indent-level={1} />
              <span className={holderEntryAccountNameClass}>{account.name}</span>
            </div>
          </td>
          <td className={rowHeadAccountCategoryClass}>
            {DocTypes.shortLocalizedAccountKind(account.kind).slice(0, 1)}
          </td>
          <td className={rowHeadAccountCarriedClass}>
            {carriedVisible ? PriceUtils.numToLocaleString(accountCarriedData[accountId]) : ''}
          </td>
          {cols}
          <td className={Styles.TableCellSpace}></td>
          <td className={rowTailAccountBalance}>{PriceUtils.numToLocaleString(accountBalanceData[accountId])}</td>
        </tr>,
      );
    });

    // 集計口座テーブルのルート行生成
    let aggregateAccountRootRow: JSX.Element | null = null;
    {
      const cols: JSX.Element[] = [];
      colInfos.forEach((colInfo, colIdx) => {
        const cellInfo: ISelectedCellInfo = {
          colIdx,
          date: colInfo.date,
          accountGroup: null,
          accountId: null,
          aggregateAccountRoot: DocTypes.INVALID_ID, // 何の数値でもOKなので。
          aggregateAccountId: null,
          recordKind: null,
          categoryId: null,
        };
        cols.push(
          <td
            key={`aggregate-account-root-col-${colIdx}`}
            className={Styles.TableCell}
            data-aggregate-account-root={true}
            data-col-idx={colIdx}
            data-date={IYearMonthDateUtils.toDataFormatText(colInfo.date)}
            data-root-row={true}
            data-selected={this.isSelectedCell(cellInfo)}
            onClick={(e) => this.onCellClicked(e, cellInfo)}
          >
            {PriceUtils.numToLocaleString(aggregateAccountSumCellDataArray[colIdx])}
          </td>,
        );
      });
      aggregateAccountRootRow = (
        <tr key={'aggregate-account-root'}>
          <td className={rowHeadHolderAccountClass}>
            <div className={Styles.Holder} data-root-row={true}>
              <div className={holderEntryNormalExpanderSpaceClass} data-indent-level={0} data-root-row={true}>
                <button className={expanderBtnClass}>▼</button>
              </div>
              <span className={holderEntryAccountNameClass} data-root-row={true}>
                {'集計口座'}
              </span>
            </div>
          </td>
          <td className={rowHeadAccountCategoryClass} data-root-row={true}></td>
          <td className={rowHeadAccountCarriedClass} data-root-row={true}>
            {carriedVisible ? PriceUtils.numToLocaleString(aggregateAccountSumCarried) : ''}
          </td>
          {cols}
          <td className={Styles.TableCellSpace} data-root-row={true} />
          <td className={rowTailAccountBalance} data-root-row={true}>
            {PriceUtils.numToLocaleString(aggregateAccountSumBalance)}
          </td>
        </tr>
      );
    }

    // 集計口座テーブルの非ルート行生成
    const aggregateAccountRows: JSX.Element[] = [];
    this.props.doc.aggregateAccount.order.forEach((aggregateAccountId) => {
      const account = this.props.doc.aggregateAccount.accounts[aggregateAccountId];
      const cols: JSX.Element[] = [];
      colInfos.forEach((colInfo, colIdx) => {
        const cellInfo: ISelectedCellInfo = {
          colIdx,
          date: colInfo.date,
          accountGroup: null,
          accountId: null,
          aggregateAccountRoot: null,
          aggregateAccountId,
          recordKind: null,
          categoryId: null,
        };
        cols.push(
          <td
            key={`aggregate-account-${aggregateAccountId}-col-${colIdx}`}
            className={Styles.TableCell}
            data-aggregate-account-id={aggregateAccountId}
            data-cell-even={aggregateAccountRows.length % 2 === 0}
            data-col-idx={colIdx}
            data-date={IYearMonthDateUtils.toDataFormatText(colInfo.date)}
            data-selected={this.isSelectedCell(cellInfo)}
            onClick={(e) => this.onCellClicked(e, cellInfo)}
          >
            {PriceUtils.numToLocaleString(aggregateAccountCellDataArray[aggregateAccountId][colIdx])}
          </td>,
        );
      });
      aggregateAccountRows.push(
        <tr key={`aggregate-account-${aggregateAccountId}`}>
          <td className={rowHeadHolderAccountClass}>
            <div className={Styles.Holder}>
              <div className={holderEntryNormalExpanderSpaceClass} data-indent-level={1} />
              <span className={holderEntryAccountNameClass}>{account.name}</span>
            </div>
          </td>
          <td className={rowHeadAccountCategoryClass}></td>
          <td className={rowHeadAccountCarriedClass}>
            {carriedVisible ? PriceUtils.numToLocaleString(aggregateAccountCarriedData[aggregateAccountId]) : ''}
          </td>
          {cols}
          <td className={Styles.TableCellSpace}></td>
          <td className={rowTailAccountBalance}>
            {PriceUtils.numToLocaleString(aggregateAccountBalanceData[aggregateAccountId])}
          </td>
        </tr>,
      );
    });

    // カテゴリテーブルの列ヘッダ生成
    const categoryColHeadCells: JSX.Element[] = [];
    colInfos.forEach((colInfo, colIdx) => {
      categoryColHeadCells.push(<td key={`category-table-header-${colIdx}`} className={colHeadCellClass}></td>);
    });

    // カテゴリテーブルのルート行生成
    const categoryRootRowDict: { [key: number]: JSX.Element } = {};
    recordKinds.forEach((recordKind) => {
      let label = '#';
      switch (recordKind) {
        case DocTypes.RecordKind.Transfer:
          label = '振替';
          break;
        case DocTypes.RecordKind.Income:
          label = '収入';
          break;
        case DocTypes.RecordKind.Outgo:
          label = '支出';
          break;
      }
      const cols: JSX.Element[] = [];
      colInfos.forEach((colInfo, colIdx) => {
        const categoryId = DocTypes.INVALID_ID;
        const cellInfo: ISelectedCellInfo = {
          colIdx,
          date: colInfo.date,
          accountGroup: null,
          accountId: null,
          aggregateAccountRoot: null,
          aggregateAccountId: null,
          recordKind,
          categoryId: null,
        };
        const amountText =
          recordKindCellDataDictArray[colIdx][recordKind] === null
            ? null
            : PriceUtils.numToLocaleString(Number(recordKindCellDataDictArray[colIdx][recordKind]));
        cols.push(
          <td
            key={`category-root-${recordKind}-col-${colIdx}`}
            className={Styles.TableCell}
            data-category-id={categoryId}
            data-root-row={true}
            data-col-idx={colIdx}
            data-date={IYearMonthDateUtils.toDataFormatText(colInfo.date)}
            data-record-kind={recordKind}
            data-selected={this.isSelectedCell(cellInfo)}
            onClick={(e) => this.onCellClicked(e, cellInfo)}
          >
            {amountText}
          </td>,
        );
      });
      categoryRootRowDict[recordKind] = (
        <tr key={`category-root-${recordKind}`}>
          <td className={rowHeadHolderCategoryClass}>
            <div className={Styles.Holder} data-root-row={true}>
              <div className={holderEntryNormalExpanderSpaceClass} data-indent-level={0} data-root-row={true}>
                <button className={expanderBtnClass}>▼</button>
              </div>
              <span className={holderEntryCategoryNameClass} data-root-row={true}>
                {label}
              </span>
            </div>
          </td>
          {cols}
          <td className={Styles.TableCellSpace} data-root-row={true} />
          <td className={rowTailTotal} data-root-row={true}>
            {recordKindTotalArray[recordKind] === null
              ? null
              : PriceUtils.numToLocaleString(Number(recordKindTotalArray[recordKind]))}
          </td>
        </tr>
      );
    });

    // カテゴリテーブルの非ルート行生成
    const categoryRowDict: { [key: number]: JSX.Element[] } = {};
    recordKinds.forEach((recordKind) => {
      let rootCategoryId: number = DocTypes.INVALID_ID;
      let categories: { [key: number]: DocStates.ICategory } = {};
      let cellDataDictArray: { [key: number]: number | null }[] = [];
      let totalArray: { [key: number]: number | null } = [];
      let rootName = '';
      switch (recordKind) {
        case DocTypes.RecordKind.Transfer:
          return;
        case DocTypes.RecordKind.Income:
          rootCategoryId = this.props.doc.income.rootCategoryId;
          categories = this.props.doc.income.categories;
          cellDataDictArray = incomeCellDataDictArray;
          totalArray = incomeTotalArray;
          rootName = '収入';
          break;
        case DocTypes.RecordKind.Outgo:
          rootCategoryId = this.props.doc.outgo.rootCategoryId;
          categories = this.props.doc.outgo.categories;
          cellDataDictArray = outgoCellDataDictArray;
          totalArray = outgoTotalArray;
          rootName = '支出';
          break;
        default:
          return;
      }
      const categoryIdArray = DocStateMethods.categoryIdArray(rootCategoryId, categories);
      const result = new Array<JSX.Element>();
      const calcIndent = (categoryId: number): number => {
        const parent = categories[categoryId].parent;
        if (parent === null) {
          return 0;
        } else {
          return calcIndent(parent) + 1;
        }
      };
      const calcIsCollapsed = (categoryId: number): boolean => {
        const parent = categories[categoryId].parent;
        if (parent === null) {
          return false;
        }
        if (categories[parent].collapse) {
          return true;
        }
        return calcIsCollapsed(parent);
      };
      categoryIdArray.forEach((categoryId) => {
        const cat = categories[categoryId];
        const catName = cat.parent == null ? rootName : cat.name;
        const cols: JSX.Element[] = [];
        const indent = calcIndent(categoryId);
        const expanderClass = holderEntryNormalExpanderSpaceClass;
        const expanderText = cat.collapse ? '▶' : '▼';
        const expanderElement =
          cat.childs.length === 0 ? null : (
            <button className={expanderBtnClass} onClick={(e) => this.onExpanderClicked(e, categoryId, cat.collapse)}>
              {expanderText}
            </button>
          );
        const rootRow = cat.parent == null;
        colInfos.forEach((colInfo, colIdx) => {
          const cellInfo: ISelectedCellInfo = {
            colIdx,
            date: colInfo.date,
            accountGroup: null,
            accountId: null,
            aggregateAccountRoot: null,
            aggregateAccountId: null,
            recordKind,
            categoryId,
          };
          const amountText =
            cellDataDictArray[colIdx][categoryId] === null
              ? null
              : PriceUtils.numToLocaleString(Number(cellDataDictArray[colIdx][categoryId]));
          cols.push(
            <td
              key={`category-${categoryId}-col-${colIdx}`}
              className={Styles.TableCell}
              data-cell-even={result.length % 2 === 0}
              data-col-idx={colIdx}
              data-date={IYearMonthDateUtils.toDataFormatText(colInfo.date)}
              data-record-kind={recordKind}
              data-root-row={rootRow}
              data-category-id={categoryId}
              data-selected={this.isSelectedCell(cellInfo)}
              onClick={(e) => this.onCellClicked(e, cellInfo)}
            >
              {amountText}
            </td>,
          );
        });
        result.push(
          <tr
            key={`category-${categoryId}`}
            className={Styles.TableRow}
            data-is-collapsed={calcIsCollapsed(categoryId)}
          >
            <td className={rowHeadHolderCategoryClass}>
              <div className={Styles.Holder} data-root-row={rootRow}>
                <div className={expanderClass} data-indent-level={indent} data-root-row={rootRow}>
                  {expanderElement}
                </div>
                <span className={holderEntryCategoryNameClass} data-root-row={rootRow}>
                  {catName}
                </span>
              </div>
            </td>
            {cols}
            <td className={Styles.TableCellSpace} data-root-row={rootRow}></td>
            <td className={rowTailTotal} data-root-row={rootRow}>
              {totalArray[categoryId] === null ? null : PriceUtils.numToLocaleString(Number(totalArray[categoryId]))}
            </td>
          </tr>,
        );
      });
      categoryRowDict[recordKind] = result;
    });

    // ダイアログ
    let modalDialog: JSX.Element | null = null;
    if (this.state.modalRecordEdit) {
      modalDialog = (
        <RecordEditDialog
          formDefaultValue={{
            recordKind: this.state.recordEditDefaultValue.recordKind,
            date: this.state.recordEditDefaultValue.date,
            accountId: this.state.recordEditDefaultValue.accountId,
            categoryId: this.state.recordEditDefaultValue.categoryId,
          }}
          additionalRecords={this.state.recordEditAdditionalRecordKeys}
          onClosed={() => {
            this.setState({ modalRecordEdit: false });
          }}
        />
      );
    }

    return (
      <div id={this.elementIdRoot} className={rootClass}>
        {modalDialog}
        <div id={idPageSheetBodyTop} className={Styles.BodyTop}>
          <table className={Styles.Table}>
            <tbody>
              <tr>
                <td className={colHeadAccountNameClass}>口座</td>
                <td className={colHeadAccountCategoryClass}>*</td>
                <td className={colHeadCarriedClass}>繰り越し</td>
                {accountColHeadCells}
                <td className={colHeadSpaceClass}></td>
                <td className={colHeadBalanceClass}>{labelBalance}</td>
                <td className={colHeadScrollBarSpaceClass}></td>
              </tr>
            </tbody>
          </table>
          <section className={Styles.AccountTableSection}>
            <table className={Styles.Table}>
              <tbody>
                {accountRootRowDict[DocTypes.AccountGroup.Assets]}
                {accountRowDict[DocTypes.AccountGroup.Assets]}
                {accountRootRowDict[DocTypes.AccountGroup.Liabilities]}
                {accountRowDict[DocTypes.AccountGroup.Liabilities]}
                {aggregateAccountRootRow}
                {aggregateAccountRows}
              </tbody>
            </table>
          </section>
        </div>
        <div id={idPageSheetBodyBottom} className={Styles.BodyBottom}>
          <table className={headTableRecordClass}>
            <tbody>
              <tr>
                <td className={colHeadCategoryClass}>カテゴリ</td>
                {categoryColHeadCells}
                <td className={colHeadSpaceClass}></td>
                <td className={colHeadTotalClass}>{labelTotal}</td>
                <td className={colHeadScrollBarSpaceClass}></td>
              </tr>
            </tbody>
          </table>
          <section className={Styles.CategoryTableSection}>
            <table className={Styles.Table}>
              <tbody>
                {categoryRootRowDict[DocTypes.RecordKind.Transfer]}
                {categoryRowDict[DocTypes.RecordKind.Income]}
                {categoryRowDict[DocTypes.RecordKind.Outgo]}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    );
  }

  private isSelectedCell(cellInfo: ISelectedCellInfo) {
    if (this.state.selectedCell === null) {
      return false;
    }

    const current = this.state.selectedCell;
    return (
      current.colIdx === cellInfo.colIdx &&
      current.accountGroup === cellInfo.accountGroup &&
      current.accountId === cellInfo.accountId &&
      current.aggregateAccountRoot === cellInfo.aggregateAccountRoot &&
      current.aggregateAccountId === cellInfo.aggregateAccountId &&
      current.recordKind === cellInfo.recordKind &&
      current.categoryId === cellInfo.categoryId
    );
  }

  private onExpanderClicked(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    categoryId: number,
    currentIsCollapsed: boolean,
  ) {
    // イベント伝搬停止
    e.stopPropagation();

    // 選択中のセルを非選択に
    this.setState({
      selectedCell: null,
    });

    // 状態を反転
    Store.dispatch(DocActions.updateCategoryCollapse(categoryId, !currentIsCollapsed));

    // 自動保存リクエスト
    Store.dispatch(UiActions.documentRequestAutoSave());
  }

  private onCellClicked(e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>, cellInfo: ISelectedCellInfo) {
    // イベント伝搬停止
    e.stopPropagation();

    // 既に選択中のセルならダイアログを開く
    if (this.isSelectedCell(cellInfo)) {
      // 口座の選択
      let accountId = cellInfo.accountId;
      if (accountId === null && cellInfo.accountGroup !== null) {
        // ルートを選択中なら１つめの口座を選択
        const targets = this.props.doc.account.order
          .map((id) => this.props.doc.account.accounts[id])
          .filter((account) => DocTypes.accountKindToAccountGroup(account.kind) === cellInfo.accountGroup);
        if (0 < targets.length) {
          accountId = targets[0].id;
        }
      }

      // カテゴリの選択
      let categoryId = cellInfo.categoryId;
      if (cellInfo.recordKind !== null) {
        // １つめの子カテゴリを選択
        switch (cellInfo.recordKind) {
          case DocTypes.RecordKind.Income:
            categoryId = DocStateMethods.firstLeafCategoryId(
              categoryId !== null ? categoryId : this.props.doc.income.rootCategoryId,
              this.props.doc.income.categories,
            );
            break;
          case DocTypes.RecordKind.Outgo:
            categoryId = DocStateMethods.firstLeafCategoryId(
              categoryId !== null ? categoryId : this.props.doc.outgo.rootCategoryId,
              this.props.doc.outgo.categories,
            );
            break;
          default:
            break;
        }
      }

      // 初期表示するレコード群の設定
      const filters: IRecordFilter[] = [];
      filters.push(
        RecordFilters.createDateRangeFilter({
          startDate: cellInfo.date,
          endDate: IYearMonthDateUtils.nextDate(
            cellInfo.date,
            UiTypes.sheetViewUnitToDateUnit(this.props.page.viewUnit),
          ),
        }),
      );
      if (cellInfo.accountGroup !== null) {
        // 口座による絞り込み
        let accounts: number[] = [];
        if (cellInfo.accountId !== null) {
          // 指定の口座のみ
          accounts.push(cellInfo.accountId);
        } else {
          // 指定の種類の口座全部
          accounts = accounts.concat(
            this.props.doc.account.order.filter(
              (id) =>
                DocTypes.accountKindToAccountGroup(this.props.doc.account.accounts[id].kind) === cellInfo.accountGroup,
            ),
          );
        }
        filters.push(RecordFilters.createAccountFilter({ accounts }));
      }
      if (cellInfo.aggregateAccountRoot != null) {
        // 全集計口座による絞り込み
        const accounts = this.props.doc.aggregateAccount.order
          .map((id) => this.props.doc.aggregateAccount.accounts[id].accounts)
          .reduce((prev, cur) => prev.concat(cur));
        filters.push(RecordFilters.createAccountFilter({ accounts }));
      }
      if (cellInfo.aggregateAccountId != null) {
        // 集計口座による絞り込み
        filters.push(
          RecordFilters.createAccountFilter({
            accounts: this.props.doc.aggregateAccount.accounts[cellInfo.aggregateAccountId].accounts,
          }),
        );
      }
      if (cellInfo.recordKind !== null) {
        const recordKind: DocTypes.RecordKind = cellInfo.recordKind;
        if (cellInfo.categoryId !== null) {
          // カテゴリによる絞り込み
          let categories: { [key: number]: DocStates.ICategory } | null = null;
          switch (cellInfo.recordKind) {
            case DocTypes.RecordKind.Income:
              categories = this.props.doc.income.categories;
              break;
            case DocTypes.RecordKind.Outgo:
              categories = this.props.doc.outgo.categories;
              break;
            default:
              break;
          }
          if (categories !== null) {
            filters.push(
              RecordFilters.createCategoryFilter({
                targets: DocStateMethods.leafCategoryIdArray(cellInfo.categoryId, categories).map<{
                  kind: DocTypes.RecordKind;
                  categoryId: number;
                }>((id) => ({ kind: recordKind, categoryId: id })),
              }),
            );
          }
        } else {
          // レコードの種類による絞り込み
          filters.push(RecordFilters.createRecordKindFilter({ kinds: [recordKind] }));
        }
      }
      const recordKeys = new RecordCollection(this.props.doc).filter(filters).standardSortedKeys();

      // ダイアログオープン
      this.setState({
        modalRecordEdit: true,
        recordEditDefaultValue: {
          recordKind: cellInfo.recordKind !== null ? cellInfo.recordKind : DocTypes.RecordKind.Outgo,
          date: cellInfo.date,
          accountId,
          categoryId,
        },
        recordEditAdditionalRecordKeys: recordKeys,
      });
      return;
    }

    // 選択
    this.setState({
      selectedCell: cellInfo,
    });
  }

  private updateColCount() {
    const headWidth = 275;
    const tailWidth = 107;
    const colWidth = 94;
    const elem = document.getElementById(this.elementIdRoot);
    if (elem === null) {
      return;
    }
    const clientWidth = elem.clientWidth;
    this.setState({
      colCount: Math.max(1, Math.floor((clientWidth - headWidth - tailWidth) / colWidth)),
    });
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    doc: state.doc,
    page: state.ui.pageSheet,
  };
};
export default ReactRedux.connect(mapStateToProps)(Body);
