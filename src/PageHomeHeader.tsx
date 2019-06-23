import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import * as Style from './PageHomeHeader.css';

class PageHomeHeader extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Style.Root,
    );
    const currentDateClass = ClassNames(
      Style.CurrentDate,
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
        <p className={currentDateClass}>2019年6月</p>
        <button className={movePrevBtnClass} onClick={this.onMovePrevBtnPushed}>
          <i className={iconClass}>chevron_left</i>
        </button>
        <button className={moveTodayBtnClass} onClick={this.onMoveTodayBtnPushed}>今月</button>
        <button className={moveNextBtnClass} onClick={this.onMoveNextBtnPushed}>
          <i className={iconClass}>chevron_right</i>
        </button>
        <select className={Style.ViewUnitSelect} defaultValue="month" onChange={this.onViewUnitChanged}>
          <option value="month">月表示</option>
          <option value="year">年表示</option>
        </select>
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

  private onViewUnitChanged() {
    global.console.log('onViewUnitChanged');
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

export default PageHomeHeader;
