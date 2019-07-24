import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import IStoreState from '../state/IStoreState';
import Store from '../state/Store';
import * as UiActions from '../state/ui/Actions';
import * as States from '../state/ui/States';
import YearMonthDayDate from '../util/YearMonthDayDate';
import DialogRecordAdd from './DialogRecordAdd';
import * as LayoutStyles from './Layout.css';
import * as Styles from './PageHomeHeader.css';

interface IState {
  modalAddRecord: boolean; // レコードの追加ダイアログ表示する場合に true を指定。
}

class PageHomeHeader extends React.Component<States.IPageHome, IState> {
  constructor(props: States.IPageHome) {
    super(props);
    this.state = {
      modalAddRecord: false,
    };
  }

  public render() {
    const rootClass = ClassNames(
      Styles.Root,
    );
    const currentDateClass = ClassNames(
      Styles.CurrentDate,
    );
    const movePrevBtnClass = ClassNames(
      Styles.Btn,
      Styles.FrameBtn,
      Styles.MoveBtn,
      Styles.MovePrevBtn,
    );
    const moveTodayBtnClass = ClassNames(
      Styles.Btn,
      Styles.FrameBtn,
      Styles.MoveBtn,
    );
    const moveNextBtnClass = ClassNames(
      Styles.Btn,
      Styles.FrameBtn,
      Styles.MoveBtn,
      Styles.MoveNextBtn,
    );
    const jumpBtnClass = ClassNames(
      Styles.Btn,
      Styles.FrameBtn,
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
    let modalDialog: JSX.Element | null = null;
    if (this.state.modalAddRecord) {
        modalDialog = <DialogRecordAdd
          formDefaultDate={new YearMonthDayDate()}
          onClosed={() => {
            this.setState({modalAddRecord: false});
          }}
        />;
    }
    const currentDate = `${this.props.currentDate.date.getFullYear()}年${this.props.currentDate.date.getMonth() + 1}月`;
    return (
      <div className={rootClass}>
        <span className={currentDateClass}>{currentDate}</span>
        <button className={movePrevBtnClass} onClick={this.onMovePrevBtnPushed}>
          <i className={iconClass}>chevron_left</i>
        </button>
        <button className={moveTodayBtnClass} onClick={this.onMoveTodayBtnPushed}>今月</button>
        <button className={moveNextBtnClass} onClick={this.onMoveNextBtnPushed}>
          <i className={iconClass}>chevron_right</i>
        </button>
        <button className={jumpBtnClass} onClick={this.onJumpBtnPushed}>移動</button>
        <select className={Styles.ViewUnitSelect} defaultValue="month" onChange={this.onViewUnitChanged}>
          <option value="month">月表示</option>
          <option value="year">年表示</option>
        </select>
        <button className={filterBtnClass} onClick={() => {this.onFilterBtnPushed(); }}>
          <i className={iconClass}>filter_list</i>
        </button>
        <div className={rightAreaClass}>
          <button className={newRecordBtnClass} onClick={() => {this.onNewRecordBtnPushed(); }}>
            <i className={iconClass}>note_add</i>
          </button>
          <div style={{width: '100%'}}/>
        </div>
        {modalDialog}
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
export default ReactRedux.connect(mapStateToProps)(PageHomeHeader);
