import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import IStoreState from 'src/state/IStoreState';
import Store from 'src/state/Store';
import * as UiActions from 'src/state/ui/Actions';
import * as UiStates from 'src/state/ui/States';
import * as UiTypes from 'src/state/ui/Types';
import * as BasicStyles from 'src/view/Basic.css';
import * as LayoutStyles from 'src/view/Layout.css';
import MaterialIcon from 'src/view/widget/material-icon';
import * as Styles from './Header.css';

class Header extends React.Component<UiStates.IPageSheet> {
  constructor(props: UiStates.IPageSheet) {
    super(props);
  }

  public render() {
    const rootClass = ClassNames(Styles.Root);
    const movePrevBtnClass = ClassNames(BasicStyles.StdBtnPrimary, Styles.Btn, Styles.MoveBtn, Styles.MovePrevBtn);
    const moveTodayBtnClass = ClassNames(BasicStyles.StdBtnPrimary, Styles.Btn, Styles.MoveBtn);
    const moveNextBtnClass = ClassNames(BasicStyles.StdBtnPrimary, Styles.Btn, Styles.MoveBtn, Styles.MoveNextBtn);
    const viewUnitSelectClass = ClassNames(BasicStyles.StdSelect, Styles.ViewUnitSelect);
    const rightAreaClass = ClassNames(LayoutStyles.RightToLeft, Styles.RightArea);

    return (
      <div className={rootClass}>
        <select
          className={viewUnitSelectClass}
          defaultValue={this.props.viewUnit.toString()}
          onChange={(event) => this.onViewUnitChanged(event)}
        >
          <option value={UiTypes.SheetViewUnit.Day}>日別</option>
          <option value={UiTypes.SheetViewUnit.Month}>月間</option>
          <option value={UiTypes.SheetViewUnit.Year}>年間</option>
        </select>
        <button className={movePrevBtnClass} onClick={this.onMovePrevBtnPushed}>
          <MaterialIcon name="chevron_left" classNames={[]} darkMode={true} />
        </button>
        <button className={moveTodayBtnClass} onClick={this.onMoveTodayBtnPushed}>
          今日
        </button>
        <button className={moveNextBtnClass} onClick={this.onMoveNextBtnPushed}>
          <MaterialIcon name="chevron_right" classNames={[]} darkMode={true} />
        </button>

        <div className={rightAreaClass}>
          <div style={{ width: '100%' }} />
        </div>
      </div>
    );
  }

  private onViewUnitChanged(e: React.ChangeEvent<HTMLSelectElement>) {
    Store.dispatch(UiActions.sheetChangeViewUnit(Number(e.target.value)));
  }

  private onMovePrevBtnPushed() {
    Store.dispatch(UiActions.sheetMovePrev());
  }

  private onMoveTodayBtnPushed() {
    Store.dispatch(UiActions.sheetMoveToday());
  }

  private onMoveNextBtnPushed() {
    Store.dispatch(UiActions.sheetMoveNext());
  }
}

const mapStateToProps = (state: IStoreState) => {
  return state.ui.pageSheet;
};
export default ReactRedux.connect(mapStateToProps)(Header);
