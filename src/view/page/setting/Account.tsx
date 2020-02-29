import ClassNames from 'classnames';
import * as React from 'react';
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

interface IState {
  selectedTab: TabKind;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Account extends React.Component<any, IState> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(props: any) {
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

    const accountList = <div className={Styles.AccountList}>口座リスト</div>;

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

export default Account;
