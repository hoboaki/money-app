import ClassNames from 'classnames';
import * as React from 'react';
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
    const cellMiddleClass = ClassNames(
      Style.Cell,
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
    }
    const row0: IData[] = [
      {day: 26, dark: true},
      {day: 27, dark: true},
      {day: 28, dark: true},
      {day: 29, dark: true},
      {day: 30, dark: true},
      {day: 31, dark: true},
      {day: 1, dark: false},
    ];
    const row1: IData[] = [
      {day: 2, dark: false},
      {day: 3, dark: false},
      {day: 4, dark: false},
      {day: 5, dark: false},
      {day: 6, dark: false},
      {day: 7, dark: false},
      {day: 8, dark: false},
    ];
    const row2: IData[] = [
      {day: 9, dark: false},
      {day: 10, dark: false},
      {day: 11, dark: false},
      {day: 12, dark: false},
      {day: 13, dark: false},
      {day: 14, dark: false},
      {day: 15, dark: false},
    ];
    const row3: IData[] = [
      {day: 16, dark: false},
      {day: 17, dark: false},
      {day: 18, dark: false},
      {day: 19, dark: false},
      {day: 20, dark: false},
      {day: 21, dark: false},
      {day: 22, dark: false},
    ];
    const row4: IData[] = [
      {day: 23, dark: false},
      {day: 24, dark: false},
      {day: 25, dark: false},
      {day: 26, dark: false},
      {day: 27, dark: false},
      {day: 28, dark: false},
      {day: 29, dark: false},
    ];
    const row5: IData[] = [
      {day: 30, dark: false},
      {day: 1, dark: true},
      {day: 2, dark: true},
      {day: 3, dark: true},
      {day: 4, dark: true},
      {day: 5, dark: true},
      {day: 6, dark: true},
    ];
    const cellDataArray = [row0, row1, row2, row3, row4, row5];
    const cells = <tbody>
      {cellDataArray.map((row, rowIndex) => {
        return (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => {
              const classNames = cell.dark ? tableDataDarkClass : tableDataClass;
              return (
                <td key={rowIndex * 10 + colIndex} className={classNames}>
                  <div className={cellTopClass}>
                    <span className={cellDayClass}>{cell.day}</span>
                    <button className={cellNewRecordBtnClass} onClick={this.onNewRecordBtnPushed}>
                      <i className={cellNewRecordBtnIconClass}>note_add</i>
                    </button>
                  </div>
                  <div className={cellMiddleClass}>
                    <span className={cellIncomePriceClass}>+99,999,999</span>
                    <img className={cellIncomeIconClass} src="./image/icon-ex/income.svg"/>
                  </div>
                  <div className={cellBottomClass}>
                    <span className={cellOutgoPriceClass}>-99,999,999</span>
                    <img className={cellOutgoIconClass} src="./image/icon-ex/outgo.svg"/>
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
