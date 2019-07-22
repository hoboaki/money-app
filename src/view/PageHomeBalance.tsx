import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as DocStateMethods from '../state/doc/StateMethods';
import * as DocStates from '../state/doc/States';
import IStoreState from '../state/IStoreState';
import * as UiStates from '../state/ui/States';
import * as PriceUtils from '../util/PriceUtils';
import * as LayoutStyle from './Layout.css';
import * as Style from './PageHomeBalance.css';

interface IProps {
  doc: DocStates.IState;
  pageHome: UiStates.IPageHome;
}

class PageHomeBalance extends React.Component<IProps, any> {
  public render() {
    const startDate = this.props.pageHome.currentDate;
    const endDate = startDate.nextMonth();
    const incomeRecords = DocStateMethods.incomeRecordsFromStateByDateRange(
      this.props.doc,
      startDate,
      endDate,
      );
    const outgoRecords = DocStateMethods.outgoRecordsFromStateByDateRange(
      this.props.doc,
      startDate,
      endDate,
      );
    const transferRecords = DocStateMethods.transferRecordsFromStateByDateRange(
      this.props.doc,
      startDate,
      endDate,
      );

    const incomeTotal = incomeRecords.reduce((current, next) => current + next.amount, 0);
    const outgoTotal = outgoRecords.reduce((current, next) => current + next.amount, 0);
    const balanceTotal = incomeTotal - outgoTotal;
    const incomeTotalText = `${incomeTotal < 0 ? '▲ ' : ''}` +
      `${PriceUtils.numToLocaleString(Math.abs(incomeTotal))}`;
    const outgoTotalText = `${outgoTotal < 0 ? '△ ' : ''}` +
      `${PriceUtils.numToLocaleString(Math.abs(outgoTotal))}`;
    const balanceSignText = balanceTotal < 0 ? '-' : (0 < balanceTotal ? '+' : '');
    const balanceTotalText = balanceSignText +
      `${PriceUtils.numToLocaleString(Math.abs(balanceTotal))}`;

    const rootClass = ClassNames(
      Style.Root,
    );
    const spacerClass = ClassNames(
      Style.Spacer,
    );
    const tableClass = ClassNames(
      Style.Table,
    );
    const tableHeaderLabelClass = ClassNames(
      Style.TableHeader,
      Style.TableHeaderLabel,
    );
    const tableHeaderSpacerClass = ClassNames(
      Style.TableHeader,
      Style.TableHeaderSpacer,
    );
    const tableDataValueClass = ClassNames(
      Style.TableData,
      Style.TableDataValue,
    );
    const tableDataBalanceValueClass = ClassNames(
      Style.TableData,
      Style.TableDataValue,
      balanceTotal < 0 ? Style.TableDataValueDeficit : null,
      0 < balanceTotal ? Style.TableDataValueSurplus : null,
    );
    const tableDataSignClass = ClassNames(
      Style.TableData,
      Style.TableDataSign,
    );
    return (
      <div className={rootClass}>
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={tableHeaderLabelClass}>当月収入 (¥)</th>
              <th className={tableHeaderSpacerClass}></th>
              <th className={tableHeaderLabelClass}>当月支出 (¥)</th>
              <th className={tableHeaderSpacerClass}></th>
              <th className={tableHeaderLabelClass}>当月収支 (¥)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tableDataValueClass}>{incomeTotalText}</td>
              <td className={tableDataSignClass}>-</td>
              <td className={tableDataValueClass}>{outgoTotalText}</td>
              <td className={tableDataSignClass}>=</td>
              <td className={tableDataBalanceValueClass}>{balanceTotalText}</td>
            </tr>
          </tbody>
        </table>
        <div className={spacerClass}/>
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={tableHeaderLabelClass}>当月振替差額 (¥)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tableDataValueClass}>999,999,999</td>
            </tr>
          </tbody>
        </table>
        <div className={spacerClass}/>
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={tableHeaderLabelClass}>当月末残高 (¥)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tableDataValueClass}>999,999,999</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

}

const mapStateToProps = (state: IStoreState) => {
  return {
    doc: state.doc,
    pageHome: state.ui.pageHome,
  };
};
export default ReactRedux.connect(mapStateToProps)(PageHomeBalance);
