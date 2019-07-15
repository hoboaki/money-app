import ClassNames from 'classnames';
import * as React from 'react';
import * as Action from '../state/doc/Actions';
import Store from '../state/Store';
import YearMonthDayDate from '../util/YearMonthDayDate';
import DialogRecordAdd from './DialogRecordAdd';
import * as LayoutStyle from './Layout.css';
import * as Style from './PageHomeHeader.css';

interface IState {
  modalAddRecord: boolean; // レコードの追加ダイアログ表示する場合に true を指定。
}

class PageHomeHeader extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      modalAddRecord: false,
    };
  }

  public render() {
    const rootClass = ClassNames(
      Style.Root,
    );
    const currentDateClass = ClassNames(
      Style.CurrentDate,
    );
    const movePrevBtnClass = ClassNames(
      Style.Btn,
      Style.FrameBtn,
      Style.MoveBtn,
      Style.MovePrevBtn,
    );
    const moveTodayBtnClass = ClassNames(
      Style.Btn,
      Style.FrameBtn,
      Style.MoveBtn,
    );
    const moveNextBtnClass = ClassNames(
      Style.Btn,
      Style.FrameBtn,
      Style.MoveBtn,
      Style.MoveNextBtn,
    );
    const jumpBtnClass = ClassNames(
      Style.Btn,
      Style.FrameBtn,
      Style.JumpBtn,
    );
    const filterBtnClass = ClassNames(
      Style.Btn,
      Style.NoFrameBtn,
      Style.FilterBtn,
    );
    const rightAreaClass = ClassNames(
      LayoutStyle.RightToLeft,
      Style.RightArea,
    );
    const newRecordBtnClass = ClassNames(
      Style.Btn,
      Style.NoFrameBtn,
      Style.NewRecordBtn,
    );
    const iconClass = ClassNames(
      'material-icons',
      'md-16',
      'md-dark',
    );
    let modalDialog: JSX.Element | null = null;
    if (this.state.modalAddRecord) {
        modalDialog = <DialogRecordAdd onClosed={() => {
          this.setState({modalAddRecord: false});
          Store.dispatch(Action.addRecordOutgo(
            new Date(),
            YearMonthDayDate.fromText('2019-07-07'),
            'お弁当代',
            1, // accountId
            1, // categoryId
            10000, // amount
            ));
        }}/>;
    }
    return (
      <div className={rootClass}>
        <span className={currentDateClass}>2019年6月</span>
        <button className={movePrevBtnClass} onClick={this.onMovePrevBtnPushed}>
          <i className={iconClass}>chevron_left</i>
        </button>
        <button className={moveTodayBtnClass} onClick={this.onMoveTodayBtnPushed}>今月</button>
        <button className={moveNextBtnClass} onClick={this.onMoveNextBtnPushed}>
          <i className={iconClass}>chevron_right</i>
        </button>
        <button className={jumpBtnClass} onClick={this.onJumpBtnPushed}>移動</button>
        <select className={Style.ViewUnitSelect} defaultValue="month" onChange={this.onViewUnitChanged}>
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
    global.console.log('onMovePrevBtnPushed');
  }

  private onMoveTodayBtnPushed() {
    global.console.log('onMoveTodayBtnPushed');
  }

  private onMoveNextBtnPushed() {
    global.console.log('onMoveNextBtnPushed');
  }

  private onJumpBtnPushed() {
    global.console.log('onJumpBtnPushed');
  }

  private onFilterBtnPushed() {
    global.console.log('onFilterBtnPushed');
  }

  private onNewRecordBtnPushed() {
    global.console.log('onNewRecordBtnPushed');
    this.setState({modalAddRecord: true});
  }
}

export default PageHomeHeader;