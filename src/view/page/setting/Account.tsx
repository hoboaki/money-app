import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as DocStates from 'src/state/doc/States';
import IStoreState from 'src/state/IStoreState';
// import Store from 'src/state/Store';
import * as BasicStyles from 'src/view/Basic.css';
import * as LayoutStyles from 'src/view/Layout.css';
import * as PageStyles from 'src/view/page/Page.css';
import MaterialIcon from 'src/view/widget/material-icon';
import RadioButtonGroup from 'src/view/widget/radio-button-group';

import * as Styles from './Account.css';
import Header from './Header';

enum TabKind {
  Assets,
  Liabilities,
  Aggregate,
}

interface IProps {
  doc: DocStates.IState;
}

interface IState {
  selectedTab: TabKind;
}

class Account extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      selectedTab: TabKind.Assets,
    };
  }

  public render() {
    const rootClass = ClassNames(PageStyles.Base, LayoutStyles.TopToBottom);
    const header = <Header title={'口座管理'} iconName="payment" />;

    const btnInfos = [
      { label: '資産', onChanged: () => this.onTabChanged(TabKind.Assets) },
      { label: '負債', onChanged: () => this.onTabChanged(TabKind.Liabilities) },
      { label: '集計', onChanged: () => this.onTabChanged(TabKind.Aggregate) },
    ];
    const controlBar = (
      <div className={Styles.ControlBar}>
        <div className={Styles.ControlBarAreaLeft}>
          <RadioButtonGroup btns={btnInfos} selectedBtnIndex={this.state.selectedTab} />
        </div>
        <div className={Styles.ControlBarAreaRight}>
          <button className={BasicStyles.IconBtn}>
            <MaterialIcon name={'add'} classNames={[]} darkMode={false} />
          </button>
        </div>
      </div>
    );

    const cards: JSX.Element[] = [];
    if (this.state.selectedTab !== TabKind.Aggregate) {
      const accounts =
        this.state.selectedTab === TabKind.Assets
          ? this.props.doc.account.orderAssets
          : this.props.doc.account.orderLiabilities;
      accounts.forEach((id) => {
        const account = this.props.doc.account.accounts[id];
        cards.push(
          <div key={`${this.state.selectedTab}-${id}`} className={Styles.AccountCard}>
            <MaterialIcon name="reorder" classNames={[]} darkMode={false} />
            <span>{account.name}</span>
            <div className={Styles.AccountCardTailSpace}>
              <MaterialIcon name="more_horiz" classNames={[]} darkMode={false} />
            </div>
          </div>,
        );
      });
    }
    const accountList = <div className={Styles.AccountList}>{cards}</div>;

    const body = (
      <div className={Styles.BodyRoot}>
        {controlBar}
        {accountList}
      </div>
    );

    return (
      <div className={rootClass}>
        {header}
        {body}
      </div>
    );
  }

  private onTabChanged(tabKind: TabKind) {
    this.setState({
      selectedTab: tabKind,
    });
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    doc: state.doc,
  };
};
export default ReactRedux.connect(mapStateToProps)(Account);
