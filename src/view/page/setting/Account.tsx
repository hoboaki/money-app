import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import Sortable from 'sortablejs';
import * as DocActions from 'src/state/doc/Actions';
import * as DocStates from 'src/state/doc/States';
import * as DocTypes from 'src/state/doc/Types';
import IStoreState from 'src/state/IStoreState';
import Store from 'src/state/Store';
import * as UiActions from 'src/state/ui/Actions';
import * as BasicStyles from 'src/view/Basic.css';
import * as LayoutStyles from 'src/view/Layout.css';
import * as PageStyles from 'src/view/page/Page.css';
import MaterialIcon from 'src/view/widget/material-icon';
import RadioButtonGroup from 'src/view/widget/radio-button-group';
import { v4 as UUID } from 'uuid';

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
  private elemIdAccountList: string;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      selectedTab: TabKind.Assets,
    };
    this.elemIdAccountList = `elem-${UUID}`;
  }

  public componentDidMount() {
    // 並び替えUIのセットアップ
    const elem = document.getElementById(`${this.elemIdAccountList}`);
    if (elem === null) {
      throw new Error();
    }
    Sortable.create(elem, {
      animation: 150,
      ghostClass: Styles.AccountCardGhost,
      handle: `.${Styles.AccountCardHandle}`,
      onEnd: (evt) => {
        // 値チェック
        if (evt.newIndex === undefined || evt.oldIndex === undefined) {
          throw new Error();
        }

        // 順番変更を反映
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;
        if (this.state.selectedTab !== TabKind.Aggregate) {
          Store.dispatch(
            DocActions.updateAccountOrder(
              this.state.selectedTab === TabKind.Assets
                ? DocTypes.AccountGroup.Assets
                : DocTypes.AccountGroup.Liabilities,
              oldIndex,
              newIndex,
            ),
          );
        }

        // 自動保存リクエスト
        Store.dispatch(UiActions.documentRequestAutoSave());
      },
    });
  }

  public render() {
    const rootClass = ClassNames(PageStyles.Base, LayoutStyles.TopToBottom);
    const header = <Header title={'口座設定'} iconName="payment" />;

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
          <li key={`${this.state.selectedTab}-${id}`} className={Styles.AccountCard}>
            <MaterialIcon name="reorder" classNames={[Styles.AccountCardHandle]} darkMode={false} />
            <span>{account.name}</span>
            <div className={Styles.AccountCardTailSpace}>
              <button className={BasicStyles.IconBtn}>
                <MaterialIcon name="more_horiz" classNames={[]} darkMode={false} />
              </button>
            </div>
          </li>,
        );
      });
    }
    const accountList = (
      <ol id={this.elemIdAccountList} className={Styles.AccountList}>
        {cards}
      </ol>
    );

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
