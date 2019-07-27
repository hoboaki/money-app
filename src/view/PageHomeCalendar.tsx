import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as DocStates from '../state/doc/States';
import IStoreState from '../state/IStoreState';
import * as UiStates from '../state/ui/States';
import RecordCollection from '../util/doc/RecordCollection';
import * as RecordFilters from '../util/doc/RecordFilters';
import IYearMonthDayDate from '../util/IYearMonthDayDate';
import * as IYearMonthDayDateUtils from '../util/IYearMonthDayDateUtils';
import * as PriceUtils from '../util/PriceUtils';
import DialogRecordAdd from './DialogRecordAdd';
import * as LayoutStyles from './Layout.css';
import * as Styles from './PageHomeCalendar.css';

interface IProps {
  doc: DocStates.IState;
  pageHome: UiStates.IPageHome;
}

interface IState {
  modalAddRecord: boolean; // レコードの追加ダイアログ表示する場合に true を指定。
  selectedDate: IYearMonthDayDate; // 選択中の日付。
}

class PageHomeCalendar extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      modalAddRecord: false,
      selectedDate: IYearMonthDayDateUtils.today(),
    };
  }

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
      date: IYearMonthDayDate;
      dark: boolean;
      transfer: boolean;
      income: number;
      outgo: number;
    }
    const dayCountInWeek = 7;
    const rowCount = 6;
    const baseDate = IYearMonthDayDateUtils.toNativeDate(this.props.pageHome.currentDate);
    const startDate = IYearMonthDayDateUtils.fromDate(new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate() - baseDate.getDay(),
    ));
    const startDateNative = IYearMonthDayDateUtils.toNativeDate(startDate);
    const endDate = IYearMonthDayDateUtils.fromDate(new Date(
      startDateNative.getFullYear(),
      startDateNative.getMonth(),
      startDateNative.getDate() + dayCountInWeek * rowCount,
    ));
    const recordsInCalendar = new RecordCollection(this.props.doc).filter([
      RecordFilters.createDateRangeFilter({
        startDate,
        endDate,
      }),
    ]);
    const dataArray: IData[] = [];
    {
      for (let i = 0, date = startDate;
        i < dayCountInWeek * rowCount; ++i,
        date = IYearMonthDayDateUtils.nextDay(date)
        ) {
        const nextDay = IYearMonthDayDateUtils.nextDay(date);
        const records = recordsInCalendar.filter([
          RecordFilters.createDateRangeFilter({
            startDate: date,
            endDate: nextDay,
          }),
        ]);
        dataArray.push({
          date,
          dark: IYearMonthDayDateUtils.toNativeDate(date).getMonth() !== baseDate.getMonth(),
          transfer: records.transfers.length !== 0,
          income: records.sumAmountIncome(),
          outgo: records.sumAmountOutgo(),
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
                    <span className={cellDayClass}>{cell.date.day}</span>
                    <button className={cellNewRecordBtnClass} onClick={() => {this.onNewRecordBtnPushed(cell.date); }}>
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

    let modalDialog: JSX.Element | null = null;
    if (this.state.modalAddRecord) {
        modalDialog = <DialogRecordAdd
          formDefaultDate={this.state.selectedDate}
          onClosed={() => {
            this.setState({modalAddRecord: false});
          }}
        />;
    }

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
        {modalDialog}
      </div>
    );
  }

  private onNewRecordBtnPushed(date: IYearMonthDayDate) {
    this.setState({
      modalAddRecord: true,
      selectedDate: date,
    });
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    doc: state.doc,
    pageHome: state.ui.pageHome,
  };
};
export default ReactRedux.connect(mapStateToProps)(PageHomeCalendar);
