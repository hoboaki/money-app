import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import * as Style from './PageHomeBalance.css';

class PageHomeBalance extends React.Component<any, any> {
  public render() {
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
    const tableDataSignClass = ClassNames(
      Style.TableData,
      Style.TableDataSign,
    );
    return (
      <div className={rootClass}>
        <table className={tableClass}>
          <tr>
            <th className={tableHeaderLabelClass}>当月収入</th>
            <th className={tableHeaderSpacerClass}></th>
            <th className={tableHeaderLabelClass}>当月支出</th>
            <th className={tableHeaderSpacerClass}></th>
            <th className={tableHeaderLabelClass}>当月収支</th>
          </tr>
          <tr>
            <td className={tableDataValueClass}>¥999,999,999</td>
            <td className={tableDataSignClass}>-</td>
            <td className={tableDataValueClass}>¥999,999,999</td>
            <td className={tableDataSignClass}>=</td>
            <td className={tableDataValueClass}>¥999,999,999</td>
          </tr>
        </table>
        <div className={spacerClass}/>
        <table className={tableClass}>
          <tr>
            <th className={tableHeaderLabelClass}>残高</th>
          </tr>
          <tr>
            <td className={tableDataValueClass}>¥999,999,999</td>
          </tr>
        </table>
      </div>
    );
  }

}

export default PageHomeBalance;
