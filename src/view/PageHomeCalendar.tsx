import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as RecordFinder from '../state/doc/RecordFinder';
import * as DocStateMethods from '../state/doc/StateMethods';
import * as DocStates from '../state/doc/States';
import IStoreState from '../state/IStoreState';
import * as UiStates from '../state/ui/States';
import * as PriceUtils from '../util/PriceUtils';
import YearMonthDayDate from '../util/YearMonthDayDate';
import * as LayoutStyles from './Layout.css';
import * as Styles from './PageHomeCalendar.css';

interface IProps {
  doc: DocStates.IState;
  pageHome: UiStates.IPageHome;
}

class PageHomeCalendar extends React.Component<IProps, any> {
  public render() {
    const rootClass = ClassNames(
      Styles.Root,
    );
    const tableClass = ClassNames(
      Styles.Table,
    );
    const tableHeaderClass = ClassNames(
      Styles.TableHeader,
    );
    const tableDataClass = ClassNames(
      Styles.TableData,
    );
    const tableDataDarkClass = ClassNames(
      Styles.TableData,
      Styles.TableDataDark,
    );
    const cellTopClass = ClassNames(
      Styles.Cell,
      Styles.CellTop,
    );
    const cellDayClass = ClassNames(
      Styles.CellDay,
    );
    const cellNewRecordBtnClass = ClassNames(
      Styles.CellNewRecordBtn,
    );
    const cellNewRecordBtnIconClass = ClassNames(
      'material-icons',
      'md-16',
      Styles.CellNewRecordBtnIcon,
    );
    const cellTopRightClass = ClassNames(
      LayoutStyles.RightToLeft,
    );
    const cellTransferClass = ClassNames(
      Styles.CellTransfer,
    );
    const cellTransferIconClass = ClassNames(
      Styles.CellTransferIcon,
    );
    const cellMiddleClass = ClassNames(
      Styles.Cell,
    );
    const cellHiddenClass = ClassNames(
      Styles.CellHidden,
    );
    const cellIncomePriceClass = ClassNames(
      Styles.CellPrice,
      Styles.CellIncomePrice,
    );
    const cellOutgoPriceClass = ClassNames(
      Styles.CellPrice,
      Styles.CellOutgoPrice,
    );
    const cellNegativePriceClass = ClassNames(
      Styles.CellPrice,
      Styles.CellNegativePrice,
    );
    const cellIncomeIconClass = ClassNames(
      Styles.CellIncomeIcon,
    );
    const cellOutgoIconClass = ClassNames(
      Styles.CellOutgoIcon,
    );
    const cellBottomClass = ClassNames(
      Styles.Cell,
    );

    // 6週分のデータを作成
    interface IData {
      day: number;
      dark: boolean;
      transfer: boolean;
      income: number;
      outgo: number;
    }
    const dayCountInWeek = 7;
    const rowCount = 6;
    const baseDate = this.props.pageHome.currentDate.date;
    const startDate = YearMonthDayDate.fromDate(new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate() - baseDate.getDay(),
    ));
    const endDate = YearMonthDayDate.fromDate(new Date(
      startDate.date.getFullYear(),
      startDate.date.getMonth(),
      startDate.date.getDate() + dayCountInWeek * rowCount,
    ));
    const recordsInCalendar = RecordFinder.findInState(
      this.props.doc,
      [
        RecordFinder.createDateRangeFilter({
          startDate,
          endDate,
        }),
      ],
    );
    const dataArray: IData[] = [];
    {
      for (let i = 0, date = startDate;
        i < dayCountInWeek * rowCount; ++i,
        date = date.nextDay()
        ) {
        const nextDay = date.nextDay();
        const records = RecordFinder.findInCollection(
          recordsInCalendar,
          this.props.doc,
          [
            RecordFinder.createDateRangeFilter({
              startDate: date,
              endDate: nextDay,
            }),
          ],
        );
        dataArray.push({
          day: date.date.getDate(),
          dark: date.date.getMonth() !== baseDate.getMonth(),
          transfer: records.transfers.length !== 0,
          income: RecordFinder.sumAmountIncome(records, this.props.doc),
          outgo: RecordFinder.sumAmountOutgo(records, this.props.doc),
        });
      }
    }

    const cellDataArray: IData[][] = [];
    for (let w = 0; w < rowCount; ++w) {
      const array: IData[] = [];
      for (let d = 0; d < dayCountInWeek; ++d) {
        array.push(dataArray[w * dayCountInWeek + d]);
      }
      cellDataArray.push(array);
    }

    const cells = <tbody>
      {cellDataArray.map((row, rowIndex) => {
        return (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => {
              const classNames = cell.dark ? tableDataDarkClass : tableDataClass;
              const transferClassNames = cell.transfer ? cellTransferClass : cellHiddenClass;
              const transferIconClassNames = cell.transfer ? cellTransferIconClass : cellHiddenClass;
              const incomePriceClassNames = cell.income === 0 ? cellHiddenClass :
                (cell.income < 0 ? cellNegativePriceClass : cellIncomePriceClass);
              const incomeIconClassNames = cell.income !== 0 ? cellIncomeIconClass : cellHiddenClass;
              const outgoPriceClassNames = cell.outgo === 0 ? cellHiddenClass :
                (cell.outgo < 0 ? cellNegativePriceClass : cellOutgoPriceClass);
              const outgoIconClassNames = cell.outgo !== 0 ? cellOutgoIconClass : cellHiddenClass;
              const incomeText = `${cell.income < 0 ? '-' : '+'}${PriceUtils.numToLocaleString(Math.abs(cell.income))}`;
              const outgoText = `${cell.outgo < 0 ? '+' : '-'}${PriceUtils.numToLocaleString(Math.abs(cell.outgo))}`;

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
                    <span className={incomePriceClassNames}>{incomeText}</span>
                    <img className={incomeIconClassNames} src="./image/icon-ex/income.svg"/>
                  </div>
                  <div className={cellBottomClass}>
                    <span className={outgoPriceClassNames}>{outgoText}</span>
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

const mapStateToProps = (state: IStoreState) => {
  return {
    doc: state.doc,
    pageHome: state.ui.pageHome,
  };
};
export default ReactRedux.connect(mapStateToProps)(PageHomeCalendar);
