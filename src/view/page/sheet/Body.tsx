import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as DocStates from 'src/state/doc/States';
import * as DocTypes from 'src/state/doc/Types';
import IStoreState from 'src/state/IStoreState';
import * as UiStates from 'src/state/ui/States';
import * as IYearMonthDateUtils from 'src/util/IYearMonthDayDateUtils';
import * as Styles from './Body.css';

interface IProps {
  doc: DocStates.IState;
  page: UiStates.IPageSheet;
}

class Body extends React.Component<IProps, any> {
  public constructor(props: IProps) {
    super(props);
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
    const colHeadRecordCategoryClass = ClassNames(
      Styles.TableColHead,
      Styles.TableColHeadRecordCategory,
    );
    const colHeadTotalClass = ClassNames(
      Styles.TableColHead,
      Styles.TableColHeadTotal,
    );

    // rowHead
    const rowHeadRootOpenerSpaceClass = ClassNames(
      Styles.TableRowHead,
      Styles.TableRowHeadRoot,
      Styles.TableOpenerSpace,
    );
    const rowHeadRootAccountNameClass = ClassNames(
      Styles.TableRowHead,
      Styles.TableRowHeadRoot,
      Styles.TableRowHeadAccountName,
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
    const rowHeadAccountOpenerSpaceClass = ClassNames(
      Styles.TableRowHead,
      Styles.TableRowHeadAccount,
      Styles.TableOpenerSpace,
    );
    const rowHeadAccountNameClass = ClassNames(
      Styles.TableRowHead,
      Styles.TableRowHeadAccount,
      Styles.TableRowHeadAccountName,
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
    const rowTailRootAccountBalance = ClassNames(
      Styles.TableRowTail,
      Styles.TableRowTailRoot,
      Styles.TableRowTailBalance,
    );
    const rowTailAccountBalance = ClassNames(
      Styles.TableRowTail,
      Styles.TableRowTailBalance,
    );
    const rowHeadRootRecordCategoryClass = ClassNames(
      Styles.TableRowHead,
      Styles.TableRowHeadRoot,
      Styles.TableRowHeadRecordCategory,
    );
    const rowTailRootTotal = ClassNames(
      Styles.TableRowTail,
      Styles.TableRowTailRoot,
      Styles.TableRowTailTotal,
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
    const cellClass = ClassNames(
      Styles.TableCell,
      Styles.TableCellOdd,
    );
    const cellSpaceClass = ClassNames(
      Styles.TableCellSpace,
    );

    // 列情報生成
    const colInfos = new Array();
    const colCount = 6;
    {
      let date = this.props.page.currentDate;
      for (let colIdx = 0; colIdx < colCount; ++colIdx) {
        colInfos.push({
          date,
        });
        date = IYearMonthDateUtils.nextDay(date);
      }
    }

    // アカウントテーブルの列ヘッダ生成
    const accountColHeadCells = new Array();
    colInfos.forEach((colInfo) => {
      accountColHeadCells.push(
        <td className={colHeadCellClass}>
        {('0' + colInfo.date.year).slice(-2)}/
        {colInfo.date.month}/{colInfo.date.day} {IYearMonthDateUtils.localaizedDow(colInfo.date)}
        </td>,
      );
    });

    // アカウントテーブルのルート行生成
    const accountGroups = [
      DocTypes.AccountGroup.Assets,
      DocTypes.AccountGroup.Liabilities,
    ];
    const accountRootRowDict: {[key: number]: JSX.Element} = {};
    accountGroups.forEach((accountGroup) => {
      let label = '#';
      switch (accountGroup) {
        case DocTypes.AccountGroup.Assets:
          label = '資産アカウント';
          break;
        case DocTypes.AccountGroup.Liabilities:
          label = '負債アカウント';
          break;
      }
      const cols = new Array();
      colInfos.forEach((colInfo) => {
        cols.push(<td className={cellRootClass}>10,000,000</td>);
      });
      accountRootRowDict[accountGroup] =
        <tr>
          <td className={rowHeadRootOpenerSpaceClass}></td>
          <td className={rowHeadRootAccountNameClass}>{label}</td>
          <td className={rowHeadRootAccountCategoryClass}></td>
          <td className={rowHeadRootAccountCarriedClass}>10,000,000</td>
          {cols}
          <td className={cellSpaceRootClass}></td>
          <td className={rowTailRootAccountBalance}>1,000,000</td>
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
      const cols = new Array();
      colInfos.forEach((colInfo) => {
        cols.push(<td className={cellClass}>10,000,000</td>);
      });
      accountRowDict[accountGroup].push(
        <tr>
          <td className={rowHeadAccountOpenerSpaceClass}></td>
          <td className={rowHeadAccountNameClass}>{account.name}</td>
          <td className={rowHeadAccountCategoryClass}>
            {DocTypes.shortLocalizedAccountKind(account.kind).slice(0, 1)}
          </td>
          <td className={rowHeadAccountCarriedClass}>10,000,000</td>
          {cols}
          <td className={cellSpaceClass}></td>
          <td className={rowTailAccountBalance}>1,000,000</td>
        </tr>,
      );
    });

    // レコードテーブルの列ヘッダ生成
    const recordColHeadCells = new Array();
    colInfos.forEach((colInfo) => {
      recordColHeadCells.push(
        <td className={colHeadCellClass}></td>,
      );
    });

    // レコードテーブルのルート行生成
    const recordKinds = [
      DocTypes.RecordKind.Transfer,
      DocTypes.RecordKind.Income,
      DocTypes.RecordKind.Outgo,
    ];
    const recordRootRowDict: {[key: number]: JSX.Element} = {};
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
      colInfos.forEach((colInfo) => {
        cols.push(<td className={cellRootClass}></td>);
      });
      recordRootRowDict[recordKind] =
        <tr>
          <td className={rowHeadRootOpenerSpaceClass}></td>
          <td className={rowHeadRootRecordCategoryClass}>{label}</td>
          {cols}
          <td className={cellSpaceRootClass}></td>
          <td className={rowTailRootTotal}>1,000,000</td>
        </tr>;
    });

    return (
      <div className={rootClass}>
        <div id="pageSheetBodyTop">
          <table className={Styles.Table}>
            <tbody>
              <tr>
                <td className={colHeadAccountNameClass}>アカウント</td>
                <td className={colHeadAccountCategoryClass}>*</td>
                <td className={colHeadCarriedClass}>繰り越し</td>
                {accountColHeadCells}
                <td className={colHeadSpaceClass}></td>
                <td className={colHeadBalanceClass}>残高</td>
              </tr>
            </tbody>
          </table>
          <table className={Styles.Table}>
            <tbody>
              {accountRootRowDict[DocTypes.AccountGroup.Assets]}
              {accountRowDict[DocTypes.AccountGroup.Assets]}
              {accountRootRowDict[DocTypes.AccountGroup.Liabilities]}
              {accountRowDict[DocTypes.AccountGroup.Liabilities]}
            </tbody>
          </table>
        </div>
        <div id="pageSheetBodyBottom">
          <table className={headTableRecordClass}>
            <tbody>
              <tr>
                <td className={colHeadRecordCategoryClass}>カテゴリ</td>
                {recordColHeadCells}
                <td className={colHeadSpaceClass}></td>
                <td className={colHeadTotalClass}>合計</td>
              </tr>
            </tbody>
          </table>
          <table className={Styles.Table}>
            <tbody>
              {recordRootRowDict[DocTypes.RecordKind.Transfer]}
              {recordRootRowDict[DocTypes.RecordKind.Income]}
              {recordRootRowDict[DocTypes.RecordKind.Outgo]}
            </tbody>
          </table>
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
