import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import * as Style from './PageHomeCalendar.css';

class PageHomeCalendar extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Style.Root,
    );
    const tableClass = ClassNames(
      Style.Table,
    );
    const tableHeaderClass = ClassNames(
      Style.TableHeader,
    );
    const tableDataClass = ClassNames(
      Style.TableData,
    );
    const tableDataDarkClass = ClassNames(
      Style.TableData,
      Style.TableDataDark,
    );
    const cellTopClass = ClassNames(
      Style.Cell,
      Style.CellTop,
    );
    const cellDayClass = ClassNames(
      Style.CellDay,
    );
    const cellNewRecordBtnClass = ClassNames(
      Style.CellNewRecordBtn,
    );
    const cellNewRecordBtnIconClass = ClassNames(
      'material-icons',
      'md-16',
      Style.CellNewRecordBtnIcon,
    );
    const cellTopRightClass = ClassNames(
      LayoutStyle.RightToLeft,
    );
    const cellTransferClass = ClassNames(
      Style.CellTransfer,
    );
    const cellTransferIconClass = ClassNames(
      Style.CellTransferIcon,
    );
    const cellMiddleClass = ClassNames(
      Style.Cell,
    );
    const cellHiddenClass = ClassNames(
      Style.CellHidden,
    );
    const cellIncomePriceClass = ClassNames(
      Style.CellPrice,
      Style.CellIncomePrice,
    );
    const cellOutgoPriceClass = ClassNames(
      Style.CellPrice,
      Style.CellOutgoPrice,
    );
    const cellIncomeIconClass = ClassNames(
      Style.CellIncomeIcon,
    );
    const cellOutgoIconClass = ClassNames(
      Style.CellOutgoIcon,
    );
    const cellBottomClass = ClassNames(
      Style.Cell,
    );

    interface IData {
      day: number;
      dark: boolean;
      transfer: boolean;
      income: number;
      outgo: number;
    }
    const row0: IData[] = [
      {day: 26, dark: true, transfer: false, income: 0, outgo: 0},
      {day: 27, dark: true, transfer: false, income: 1000, outgo: 100},
      {day: 28, dark: true, transfer: false, income: 0, outgo: 10000},
      {day: 29, dark: true, transfer: false, income: 100, outgo: 0},
      {day: 30, dark: true, transfer: true, income: 0, outgo: 0},
      {day: 31, dark: true, transfer: false, income: 0, outgo: 0},
      {day: 1, dark: false, transfer: false, income: 0, outgo: 0},
    ];
    const row1: IData[] = [
      {day: 2, dark: false, transfer: false, income: 1000, outgo: 0},
      {day: 3, dark: false, transfer: false, income: 0, outgo: 1000},
      {day: 4, dark: false, transfer: false, income: 200, outgo: 100},
      {day: 5, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 6, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 7, dark: false, transfer: true, income: 200, outgo: 100},
      {day: 8, dark: false, transfer: false, income: 0, outgo: 0},
    ];
    const row2: IData[] = [
      {day: 9, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 10, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 11, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 12, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 13, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 14, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 15, dark: false, transfer: false, income: 0, outgo: 0},
    ];
    const row3: IData[] = [
      {day: 16, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 17, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 18, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 19, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 20, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 21, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 22, dark: false, transfer: false, income: 0, outgo: 0},
    ];
    const row4: IData[] = [
      {day: 23, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 24, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 25, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 26, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 27, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 28, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 29, dark: false, transfer: false, income: 0, outgo: 0},
    ];
    const row5: IData[] = [
      {day: 30, dark: false, transfer: false, income: 0, outgo: 0},
      {day: 1, dark: true, transfer: false, income: 0, outgo: 0},
      {day: 2, dark: true, transfer: false, income: 0, outgo: 0},
      {day: 3, dark: true, transfer: false, income: 0, outgo: 0},
      {day: 4, dark: true, transfer: false, income: 0, outgo: 0},
      {day: 5, dark: true, transfer: false, income: 0, outgo: 0},
      {day: 6, dark: true, transfer: false, income: 0, outgo: 0},
    ];
    const cellDataArray = [row0, row1, row2, row3, row4, row5];
    const cells = <tbody>
      {cellDataArray.map((row, rowIndex) => {
        return (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => {
              const classNames = cell.dark ? tableDataDarkClass : tableDataClass;
              const transferClassNames = cell.transfer ? cellTransferClass : cellHiddenClass;
              const transferIconClassNames = cell.transfer ? cellTransferIconClass : cellHiddenClass;
              const incomePriceClassNames = cell.income !== 0 ? cellIncomePriceClass : cellHiddenClass;
              const incomeIconClassNames = cell.income !== 0 ? cellIncomeIconClass : cellHiddenClass;
              const outgoPriceClassNames = cell.outgo !== 0 ? cellOutgoPriceClass : cellHiddenClass;
              const outgoIconClassNames = cell.outgo !== 0 ? cellOutgoIconClass : cellHiddenClass;

              return (
                <td key={rowIndex * 10 + colIndex} className={classNames}>
                  <div className={cellTopClass}>
                    <span className={cellDayClass}>{cell.day}</span>
                    <button className={cellNewRecordBtnClass} onClick={this.onNewRecordBtnPushed}>
                      <i className={cellNewRecordBtnIconClass}>note_add</i>
                    </button>
                    <div className={cellTopRightClass}>
                      <img className={transferIconClassNames} src="./image/icon-ex/transfer-outline.svg"/>
                    </div>
                  </div>
                  <div className={cellMiddleClass}>
                    <span className={incomePriceClassNames}>+{cell.income}</span>
                    <img className={incomeIconClassNames} src="./image/icon-ex/income.svg"/>
                  </div>
                  <div className={cellBottomClass}>
                    <span className={outgoPriceClassNames}>-{cell.outgo}</span>
                    <img className={outgoIconClassNames} src="./image/icon-ex/outgo.svg"/>
                  </div>
                </td>
                );
            })}
          </tr>
          );
        })}
      </tbody>;

    return (
      <div className={rootClass}>
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={tableHeaderClass}>日</th>
              <th className={tableHeaderClass}>月</th>
              <th className={tableHeaderClass}>火</th>
              <th className={tableHeaderClass}>水</th>
              <th className={tableHeaderClass}>木</th>
              <th className={tableHeaderClass}>金</th>
              <th className={tableHeaderClass}>土</th>
            </tr>
          </thead>
          {cells}
        </table>
      </div>
    );
  }

  private onNewRecordBtnPushed() {
    global.console.log('onNewRecordBtnPushed');
  }
}

export default PageHomeCalendar;
