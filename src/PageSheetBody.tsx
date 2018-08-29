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
    const colHeadCarried = ClassNames(
      Style.TableColhead,
      Style.TableColheadCarried,
    );
    const colHeadCell = ClassNames(
      Style.TableColhead,
      Style.TableColheadCell,
    );
    const colHeadSpace = ClassNames(
      Style.TableColhead,
      Style.TableColheadSpace,
    );
    const colHeadBalance = ClassNames(
      Style.TableColhead,
      Style.TableColheadBalance,
    );
    return (
      <div className={rootClass}>
        <div id="pageSheetBodyTop">
          <table className={Style.Table}>
            <td className={colHeadAccountNameClass}>アカウント</td>
            <td className={colHeadAccountCategoryClass}>*</td>
            <td className={colHeadCarried}>繰り越し</td>
            <td className={colHeadCell}>18/01/01 月</td>
            <td className={colHeadCell}>18/01/02 火</td>
            <td className={colHeadCell}>18/01/03 水</td>
            <td className={colHeadCell}>18/01/04 木</td>
            <td className={colHeadCell}>18/01/05 金</td>
            <td className={colHeadCell}>18/01/06 土</td>
            <td className={colHeadCell}>18/01/07 日</td>
            <td className={colHeadSpace}></td>
            <td className={colHeadBalance}>残高</td>
          </table>
          <table className={Style.Table}>
            <tr>
              {/* <td class="page-sheet-table-rowhead page-sheet-table-rowhead-root page-sheet-table-opener-space"></td>
              <td class="page-sheet-table-rowhead page-sheet-table-rowhead-root page-sheet-table-rowhead-account-name">資産アカウント</td>
              <td class="page-sheet-table-rowhead page-sheet-table-rowhead-root page-sheet-table-rowhead-account-category"></td>
              <td class="page-sheet-table-rowhead page-sheet-table-rowhead-root page-sheet-table-rowhead-carried">10,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-root">10,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-root">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-root">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-root">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-root">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-root">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-root">1,000,000</td>
              <td class="page-sheet-table-cell-space page-sheet-table-cell-root"></td>
              <td class="page-sheet-table-rowhead page-sheet-table-rowhead-root page-sheet-table-rowhead-balance">1,000,000</td> */}
            </tr>
            <tr>
              {/* <td class="page-sheet-table-rowhead page-sheet-table-rowhead-account page-sheet-table-opener-space"></td>
              <td class="page-sheet-table-rowhead page-sheet-table-rowhead-account page-sheet-table-rowhead-account-name">　財布</td>
              <td class="page-sheet-table-rowhead page-sheet-table-rowhead-account page-sheet-table-rowhead-account-category">現</td>
              <td class="page-sheet-table-rowhead page-sheet-table-rowhead-account page-sheet-table-rowhead-carried">10,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-odd">10,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-odd">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-odd">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-odd">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-odd">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-odd">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-odd">1,000,000</td>
              <td class="page-sheet-table-cell-space"></td>
              <td class="page-sheet-table-rowhead page-sheet-table-rowhead-account page-sheet-table-rowhead-balance">1,000,000</td> */}
            </tr>
            <tr>
              {/* <td class="page-sheet-table-rowhead page-sheet-table-rowhead-account page-sheet-table-opener-space"></td>
              <td class="page-sheet-table-rowhead page-sheet-table-rowhead-account page-sheet-table-rowhead-account-name">　アデリー銀行</td>
              <td class="page-sheet-table-rowhead page-sheet-table-rowhead-account page-sheet-table-rowhead-account-category">銀</td>
              <td class="page-sheet-table-rowhead page-sheet-table-rowhead-account page-sheet-table-rowhead-carried">10,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-even">10,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-even">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-even">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-even">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-even">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-even">1,000,000</td>
              <td class="page-sheet-table-cell page-sheet-table-cell-even">1,000,000</td>
              <td class="page-sheet-table-cell-space"></td>
              <td class="page-sheet-table-rowhead page-sheet-table-rowhead-account page-sheet-table-rowhead-balance">1,000,000</td> */}
            </tr>
          </table>
        </div>
        <div id="pageSheetBodyBottom">
          {/* <table class="page-sheet-table">
            <td class="page-sheet-table-colhead page-sheet-table-colhead-account-name">アカウント</td>
            <td class="page-sheet-table-colhead page-sheet-table-colhead-account-category">*</td>
            <td class="page-sheet-table-colhead page-sheet-table-colhead-carried">繰り越し</td>
            <td className={colHeadCell}>18/01/01 月</td>
            <td className={colHeadCell}>18/01/02 火</td>
            <td className={colHeadCell}>18/01/03 水</td>
            <td className={colHeadCell}>18/01/04 木</td>
            <td className={colHeadCell}>18/01/05 金</td>
            <td className={colHeadCell}>18/01/06 土</td>
            <td className={colHeadCell}>18/01/07 日</td>
            <td class="page-sheet-table-colhead page-sheet-table-colhead-space"></td>
            <td class="page-sheet-table-colhead page-sheet-table-colhead-balance">残高</td>
          </table> */}
        </div>
      </div>
    );
  }

}

export default PageSheetBody;
