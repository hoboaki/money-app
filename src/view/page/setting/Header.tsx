import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import IStoreState from 'src/state/IStoreState';
import * as UiStates from 'src/state/ui/States';
import * as BasicStyles from 'src/view/Basic.css';
import MaterialIcon from 'src/view/widget/material-icon';

import * as Styles from './Header.css';

interface IProps {
  states: UiStates.IPageSetting;
  title: string;
}

class Header extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const rootClass = ClassNames(Styles.Root);
    const movePrevBtnClass = ClassNames(BasicStyles.StdBtnPrimary, Styles.Btn, Styles.MoveBtn, Styles.MovePrevBtn);

    return (
      <div className={rootClass}>
        <button className={movePrevBtnClass} onClick={(e) => this.onMovePrevBtnPushed(e)}>
          <MaterialIcon name="chevron_left" classNames={[]} darkMode={true} />
        </button>
        <span>{this.props.title}</span>
      </div>
    );
  }

  private onMovePrevBtnPushed(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    e.stopPropagation();
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    states: state.ui.pageSetting,
  };
};
export default ReactRedux.connect(mapStateToProps)(Header);
