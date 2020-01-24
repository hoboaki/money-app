import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as DocStates from 'src/state/doc/States';
import IStoreState from 'src/state/IStoreState';
import Store from 'src/state/Store';
import * as UiActions from 'src/state/ui/Actions';
import * as UiStates from 'src/state/ui/States';
import IYearMonthDayDate from 'src/util/IYearMonthDayDate';
import * as IYearMonthDayDateUtils from 'src/util/IYearMonthDayDateUtils';
import * as BasicStyles from 'src/view/Basic.css';
import * as LayoutStyles from 'src/view/Layout.css';
import RecordAddDialog from 'src/view/widget/record-add-dialog';
import * as Styles from './Header.css';

interface IProps {
  doc: DocStates.IState;
  page: UiStates.IPageHome;
}

interface IState {
  modalAddRecord: boolean; // レコードの追加ダイアログ表示する場合に true を指定。
}

class Header extends React.Component<IProps, IState> {
  constructor(props: IProps) {
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
      BasicStyles.StdBtnPrimary,
      Styles.Btn,
      Styles.MoveBtn,
      Styles.MovePrevBtn,
    );
    const moveTodayBtnClass = ClassNames(
      BasicStyles.StdBtnPrimary,
      Styles.Btn,
      Styles.MoveBtn,
    );
    const moveNextBtnClass = ClassNames(
      BasicStyles.StdBtnPrimary,
      Styles.Btn,
      Styles.MoveBtn,
      Styles.MoveNextBtn,
    );
    const viewUnitSelectClass = ClassNames(
      BasicStyles.StdSelect,
      Styles.ViewUnitSelect,
    );
    const jumpBtnClass = ClassNames(
      BasicStyles.StdBtnPrimary,
      Styles.Btn,
      Styles.JumpBtn,
    );
    const filterBtnClass = ClassNames(
      BasicStyles.IconBtn,
      Styles.Btn,
      Styles.FilterBtn,
    );
    const rightAreaClass = ClassNames(
      LayoutStyles.RightToLeft,
      Styles.RightArea,
    );
    const newRecordBtnClass = ClassNames(
      BasicStyles.IconBtn,
      Styles.Btn,
      Styles.NewRecordBtn,
    );
    const iconClass = ClassNames(
      'material-icons',
      'md-16',
    );
    let modalDialog: JSX.Element | null = null;
    if (this.state.modalAddRecord) {
        modalDialog = <RecordAddDialog
          formDefaultDate={IYearMonthDayDateUtils.today()}
          additionalRecords={[]}
          onClosed={() => {
            this.setState({modalAddRecord: false});
          }}
        />;
    }
    const currentDate = `${this.props.page.currentDate.year}年${this.props.page.currentDate.month}月`;
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
        {/* <button className={jumpBtnClass} onClick={this.onJumpBtnPushed}>移動</button> */}
        <select className={viewUnitSelectClass} defaultValue="month" onChange={this.onViewUnitChanged}>
          <option value="month">月表示</option>
        </select>
        <button className={filterBtnClass} onClick={() => {this.onFilterBtnPushed(); }} title={'フィルター（準備中）'}>
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
  return {
    doc: state.doc,
    page: state.ui.pageHome,
  };
};
export default ReactRedux.connect(mapStateToProps)(Header);
