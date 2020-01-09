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
    const colHeadAccountNameClass = ClassNames(
      Styles.TableColhead,
      Styles.TableColheadAccountName,
    );
    const colHeadAccountCategoryClass = ClassNames(
      Styles.TableColhead,
      Styles.TableColheadAccountCategory,
    );
    const colHeadCarriedClass = ClassNames(
      Styles.TableColhead,
      Styles.TableColheadCarried,
    );
    const colHeadCellClass = ClassNames(
      Styles.TableColhead,
      Styles.TableColheadCell,
    );
    const colHeadSpaceClass = ClassNames(
      Styles.TableColhead,
      Styles.TableColheadSpace,
    );
    const colHeadBalanceClass = ClassNames(
      Styles.TableColhead,
      Styles.TableColheadBalance,
    );
    const colHeadRecordCategoryClass = ClassNames(
      Styles.TableColhead,
      Styles.TableColheadRecordCategory,
    );
    const colHeadTotalClass = ClassNames(
      Styles.TableColhead,
      Styles.TableColheadTotal,
    );
    const rowHeadRootOpenerSpaceClass = ClassNames(
      Styles.TableRowhead,
      Styles.TableRowheadRoot,
      Styles.TableOpenerSpace,
    );
    const rowHeadRootAccountNameClass = ClassNames(
      Styles.TableRowhead,
      Styles.TableRowheadRoot,
      Styles.TableRowheadAccountName,
    );
    const rowHeadRootAccountCategoryClass = ClassNames(
      Styles.TableRowhead,
      Styles.TableRowheadRoot,
      Styles.TableRowheadAccountCategory,
    );
    const rowHeadRootAccountCarriedClass = ClassNames(
      Styles.TableRowhead,
      Styles.TableRowheadRoot,
      Styles.TableRowheadCarried,
    );
    const cellRootClass = ClassNames(
      Styles.TableCell,
      Styles.TableCellRoot,
    );
    const cellSpaceRootClass = ClassNames(
      Styles.TableCellSpace,
      Styles.TableCellRoot,
    );
    const rowHeadAccountOpenerSpaceClass = ClassNames(
      Styles.TableRowhead,
      Styles.TableRowheadAccount,
      Styles.TableOpenerSpace,
    );
    const rowHeadAccountAccountNameClass = ClassNames(
      Styles.TableRowhead,
      Styles.TableRowheadAccount,
      Styles.TableRowheadAccountName,
    );
    const rowHeadAccountAccountCategoryClass = ClassNames(
      Styles.TableRowhead,
      Styles.TableRowheadAccount,
      Styles.TableRowheadAccountCategory,
    );
    const rowHeadAccountAccountCarriedClass = ClassNames(
      Styles.TableRowhead,
      Styles.TableRowheadAccount,
      Styles.TableRowheadCarried,
    );
    const rowTailRootAccountBalance = ClassNames(
      Styles.TableRowtail,
      Styles.TableRowtailRoot,
      Styles.TableRowtailBalance,
    );
    const rowTailAccountBalance = ClassNames(
      Styles.TableRowtail,
      Styles.TableRowtailBalance,
    );
    const rowHeadRootRecordCategoryClass = ClassNames(
      Styles.TableRowhead,
      Styles.TableRowheadRoot,
      Styles.TableRowheadRecordCategory,
    );
    const rowTailRootTotal = ClassNames(
      Styles.TableRowtail,
      Styles.TableRowtailRoot,
      Styles.TableRowtailTotal,
    );
    const cellClass = ClassNames(
      Styles.TableCell,
      Styles.TableCellOdd,
    );
    const cellSpaceClass = ClassNames(
      Styles.TableCellSpace,
    );

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

    const accountColHeadCells = new Array();
    colInfos.forEach((colInfo) => {
      accountColHeadCells.push(
        <td className={colHeadCellClass}>
        {('0' + colInfo.date.year).slice(-2)}/
        {colInfo.date.month}/{colInfo.date.day} {IYearMonthDateUtils.localaizedDow(colInfo.date)}
        </td>,
      );
    });

    const accountRowDict: {[key: number]: JSX.Element[]} = {};
    accountRowDict[DocTypes.AccountGroup.Assets] = new Array<JSX.Element>();
    accountRowDict[DocTypes.AccountGroup.Liabilities] = new Array<JSX.Element>();
    const accountRows = new Array();
    this.props.doc.account.order.forEach((accountId) => {
      const account = this.props.doc.account.accounts[accountId];
      const accountGroup = DocTypes.accountKindToAccountGroup(account.kind);
      accountRowDict[accountGroup].push(
        <tr>
          <td className={rowHeadAccountOpenerSpaceClass}></td>
          <td className={rowHeadAccountAccountNameClass}>{account.name}</td>
          <td className={rowHeadAccountAccountCategoryClass}>
            {DocTypes.shortLocalizedAccountKind(account.kind).slice(0, 1)}
          </td>
          <td className={rowHeadAccountAccountCarriedClass}>10,000,000</td>
          <td className={cellClass}>10,000,000</td>
          <td className={cellClass}>1,000,000</td>
          <td className={cellClass}>1,000,000</td>
          <td className={cellClass}>1,000,000</td>
          <td className={cellClass}>1,000,000</td>
          <td className={cellClass}>1,000,000</td>
          <td className={cellSpaceClass}></td>
          <td className={rowTailAccountBalance}>1,000,000</td>
        </tr>,
      );
    });

    const recordColHeadCells = new Array();
    colInfos.forEach((colInfo) => {
      recordColHeadCells.push(
        <td className={colHeadCellClass}></td>,
      );
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
              <tr>
                <td className={rowHeadRootOpenerSpaceClass}></td>
                <td className={rowHeadRootAccountNameClass}>資産アカウント</td>
                <td className={rowHeadRootAccountCategoryClass}></td>
                <td className={rowHeadRootAccountCarriedClass}>10,000,000</td>
                <td className={cellRootClass}>10,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellSpaceRootClass}></td>
                <td className={rowTailRootAccountBalance}>1,000,000</td>
              </tr>
              {accountRowDict[DocTypes.AccountGroup.Assets]}
              <tr>
                <td className={rowHeadRootOpenerSpaceClass}></td>
                <td className={rowHeadRootAccountNameClass}>負債アカウント</td>
                <td className={rowHeadRootAccountCategoryClass}></td>
                <td className={rowHeadRootAccountCarriedClass}>10,000,000</td>
                <td className={cellRootClass}>10,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellSpaceRootClass}></td>
                <td className={rowTailRootAccountBalance}>1,000,000</td>
              </tr>
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
              <tr>
                <td className={rowHeadRootOpenerSpaceClass}></td>
                <td className={rowHeadRootRecordCategoryClass}>資金移動</td>
                <td className={cellRootClass}>10,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellRootClass}>1,000,000</td>
                <td className={cellSpaceRootClass}></td>
                <td className={rowTailRootTotal}>1,000,000</td>
              </tr>
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
