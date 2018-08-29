import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import * as Style from './PageSheetHeader.css';

class PageSheetHeader extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Style.Root,
    );
    const movePrevBtnClass = ClassNames(
      Style.MoveBtn,
      Style.MovePrevBtn,
    );
    const moveTodayBtnClass = ClassNames(
      Style.MoveBtn,
    );
    const moveNextBtnClass = ClassNames(
      Style.MoveBtn,
      Style.MoveNextBtn,
    );
    const iconClass = ClassNames(
      'material-icons',
      'md-16',
      'md-dark',
    );
    return (
      <div className={rootClass}>
        <select className={Style.CellUnitSelect} defaultValue="day" onChange={this.onCellUnitChanged}>
          <option value="day">日</option>
          <option value="month">月</option>
          <option value="year">年</option>
        </select>
        <button className={movePrevBtnClass} onClick={this.onMovePrevBtnPushed}>
          <i className={iconClass}>chevron_left</i>
        </button>
        <button className={moveTodayBtnClass} onClick={this.onMoveTodayBtnPushed}>今日</button>
        <button className={moveNextBtnClass} onClick={this.onMoveNextBtnPushed}>
          <i className={iconClass}>chevron_right</i>
        </button>
        <div className={LayoutStyle.RightToLeft}>
          <div className={LayoutStyle.TopToBottom} style={{width: 'auto'}}>
            <span className={Style.ZoomLabel}>水平ズーム:</span>
            <div className={Style.ZoomDiv}><input type="range" defaultValue="1" min="1" max="100" step="1"/></div>
          </div>
          <div style={{width: '100%'}}/>
        </div>
      </div>
    );
  }

  private onCellUnitChanged() {
    global.console.log('onCellUnitChanged');
  }

  private onMovePrevBtnPushed() {
    global.console.log('onMovePrevBtnPushed');
  }

  private onMoveTodayBtnPushed() {
    global.console.log('onMoveTodayBtnPushed');
  }

  private onMoveNextBtnPushed() {
    global.console.log('onMoveNextBtnPushed');
  }
}

export default PageSheetHeader;
