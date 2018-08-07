import ClassNames from 'classnames';
import * as React from 'react';
import * as StylesLayout from './Layout.css';
import * as Styles from './PageSheetHeader.css';

class PageSheetHeader extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Styles.Root,
    );
    const movePrevBtnClass = ClassNames(
      Styles.MoveBtn,
      Styles.MovePrevBtn,
    );
    const moveTodayBtnClass = ClassNames(
      Styles.MoveBtn,
    );
    const moveNextBtnClass = ClassNames(
      Styles.MoveBtn,
      Styles.MoveNextBtn,
    );
    const iconClass = ClassNames(
      'material-icons',
      'md-16',
      'md-dark',
    );
    return (
      <div className={rootClass}>
        <select className={Styles.CellUnitSelect}>
            <option value="day">日</option>
            <option value="month">月</option>
            <option value="year">年</option>
        </select>
        <button className={movePrevBtnClass}><i className={iconClass}>chevron_left</i></button>
        <button className={moveTodayBtnClass}>今日</button>
        <button className={moveNextBtnClass}><i className={iconClass}>chevron_right</i></button>
        <div className={StylesLayout.RightToLeft}>
          <div className={StylesLayout.TopToBottom} style={{width: 'auto'}}>
            <span className={Styles.ZoomLabel}>水平ズーム:</span>
            <div className={Styles.ZoomDiv}><input type="range" value="1" min="1" max="100" step="1"/></div>
          </div>
          <div style={{width: '100%'}}/>
        </div>
      </div>
    );
  }

}

export default PageSheetHeader;
