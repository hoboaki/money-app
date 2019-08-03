import ClassNames from 'classnames';
import * as React from 'react';

import * as Styles from './Body.css';

class Body extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Styles.Root,
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
    const rowHeadRootBalance = ClassNames(
      Styles.TableRowhead,
      Styles.TableRowheadRoot,
      Styles.TableRowheadBalance,
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
    const rowHeadAccountBalance = ClassNames(
      Styles.TableRowhead,
      Styles.TableRowheadAccount,
      Styles.TableRowheadBalance,
    );
    const cellClass = ClassNames(
      Styles.TableCell,
      Styles.TableCellOdd,
    );
    const cellSpaceClass = ClassNames(
      Styles.TableCellSpace,
    );
    return (
      <div className={rootClass}>
        <div id="pageSheetBodyTop">
          <table className={Styles.Table}>
            <tbody>
              <tr>
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
            </tbody>
          </table>
        </div>
        <div id="pageSheetBodyBottom">
          <table className={Styles.Table}>
            <tbody>
              <tr>
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

}

export default Body;
