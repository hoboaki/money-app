import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import * as Style from './PageHomeBody.css';

class PageHomeBody extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Style.Root,
    );
    const abstractClass = ClassNames(
      Style.Abstract,
    );
    const abstractSpacerClass = ClassNames(
      Style.AbstractSpacer,
    );
    const abstractTableClass = ClassNames(
      Style.AbstractTable,
    );
    const abstractTableHeaderLabelClass = ClassNames(
      Style.AbstractTableHeader,
      Style.AbstractTableHeaderLabel,
    );
    const abstractTableHeaderSpacerClass = ClassNames(
      Style.AbstractTableHeader,
      Style.AbstractTableHeaderSpacer,
    );
    const abstractTableDataValueClass = ClassNames(
      Style.AbstractTableData,
      Style.AbstractTableDataValue,
    );
    const abstractTableDataSignClass = ClassNames(
      Style.AbstractTableData,
      Style.AbstractTableDataSign,
    );
    return (
      <div className={rootClass}>
        <div className={abstractClass}>
          <table className={abstractTableClass}>
            <tr>
              <th className={abstractTableHeaderLabelClass}>当月収入</th>
              <th className={abstractTableHeaderSpacerClass}></th>
              <th className={abstractTableHeaderLabelClass}>当月支出</th>
              <th className={abstractTableHeaderSpacerClass}></th>
              <th className={abstractTableHeaderLabelClass}>当月収支</th>
            </tr>
            <tr>
              <td className={abstractTableDataValueClass}>¥999,999,999</td>
              <td className={abstractTableDataSignClass}>-</td>
              <td className={abstractTableDataValueClass}>¥999,999,999</td>
              <td className={abstractTableDataSignClass}>=</td>
              <td className={abstractTableDataValueClass}>¥999,999,999</td>
            </tr>
          </table>
          <div className={abstractSpacerClass}/>
          <table className={abstractTableClass}>
            <tr>
              <th className={abstractTableHeaderLabelClass}>残高</th>
            </tr>
            <tr>
              <td className={abstractTableDataValueClass}>¥999,999,999</td>
            </tr>
          </table>
        </div>
      </div>
    );
  }

}

export default PageHomeBody;
