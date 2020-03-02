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
import AccountEditDialog from 'src/view/widget/account-edit-dialog';
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
  /** 選択中のタブ。 */
  selectedTab: TabKind;

  /** 口座編集対象。 */
  editAccountId: number | null;

  /** 口座編集ダイアログをモーダル中か。 */
  modalAccountEdit: boolean;
}

class Account extends React.Component<IProps, IState> {
  private elemIdAccountList: string;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      selectedTab: TabKind.Assets,
      editAccountId: null,
      modalAccountEdit: false,
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
        } else {
          Store.dispatch(DocActions.updateAggregateAccountOrder(oldIndex, newIndex));
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
          <button className={BasicStyles.IconBtn} onClick={(e) => this.onAddBtnClicked(e)}>
            <MaterialIcon name={'add'} classNames={[]} darkMode={false} />
          </button>
        </div>
      </div>
    );

    const cards: JSX.Element[] = [];
    {
      const accountsSelector = () => {
        if (this.state.selectedTab !== TabKind.Aggregate) {
          const orders =
            this.state.selectedTab === TabKind.Assets
              ? this.props.doc.account.orderAssets
              : this.props.doc.account.orderLiabilities;
          return orders.map((id) => {
            const account = this.props.doc.account.accounts[id];
            return {
              id: account.id,
              name: account.name,
            };
          });
        }
        return this.props.doc.aggregateAccount.order.map((id) => {
          const account = this.props.doc.aggregateAccount.accounts[id];
          return {
            id: account.id,
            name: account.name,
          };
        });
      };
      accountsSelector().forEach((account) => {
        cards.push(
          <li key={`${this.state.selectedTab}-${account.id}`} className={Styles.AccountCard}>
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

    const modalDialog = ((): JSX.Element | null => {
      if (!this.state.modalAccountEdit) {
        return null;
      }
      if (this.state.selectedTab !== TabKind.Aggregate) {
        return (
          <AccountEditDialog
            accountGroup={
              this.state.selectedTab === TabKind.Assets
                ? DocTypes.AccountGroup.Assets
                : DocTypes.AccountGroup.Liabilities
            }
            editAccountId={this.state.editAccountId}
            onClosed={(isCanceled) => this.onAccountEditDialogClosed(isCanceled)}
          />
        );
      } else {
        return null;
      }
    })();

    const body = (
      <div className={Styles.BodyRoot}>
        <div className={Styles.Body}>
          {controlBar}
          {accountList}
          {modalDialog}
        </div>
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

  private onAddBtnClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    e.stopPropagation();

    if (this.state.selectedTab !== TabKind.Aggregate) {
      this.setState({
        modalAccountEdit: true,
      });
    } else {
      //...
    }
  }

  private onAccountEditDialogClosed(isCanceled: boolean): void {
    // 変更がなある場合は口座に関する前回入力値をリセットする
    if (!isCanceled) {
      // ...
    }

    // 後始末
    this.setState({
      editAccountId: null,
      modalAccountEdit: false,
    });
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    doc: state.doc,
  };
};
export default ReactRedux.connect(mapStateToProps)(Account);
