import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import Split from 'split.js';

import * as DocStateMethods from 'src/state/doc/StateMethods';
import * as DocStates from 'src/state/doc/States';
import * as DocTypes from 'src/state/doc/Types';
import IStoreState from 'src/state/IStoreState';
import * as UiStates from 'src/state/ui/States';
import * as UiTypes from 'src/state/ui/Types';
import BalanceCalculator from 'src/util/doc/BalanceCalculator';
import RecordCollection from 'src/util/doc/RecordCollection';
import * as RecordFilters from 'src/util/doc/RecordFilters';
import IYearMonthDayDate from 'src/util/IYearMonthDayDate';
import * as IYearMonthDateUtils from 'src/util/IYearMonthDayDateUtils';
import * as PriceUtils from 'src/util/PriceUtils';
import * as BasicStyles from 'src/view/Basic.css';
import * as Styles from './Body.css';

interface IProps {
  doc: DocStates.IState;
  page: UiStates.IPageSheet;
}

const idPageSheetBodyTop = 'pageSheetBodyTop';
const idPageSheetBodyBottom = 'pageSheetBodyBottom';

class Body extends React.Component<IProps, any> {
  public constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    // スピリッター登録
    Split(
      [`#${idPageSheetBodyTop}`, `#${idPageSheetBodyBottom}`],
      {
        sizes: [25, 75],
        gutterSize: 12,
        cursor: 'row-resize',
        direction: 'vertical',
      },
    );
  }

  public render() {
    const rootClass = ClassNames(
      Styles.Root,
    );
    const headTableRecordClass = ClassNames(
      Styles.Table,
      Styles.HeadTableRecord,
    );

    // colHead
    const colHeadAccountNameClass = ClassNames(
      Styles.TableColHead,
      Styles.TableColHeadAccountName,
    );
    const colHeadAccountCategoryClass = ClassNames(
      Styles.TableColHead,
      Styles.TableColHeadAccountCategory,
    );
    const colHeadCarriedClass = ClassNames(
      Styles.TableColHead,
      Styles.TableColHeadCarried,
    );
    const colHeadCellClass = ClassNames(
      Styles.TableColHead,
      Styles.TableColHeadCell,
    );
    const colHeadSpaceClass = ClassNames(
      Styles.TableColHead,
      Styles.TableColHeadSpace,
    );
    const colHeadBalanceClass = ClassNames(
      Styles.TableColHead,
      Styles.TableColHeadBalance,
    );
    const colHeadCategoryClass = ClassNames(
      Styles.TableColHead,
      Styles.TableColHeadCategory,
    );
    const colHeadTotalClass = ClassNames(
      Styles.TableColHead,
      Styles.TableColHeadTotal,
    );
    const colHeadScrollBarSpaceClass = ClassNames(
      Styles.TableColHead,
      Styles.TableColHeadScrollBarSpace,
    );

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
    const rowHeadRootAccountCategoryClass = ClassNames(
      Styles.TableRowHead,
      Styles.TableRowHeadRoot,
      Styles.TableRowHeadAccountCategory,
    );
    const rowHeadRootAccountCarriedClass = ClassNames(
      Styles.TableRowHead,
      Styles.TableRowHeadRoot,
      Styles.TableRowHeadCarried,
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
    const rowHeadCategoryOpenerSpaceClass = ClassNames(
      Styles.TableRowHead,
      Styles.TableRowHeadCategory,
      Styles.HolderEntryOpenerSpaceIndent1,
    );

    // rowTail
    const rowTailRootAccountBalance = ClassNames(
      Styles.TableRowTail,
      Styles.TableRowTailRoot,
      Styles.TableRowTailBalance,
    );
    const rowTailAccountBalance = ClassNames(
      Styles.TableRowTail,
      Styles.TableRowTailBalance,
    );
    const rowTailRootTotal = ClassNames(
      Styles.TableRowTail,
      Styles.TableRowTailRoot,
      Styles.TableRowTailTotal,
    );
    const rowTailTotal = ClassNames(
      Styles.TableRowTail,
      Styles.TableRowTailTotal,
    );

    // holderEntry
    const holderEntryRootOpenerSpaceClass = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryRoot,
      Styles.HolderEntryOpenerSpace,
      Styles.HolderEntryRootOpenerSpace,
      Styles.HolderEntryOpenerSpaceIndent0,
    );
    const holderEntryNormalOpenerSpaceIndent1Class = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryOpenerSpace,
      Styles.HolderEntryNormalOpenerSpace,
      Styles.HolderEntryOpenerSpaceIndent1,
    );
    const holderEntryNormalOpenerSpaceIndent2Class = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryOpenerSpace,
      Styles.HolderEntryNormalOpenerSpace,
      Styles.HolderEntryOpenerSpaceIndent2,
    );
    const holderEntryNormalOpenerSpaceIndent3Class = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryOpenerSpace,
      Styles.HolderEntryNormalOpenerSpace,
      Styles.HolderEntryOpenerSpaceIndent3,
    );
    const holderEntryNormalOpenerSpaceIndent4Class = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryOpenerSpace,
      Styles.HolderEntryNormalOpenerSpace,
      Styles.HolderEntryOpenerSpaceIndent4,
    );
    const holderEntryNormalOpenerSpaceIndent5Class = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryOpenerSpace,
      Styles.HolderEntryNormalOpenerSpace,
      Styles.HolderEntryOpenerSpaceIndent5,
    );
    const holderEntryNormalOpenerSpaceIndent6Class = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryOpenerSpace,
      Styles.HolderEntryNormalOpenerSpace,
      Styles.HolderEntryOpenerSpaceIndent6,
    );
    const holderEntryNormalOpenerSpaceIndent7Class = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryOpenerSpace,
      Styles.HolderEntryNormalOpenerSpace,
      Styles.HolderEntryOpenerSpaceIndent7,
    );
    const holderEntryRootAccountNameClass = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryRoot,
      Styles.HolderEntryRootAccountName,
    );
    const holderEntryNormalAccountNameClass = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryAccountName,
      Styles.HolderEntryNormalAccountName,
    );
    const holderEntryRootCategoryNameClass = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryRoot,
      Styles.HolderEntryRootCategoryName,
    );
    const holderEntryNormalCategoryNameClass = ClassNames(
      Styles.HolderEntry,
      Styles.HolderEntryCategoryName,
      Styles.HolderEntryNormalCategoryName,
    );

    // cell
    const cellRootClass = ClassNames(
      Styles.TableCell,
      Styles.TableCellRoot,
    );
    const cellSpaceRootClass = ClassNames(
      Styles.TableCellSpace,
      Styles.TableCellRoot,
    );
    const cellOddClass = ClassNames(
      Styles.TableCell,
      Styles.TableCellOdd,
    );
    const cellEvenClass = ClassNames(
      Styles.TableCell,
      Styles.TableCellEven,
    );
    const cellSpaceClass = ClassNames(
      Styles.TableCellSpace,
    );

    // その他
    const iconClass = ClassNames(
      'material-icons',
      'md-16',
    );
    const openerBtnClass = ClassNames(
      BasicStyles.IconButton,
      Styles.OpenerBtn,
    );

    // 列情報生成
    const colInfos = new Array();
    const colCount = 6;
    const colBeginDate = this.props.page.currentDate;
    let colEndDate = colBeginDate;
    {
      let date = this.props.page.currentDate;
      for (let colIdx = 0; colIdx < colCount; ++colIdx) {
        colInfos.push({
          date,
        });
        date = IYearMonthDateUtils.nextDate(
          date,
          UiTypes.sheetViewUnitToDateUnit(this.props.page.viewUnit));
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
    const accountGroups = [
      DocTypes.AccountGroup.Assets,
      DocTypes.AccountGroup.Liabilities,
    ];
    const recordKinds = [
      DocTypes.RecordKind.Transfer,
      DocTypes.RecordKind.Income,
      DocTypes.RecordKind.Outgo,
    ];

    // アカウントテーブルのデータ作成
    const accountCarriedData: {[key: number]: number} = {};
    const accountCellDataArray: {[key: number]: number[]} = {};
    const accountBalanceData: {[key: number]: number} = {};
    this.props.doc.account.order.forEach((accountId) => {
      // 繰り越しデータ計算
      const account = this.props.doc.account.accounts[accountId];
      const sign = DocTypes.accountKindToAccountGroup(account.kind) !== DocTypes.AccountGroup.Liabilities ?
        1 : -1;
      const firstCalculator = new BalanceCalculator(
        this.props.doc,
        colBeginDate,
        [accountId],
        null);
      accountCarriedData[accountId] = sign * firstCalculator.sumBalance();

      // 各列のデータ計算
      const cellDataArray: number[] = [];
      let calculator = firstCalculator;
      colInfos.forEach((colInfo, colIdx) => {
        const nextColIdx = colIdx + 1;
        calculator = new BalanceCalculator(
          this.props.doc,
          nextColIdx < colInfos.length ? colInfos[nextColIdx].date : colEndDate,
          [accountId],
          calculator);
        cellDataArray[colIdx] = sign * calculator.sumBalance();
      });
      accountCellDataArray[accountId] = cellDataArray;

      // 残高データ計算
      calculator = new BalanceCalculator(
        this.props.doc,
        totalEndDate,
        [accountId],
        firstCalculator);
      accountBalanceData[accountId] = sign * calculator.sumBalance();
    });

    // アカウントルート行のデータ作成
    const accountGroupCarriedData: {[key: number]: number} = {};
    const accountGroupCellDataArray: {[key: number]: number[]} = {};
    const accountGroupBalanceData: {[key: number]: number} = {};
    accountGroups.forEach((accountGroup) => {
      // メモ
      const accountIdArray =
        Object.keys(accountCarriedData).filter((data) =>
          DocTypes.accountKindToAccountGroup(this.props.doc.account.accounts[Number(data)].kind) === accountGroup);

      // 繰り越しデータ計算
      accountGroupCarriedData[accountGroup] =
        accountIdArray.map((accountId) => accountCarriedData[Number(accountId)])
        .reduce((prev, current) => prev + current);

      // 各列のデータ
      const cellDataArray: number[] = [];
      colInfos.forEach((colInfo, colIdx) => {
        cellDataArray[colIdx] =
          accountIdArray.map((accountId) => accountCellDataArray[Number(accountId)][colIdx])
          .reduce((prev, current) => prev + current);
      });
      accountGroupCellDataArray[accountGroup] = cellDataArray;

      // 残高データ計算
      accountGroupBalanceData[accountGroup] =
        accountIdArray.map((accountId) => accountBalanceData[Number(accountId)])
        .reduce((prev, current) => prev + current);
    });

    // カテゴリテーブルのデータ生成の準備
    const recordsForCellData = new RecordCollection(this.props.doc, null).filter([
      RecordFilters.createDateRangeFilter({startDate: colBeginDate, endDate: colEndDate}),
    ]);
    const recordsForTotal = new RecordCollection(this.props.doc, null).filter([
      RecordFilters.createDateRangeFilter({startDate: totalBeginDate, endDate: totalEndDate}),
    ]);
    const recordKindCellDataDictArray = new Array<{[key: number]: (number | null)}>(colInfos.length);
    const recordKindTotalArray: {[key: number]: number | null} = {};
    const incomeLeafCategoriesArray: {[key: number]: number[]} = {};
    const incomeCellDataDictArray = new Array<{[key: number]: (number | null)}>(colInfos.length);
    const incomeTotalArray: {[key: number]: number | null} = {};
    const outgoLeafCategoriesArray: {[key: number]: number[]} = {};
    const outgoCellDataDictArray = new Array<{[key: number]: (number | null)}>(colInfos.length);
    const outgoTotalArray: {[key: number]: number | null} = {};
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
    DocStateMethods.categoryIdArray(this.props.doc.income.categoryRootOrder, this.props.doc.income.categories)
      .forEach((id) => {
        incomeLeafCategoriesArray[id] = DocStateMethods.leafCategoryIdArray(id, this.props.doc.income.categories);
        incomeCellDataDictArray.forEach((entry, colIdx) => {
          incomeCellDataDictArray[colIdx][id] = null;
        });
        incomeTotalArray[id] = null;
      });
    DocStateMethods.categoryIdArray(this.props.doc.outgo.categoryRootOrder, this.props.doc.outgo.categories)
      .forEach((id) => {
        outgoLeafCategoriesArray[id] = DocStateMethods.leafCategoryIdArray(id, this.props.doc.outgo.categories);
        outgoCellDataDictArray.forEach((entry, colIdx) => {
          outgoCellDataDictArray[colIdx][id] = null;
        });
        outgoTotalArray[id] = null;
      });

    // カテゴリテーブルの各列データ生成
    const toCellDataFuncs: {[key: number]: ((ids: number[]) => number | null)} = {};
    toCellDataFuncs[DocTypes.RecordKind.Transfer] = (ids) => {
      return ids.length === 0 ? null :
        ids.map((id) => this.props.doc.transfer.records[id].amount)
          .reduce((prev, cur) => prev + cur, 0);
    };
    toCellDataFuncs[DocTypes.RecordKind.Income] = (ids) => {
      return ids.length === 0 ? null :
        ids.map((id) => this.props.doc.income.records[id].amount)
          .reduce((prev, cur) => prev + cur, 0);
    };
    toCellDataFuncs[DocTypes.RecordKind.Outgo] = (ids) => {
      return ids.length === 0 ? null :
        ids.map((id) => this.props.doc.outgo.records[id].amount)
          .reduce((prev, cur) => prev + cur, 0);
    };
    const calcSumFunc = (
      catIds: number[],
      data: {[key: number]: (number | null)},
      ): number | null => {
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
        RecordFilters.createDateRangeFilter({startDate: colInfo.date, endDate: nextDate}),
      ]);

      // RecordKind 毎の全レコード集計
      recordKindCellDataDictArray[colIdx][DocTypes.RecordKind.Transfer] =
        toCellDataFuncs[DocTypes.RecordKind.Transfer](records.transfers);
      recordKindCellDataDictArray[colIdx][DocTypes.RecordKind.Income] =
        toCellDataFuncs[DocTypes.RecordKind.Income](records.incomes);
      recordKindCellDataDictArray[colIdx][DocTypes.RecordKind.Outgo] =
        toCellDataFuncs[DocTypes.RecordKind.Outgo](records.outgos);

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
        incomeCellDataDictArray[colIdx][catId] =
          calcSumFunc(incomeLeafCategoriesArray[catId], incomeCellDataDictArray[colIdx]);
      });
      Object.keys(outgoCellDataDictArray[colIdx]).forEach((id) => {
        const catId = Number(id);
        outgoCellDataDictArray[colIdx][catId] =
          calcSumFunc(outgoLeafCategoriesArray[catId], outgoCellDataDictArray[colIdx]);
      });
    });

    // カテゴリテーブルの合計データ生成
    Object.keys(recordKindTotalArray).forEach((key) => {
      const id = Number(key);
      switch (id) {
        case DocTypes.RecordKind.Transfer:
          recordKindTotalArray[id] = recordsForTotal.transfers.length === 0 ? null :
            recordsForTotal.sumAmountTransfer();
          break;
        case DocTypes.RecordKind.Income:
          recordKindTotalArray[id] = recordsForTotal.incomes.length === 0 ? null :
            recordsForTotal.sumAmountIncome();
          break;
        case DocTypes.RecordKind.Outgo:
          recordKindTotalArray[id] = recordsForTotal.outgos.length === 0 ? null :
            recordsForTotal.sumAmountOutgo();
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

    // アカウントテーブルの列ヘッダ生成
    const accountColHeadCells = new Array();
    colInfos.forEach((colInfo) => {
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
        <td className={colHeadCellClass}>{dateText}</td>,
      );
    });

    // アカウントテーブルのルート行生成
    const accountRootRowDict: {[key: number]: JSX.Element} = {};
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
      const cols = new Array();
      colInfos.forEach((colInfo, colIdx) => {
        cols.push(<td className={cellRootClass}>
          {PriceUtils.numToLocaleString(accountGroupCellDataArray[accountGroup][colIdx])}
          </td>);
      });
      accountRootRowDict[accountGroup] =
        <tr>
          <td className={rowHeadHolderAccountClass}>
            <div className={Styles.Holder}>
              <div className={holderEntryRootOpenerSpaceClass}>
                <button className={openerBtnClass}>▼</button>
              </div>
              <span className={holderEntryRootAccountNameClass}>{label}</span>
            </div>
          </td>
          <td className={rowHeadRootAccountCategoryClass}></td>
          <td className={rowHeadRootAccountCarriedClass}>
            {carriedVisible ? PriceUtils.numToLocaleString(accountGroupCarriedData[accountGroup]) : ''}
          </td>
          {cols}
          <td className={cellSpaceRootClass}></td>
          <td className={rowTailRootAccountBalance}>
            {PriceUtils.numToLocaleString(accountGroupBalanceData[accountGroup])}
          </td>
        </tr>;
    });

    // アカウントテーブルの非ルート行生成
    const accountRowDict: {[key: number]: JSX.Element[]} = {};
    accountGroups.forEach((accountGroup) => {
      accountRowDict[accountGroup] = new Array<JSX.Element>();
    });
    const accountRows = new Array();
    this.props.doc.account.order.forEach((accountId) => {
      const account = this.props.doc.account.accounts[accountId];
      const accountGroup = DocTypes.accountKindToAccountGroup(account.kind);
      const targetArray = accountRowDict[accountGroup];
      const cols = new Array();
      colInfos.forEach((colInfo, idx) => {
        cols.push(
          <td className={(targetArray.length) % 2 === 0 ?
            cellEvenClass :
            cellOddClass}>{PriceUtils.numToLocaleString(accountCellDataArray[accountId][idx])}</td>);
      });
      targetArray.push(
        <tr>
          <td className={rowHeadHolderAccountClass}>
            <div className={Styles.Holder}>
              <div className={holderEntryNormalOpenerSpaceIndent1Class}></div>
              <span className={holderEntryNormalAccountNameClass}>{account.name}</span>
            </div>
          </td>
          <td className={rowHeadAccountCategoryClass}>
            {DocTypes.shortLocalizedAccountKind(account.kind).slice(0, 1)}
          </td>
          <td className={rowHeadAccountCarriedClass}>
            {carriedVisible ? PriceUtils.numToLocaleString(accountCarriedData[accountId]) : ''}
          </td>
          {cols}
          <td className={cellSpaceClass}></td>
          <td className={rowTailAccountBalance}>{PriceUtils.numToLocaleString(accountBalanceData[accountId])}</td>
        </tr>,
      );
    });

    // カテゴリテーブルの列ヘッダ生成
    const categoryColHeadCells = new Array();
    colInfos.forEach((colInfo) => {
      categoryColHeadCells.push(
        <td className={colHeadCellClass}></td>,
      );
    });

    // カテゴリテーブルのルート行生成
    const categoryRootRowDict: {[key: number]: JSX.Element} = {};
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
      const cols = new Array();
      colInfos.forEach((colInfo, colIdx) => {
        cols.push(<td className={cellRootClass}>
          {
            recordKindCellDataDictArray[colIdx][recordKind] === null ? null :
              PriceUtils.numToLocaleString(Number(recordKindCellDataDictArray[colIdx][recordKind]))
          }
        </td>);
      });
      categoryRootRowDict[recordKind] =
        <tr>
          <td className={rowHeadHolderCategoryClass}>
            <div className={Styles.Holder}>
              <div className={holderEntryRootOpenerSpaceClass}>
                <button className={openerBtnClass}>▼</button>
              </div>
              <span className={holderEntryRootCategoryNameClass}>{label}</span>
            </div>
          </td>
          {cols}
          <td className={cellSpaceRootClass}></td>
          <td className={rowTailRootTotal}>
            {
              recordKindTotalArray[recordKind] === null ? null :
                PriceUtils.numToLocaleString(Number(recordKindTotalArray[recordKind]))
            }
          </td>
        </tr>;
    });

    // カテゴリテーブルの非ルート行生成
    const categoryRowDict: {[key: number]: JSX.Element[]} = {};
    recordKinds.forEach((recordKind) => {
      let categoryRootOrder: number[] = [];
      let categories: {[key: number]: DocStates.ICategory} = {};
      let cellDataDictArray: Array<{[key: number]: (number | null)}> = [];
      let totalArray: {[key: number]: number | null} = [];
      switch (recordKind) {
        case DocTypes.RecordKind.Transfer: return;
        case DocTypes.RecordKind.Income:
          categoryRootOrder = this.props.doc.income.categoryRootOrder;
          categories = this.props.doc.income.categories;
          cellDataDictArray = incomeCellDataDictArray;
          totalArray = incomeTotalArray;
          break;
        case DocTypes.RecordKind.Outgo:
          categoryRootOrder = this.props.doc.outgo.categoryRootOrder;
          categories = this.props.doc.outgo.categories;
          cellDataDictArray = outgoCellDataDictArray;
          totalArray = outgoTotalArray;
          break;
        default:
          return;
      }
      const categoryIdArray = DocStateMethods.categoryIdArray(categoryRootOrder, categories);
      const result = new Array<JSX.Element>();
      const calcIndent = (categoryId: number): number => {
        const parent = categories[categoryId].parent;
        if (parent === null) {
          return 1;
        } else {
          return calcIndent(parent) + 1;
        }
      };
      categoryIdArray.forEach((categoryId) => {
        const cat = categories[categoryId];
        const cols = new Array();
        const indent = calcIndent(categoryId);
        let openerClass = holderEntryNormalOpenerSpaceIndent7Class;
        switch (indent) {
          case 1:
            openerClass = holderEntryNormalOpenerSpaceIndent1Class;
            break;
          case 2:
            openerClass = holderEntryNormalOpenerSpaceIndent2Class;
            break;
          case 3:
            openerClass = holderEntryNormalOpenerSpaceIndent3Class;
            break;
          case 4:
            openerClass = holderEntryNormalOpenerSpaceIndent4Class;
            break;
          case 5:
            openerClass = holderEntryNormalOpenerSpaceIndent5Class;
            break;
          case 6:
            openerClass = holderEntryNormalOpenerSpaceIndent6Class;
            break;
          case 7:
            openerClass = holderEntryNormalOpenerSpaceIndent7Class;
            break;
        }
        const openerElement = cat.childs.length === 0 ?
          null :
          <button className={openerBtnClass}>▼</button>;
        colInfos.forEach((colInfo, colIdx) => {
          cols.push(<td className={(result.length % 2) === 0 ? cellEvenClass : cellOddClass}>
            {
              cellDataDictArray[colIdx][categoryId] === null ? null :
                PriceUtils.numToLocaleString(Number(cellDataDictArray[colIdx][categoryId]))
            }
          </td>);
        });
        result.push(
          <tr>
            <td className={rowHeadHolderCategoryClass}>
              <div className={Styles.Holder}>
                <div className={openerClass}>
                  {openerElement}
                </div>
                <span className={holderEntryNormalCategoryNameClass}>{cat.name}</span>
              </div>
            </td>
            {cols}
            <td className={cellSpaceClass}></td>
            <td className={rowTailTotal}>
              {
                totalArray[categoryId] === null ? null :
                  PriceUtils.numToLocaleString(Number(totalArray[categoryId]))
              }
            </td>
          </tr>);
      });
      categoryRowDict[recordKind] = result;
    });

    return (
      <div className={rootClass}>
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
                {categoryRootRowDict[DocTypes.RecordKind.Income]}
                {categoryRowDict[DocTypes.RecordKind.Income]}
                {categoryRootRowDict[DocTypes.RecordKind.Outgo]}
                {categoryRowDict[DocTypes.RecordKind.Outgo]}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    doc: state.doc,
    page: state.ui.pageSheet,
  };
};
export default ReactRedux.connect(mapStateToProps)(Body);
