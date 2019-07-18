import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import IStoreState from '../state/IStoreState';
import * as States from '../state/ui/States';
import YearMonthDayDate from '../util/YearMonthDayDate';
import * as LayoutStyle from './Layout.css';
import * as Style from './PageHomeCalendar.css';

class PageHomeCalendar extends React.Component<States.IPageHome, any> {
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

    // 6週分のデータを作成
    interface IData {
      day: number;
      dark: boolean;
      transfer: boolean;
      income: number;
      outgo: number;
    }
    const baseDate = this.props.currentDate.date;
    const startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - baseDate.getDay());
    const dataArray: IData[] = [];
    {
      for (let i = 0, date = startDate; i < 7 * 6; ++i, date = YearMonthDayDate.fromDate(date).nextDay().date) {
        dataArray.push({
          day: date.getDate(),
          dark: date.getMonth() !== baseDate.getMonth(),
          transfer: false,
          income: 0,
          outgo: 0,
        });
      }
    }

    // 動作確認用にデータを加工
    dataArray[1] = Object.assign(dataArray[1], {income: 1000, outgo: 100});
    dataArray[2] = Object.assign(dataArray[2], {outgo: 10000});
    dataArray[3] = Object.assign(dataArray[3], {income: 100});
    dataArray[4] = Object.assign(dataArray[4], {transfer: true});
    dataArray[7] = Object.assign(dataArray[7], {income: 1000});
    dataArray[8] = Object.assign(dataArray[8], {outgo: 1000});
    dataArray[9] = Object.assign(dataArray[9], {income: 200, outgo: 100});
    dataArray[12] = Object.assign(dataArray[12], {transfer: true, income: 200, outgo: 100});

    const cellDataArray: IData[][] = [];
    for (let w = 0; w < 6; ++w) {
      const array: IData[] = [];
      for (let d = 0; d < 7; ++d) {
        array.push(dataArray[w * 7 + d]);
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

const mapStateToProps = (state: IStoreState) => {
  return state.ui.pageHome;
};
export default ReactRedux.connect(mapStateToProps)(PageHomeCalendar);
