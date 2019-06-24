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

    interface IData {
      day: number;
    }
    const row0: IData[] = [
      {day: 26},
      {day: 27},
      {day: 28},
      {day: 29},
      {day: 30},
      {day: 31},
      {day: 1},
    ];
    const row1: IData[] = [
      {day: 2},
      {day: 3},
      {day: 4},
      {day: 5},
      {day: 6},
      {day: 7},
      {day: 8},
    ];
    const row2: IData[] = [
      {day: 9},
      {day: 10},
      {day: 11},
      {day: 12},
      {day: 13},
      {day: 14},
      {day: 15},
    ];
    const row3: IData[] = [
      {day: 16},
      {day: 17},
      {day: 18},
      {day: 19},
      {day: 20},
      {day: 21},
      {day: 22},
    ];
    const row4: IData[] = [
      {day: 23},
      {day: 24},
      {day: 25},
      {day: 26},
      {day: 27},
      {day: 28},
      {day: 29},
    ];
    const row5: IData[] = [
      {day: 30},
      {day: 1},
      {day: 2},
      {day: 3},
      {day: 4},
      {day: 5},
      {day: 6},
    ];
    const cellDataArray = [row0, row1, row2, row3, row4, row5];
    const cells = <tbody>
      {cellDataArray.map((row, rowIndex) => {
        return (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => {
              return (<td key={rowIndex * 10 + colIndex} className={tableDataClass}>{cell.day}</td>);
            })}
          </tr>
          );
        },
      )}
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

}

export default PageHomeCalendar;
