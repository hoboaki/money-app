import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import IStoreState from 'src/state/IStoreState';
import Store from 'src/state/Store';
import * as UiActions from 'src/state/ui/Actions';
import * as States from 'src/state/ui/States';
import IYearMonthDayDate from 'src/util/IYearMonthDayDate';
import * as IYearMonthDayDateUtils from 'src/util/IYearMonthDayDateUtils';
import * as BasicStyles from 'src/view/Basic.css';
import * as LayoutStyles from 'src/view/Layout.css';
import * as Styles from './Header.css';

class Header extends React.Component<States.IPageSheet> {
  constructor(props: States.IPageSheet) {
    super(props);
  }

  public render() {
    const rootClass = ClassNames(
      Styles.Root,
    );
    const currentDateClass = ClassNames(
      Styles.CurrentDate,
    );
    const movePrevBtnClass = ClassNames(
      BasicStyles.StdButton,
      Styles.Btn,
      Styles.MoveBtn,
      Styles.MovePrevBtn,
    );
    const moveTodayBtnClass = ClassNames(
      BasicStyles.StdButton,
      Styles.Btn,
      Styles.MoveBtn,
    );
    const moveNextBtnClass = ClassNames(
      BasicStyles.StdButton,
      Styles.Btn,
      Styles.MoveBtn,
      Styles.MoveNextBtn,
    );
    const viewUnitSelectClass = ClassNames(
      BasicStyles.StdSelect,
      Styles.ViewUnitSelect,
    );
    const jumpBtnClass = ClassNames(
      BasicStyles.StdButton,
      Styles.Btn,
      Styles.JumpBtn,
    );
    const filterBtnClass = ClassNames(
      Styles.Btn,
      Styles.NoFrameBtn,
      Styles.FilterBtn,
    );
    const rightAreaClass = ClassNames(
      LayoutStyles.RightToLeft,
      Styles.RightArea,
    );
    const newRecordBtnClass = ClassNames(
      Styles.Btn,
      Styles.NoFrameBtn,
      Styles.NewRecordBtn,
    );
    const iconClass = ClassNames(
      'material-icons',
      'md-16',
      'md-dark',
    );

    const currentDate = `${this.props.currentDate.year}年${this.props.currentDate.month}月`;
    return (
      <div className={rootClass}>
        <select className={viewUnitSelectClass} defaultValue="day" onChange={this.onViewUnitChanged}>
          <option value="day">日別</option>
        </select>
        <button className={movePrevBtnClass} onClick={this.onMovePrevBtnPushed}>
          <i className={iconClass}>chevron_left</i>
        </button>
        <button className={moveTodayBtnClass} onClick={this.onMoveTodayBtnPushed}>今日</button>
        <button className={moveNextBtnClass} onClick={this.onMoveNextBtnPushed}>
          <i className={iconClass}>chevron_right</i>
        </button>

        <div className={rightAreaClass}>
          <button className={newRecordBtnClass} onClick={() => {this.onNewRecordBtnPushed(); }}>
            <i className={iconClass}>note_add</i>
          </button>
          <div style={{width: '100%'}}/>
        </div>
      </div>
    );
  }

  private onViewUnitChanged() {
    global.console.log('onViewUnitChanged');
  }

  private onMovePrevBtnPushed() {
    Store.dispatch(UiActions.calendarMovePrev());
  }

  private onMoveTodayBtnPushed() {
    Store.dispatch(UiActions.calendarMoveToday());
  }

  private onMoveNextBtnPushed() {
    Store.dispatch(UiActions.calendarMoveNext());
  }

  private onJumpBtnPushed() {
    global.console.log('onJumpBtnPushed');
  }

  private onFilterBtnPushed() {
    global.console.log('onFilterBtnPushed');
  }

  private onNewRecordBtnPushed() {
    this.setState({modalAddRecord: true});
  }
}

const mapStateToProps = (state: IStoreState) => {
  return state.ui.pageHome;
};
export default ReactRedux.connect(mapStateToProps)(Header);
