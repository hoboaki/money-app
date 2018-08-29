import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import * as Style from './PageSheetBody.css';

class PageSheetBody extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Style.Root,
    );
    const colHeadAccountNameClass = ClassNames(
      Style.TableColhead,
      Style.TableColheadAccountName,
    );
    const colHeadAccountCategoryClass = ClassNames(
      Style.TableColhead,
      Style.TableColheadAccountCategory,
    );
    const colHeadCarriedClass = ClassNames(
      Style.TableColhead,
      Style.TableColheadCarried,
    );
    const colHeadCellClass = ClassNames(
      Style.TableColhead,
      Style.TableColheadCell,
    );
    const colHeadSpaceClass = ClassNames(
      Style.TableColhead,
      Style.TableColheadSpace,
    );
    const colHeadBalanceClass = ClassNames(
      Style.TableColhead,
      Style.TableColheadBalance,
    );
    const rowHeadRootOpenerSpaceClass = ClassNames(
      Style.TableRowhead,
      Style.TableRowheadRoot,
      Style.TableOpenerSpace,
    );
    const rowHeadRootAccountNameClass = ClassNames(
      Style.TableRowhead,
      Style.TableRowheadRoot,
      Style.TableRowheadAccountName,
    );
    const rowHeadRootAccountCategoryClass = ClassNames(
      Style.TableRowhead,
      Style.TableRowheadRoot,
      Style.TableRowheadAccountCategory,
    );
    const rowHeadRootAccountCarriedClass = ClassNames(
      Style.TableRowhead,
      Style.TableRowheadRoot,
      Style.TableRowheadCarried,
    );
    const rowHeadRootBalance = ClassNames(
      Style.TableRowhead,
      Style.TableRowheadRoot,
      Style.TableRowheadBalance,
    );
    const cellRootClass = ClassNames(
      Style.TableCell,
      Style.TableCellRoot,
    );
    const cellSpaceRootClass = ClassNames(
      Style.TableCellSpace,
      Style.TableCellRoot,
    );
    const rowHeadAccountOpenerSpaceClass = ClassNames(
      Style.TableRowhead,
      Style.TableRowheadAccount,
      Style.TableOpenerSpace,
    );
    const rowHeadAccountAccountNameClass = ClassNames(
      Style.TableRowhead,
      Style.TableRowheadAccount,
      Style.TableRowheadAccountName,
    );
    const rowHeadAccountAccountCategoryClass = ClassNames(
      Style.TableRowhead,
      Style.TableRowheadAccount,
      Style.TableRowheadAccountCategory,
    );
    const rowHeadAccountAccountCarriedClass = ClassNames(
      Style.TableRowhead,
      Style.TableRowheadAccount,
      Style.TableRowheadCarried,
    );
    const rowHeadAccountBalance = ClassNames(
      Style.TableRowhead,
      Style.TableRowheadAccount,
      Style.TableRowheadBalance,
    );
    const cellClass = ClassNames(
      Style.TableCell,
      Style.TableCellOdd,
    );
    const cellSpaceClass = ClassNames(
      Style.TableCellSpace,
    );
    return (
      <div className={rootClass}>
        <div id="pageSheetBodyTop">
          <table className={Style.Table}>
            <td className={colHeadAccountNameClass}>アカウント</td>
            <td className={colHeadAccountCategoryClass}>*</td>
            <td className={colHeadCarriedClass}>繰り越し</td>
            <td className={colHeadCellClass}>18/01/01 月</td>
            <td className={colHeadCellClass}>18/01/02 火</td>
            <td className={colHeadCellClass}>18/01/03 水</td>
            <td className={colHeadCellClass}>18/01/04 木</td>
            <td className={colHeadCellClass}>18/01/05 金</td>
            <td className={colHeadCellClass}>18/01/06 土</td>
            <td className={colHeadCellClass}>18/01/07 日</td>
            <td className={colHeadSpaceClass}></td>
            <td className={colHeadBalanceClass}>残高</td>
          </table>
          <table className={Style.Table}>
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
              <td className={cellRootClass}>1,000,000</td>
              <td className={cellSpaceRootClass}></td>
              <td className={rowHeadRootBalance}>1,000,000</td>
            </tr>
            <tr>
              <td className={rowHeadAccountOpenerSpaceClass}></td>
              <td className={rowHeadAccountAccountNameClass}>財布</td>
              <td className={rowHeadAccountAccountCategoryClass}>現</td>
              <td className={rowHeadAccountAccountCarriedClass}>10,000,000</td>
              <td className={cellClass}>10,000,000</td>
              <td className={cellClass}>1,000,000</td>
              <td className={cellClass}>1,000,000</td>
              <td className={cellClass}>1,000,000</td>
              <td className={cellClass}>1,000,000</td>
              <td className={cellClass}>1,000,000</td>
              <td className={cellClass}>1,000,000</td>
              <td className={cellSpaceClass}></td>
              <td className={rowHeadAccountBalance}>1,000,000</td>
            </tr>
            <tr>
              <td className={rowHeadAccountOpenerSpaceClass}></td>
              <td className={rowHeadAccountAccountNameClass}>アデリー銀行</td>
              <td className={rowHeadAccountAccountCategoryClass}>銀</td>
              <td className={rowHeadAccountAccountCarriedClass}>10,000,000</td>
              <td className={cellClass}>10,000,000</td>
              <td className={cellClass}>1,000,000</td>
              <td className={cellClass}>1,000,000</td>
              <td className={cellClass}>1,000,000</td>
              <td className={cellClass}>1,000,000</td>
              <td className={cellClass}>1,000,000</td>
              <td className={cellClass}>1,000,000</td>
              <td className={cellSpaceClass}></td>
              <td className={rowHeadAccountBalance}>1,000,000</td>
            </tr>
          </table>
        </div>
        <div id="pageSheetBodyBottom">
          <table className={Style.Table}>
            <td className={colHeadAccountNameClass}>アカウント</td>
            <td className={colHeadAccountCategoryClass}>*</td>
            <td className={colHeadCarriedClass}>繰り越し</td>
            <td className={colHeadCellClass}>18/01/01 月</td>
            <td className={colHeadCellClass}>18/01/02 火</td>
            <td className={colHeadCellClass}>18/01/03 水</td>
            <td className={colHeadCellClass}>18/01/04 木</td>
            <td className={colHeadCellClass}>18/01/05 金</td>
            <td className={colHeadCellClass}>18/01/06 土</td>
            <td className={colHeadCellClass}>18/01/07 日</td>
            <td className={colHeadSpaceClass}></td>
            <td className={colHeadBalanceClass}>残高</td>
          </table>
        </div>
      </div>
    );
  }

}

export default PageSheetBody;
