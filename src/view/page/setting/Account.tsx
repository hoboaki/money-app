import ClassNames from 'classnames';
import { Menu, remote } from 'electron';
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
import BasicAccountEditDialog from 'src/view/widget/basic-account-edit-dialog';
import MaterialIcon from 'src/view/widget/material-icon';
import * as NativeDialogUtils from 'src/view/widget/native-dialog-utils';
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

  /** 口座編集ダイアログの口座グループ。 */
  dialogAccountGroup: DocTypes.BasicAccountGroup;

  /** 口座編集対象。 */
  editAccountId: number | null;

  /** カードのコンテキストメニュー表示中か。 */
  cardActionMenuActive: boolean;

  /** 口座編集ダイアログをモーダル中か。 */
  modalAccountEdit: boolean;
}

class Account extends React.Component<IProps, IState> {
  private addActionMenu: Menu;
  private cardActionMenu: Menu;
  private elemIdAccountList: string;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      selectedTab: TabKind.Assets,
      dialogAccountGroup: DocTypes.BasicAccountGroup.Assets,
      editAccountId: null,
      modalAccountEdit: false,
      cardActionMenuActive: false,
    };
    this.elemIdAccountList = `elem-${UUID}`;

    // 追加アクションMenu
    const addAction = (accountGroup: DocTypes.BasicAccountGroup) => {
      this.setState({
        dialogAccountGroup: accountGroup,
        editAccountId: null,
        modalAccountEdit: true,
      });
    };
    this.addActionMenu = new remote.Menu();
    this.addActionMenu.append(
      new remote.MenuItem({
        label: '資産口座を作成...',
        click: () => {
          addAction(DocTypes.BasicAccountGroup.Assets);
        },
      }),
    );
    this.addActionMenu.append(
      new remote.MenuItem({
        label: '負債口座を作成...',
        click: () => {
          addAction(DocTypes.BasicAccountGroup.Liabilities);
        },
      }),
    );
    this.addActionMenu.append(
      new remote.MenuItem({
        label: '集計口座を作成...（準備中）',
        enabled: false,
      }),
    );

    // カードアクションMenu
    this.cardActionMenu = new remote.Menu();
    this.cardActionMenu.append(
      new remote.MenuItem({
        label: '編集...',
        click: () => {
          this.setState({ modalAccountEdit: true });
        },
      }),
    );
    this.cardActionMenu.append(
      new remote.MenuItem({
        label: '削除...',
        click: () => {
          this.accountDelete();
        },
      }),
    );
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
            DocActions.updateBasicAccountOrder(
              this.state.selectedTab === TabKind.Assets
                ? DocTypes.BasicAccountGroup.Assets
                : DocTypes.BasicAccountGroup.Liabilities,
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
              ? this.props.doc.basicAccount.orderAssets
              : this.props.doc.basicAccount.orderLiabilities;
          return orders.map((id) => {
            const account = this.props.doc.basicAccount.accounts[id];
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
          <li
            key={`${this.state.selectedTab}-${account.id}`}
            className={Styles.AccountCard}
            data-selected={this.state.cardActionMenuActive && this.state.editAccountId === account.id}
          >
            <MaterialIcon name="reorder" classNames={[Styles.AccountCardHandle]} darkMode={false} />
            <span>{account.name}</span>
            <div className={Styles.AccountCardTailSpace}>
              <button className={BasicStyles.IconBtn} onClick={(e) => this.onCardActionBtnClicked(e, account.id)}>
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
      if (this.state.dialogAccountGroup === DocTypes.BasicAccountGroup.Invalid) {
        return null;
      }
      return (
        <BasicAccountEditDialog
          accountGroup={this.state.dialogAccountGroup}
          editAccountId={this.state.editAccountId}
          onClosed={(isCanceled) => this.onAccountEditDialogClosed(isCanceled)}
        />
      );
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
    this.addActionMenu.popup();
  }

  private onCardActionBtnClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number): void {
    e.stopPropagation();
    const dialogAccountGroupSelector = () => {
      switch (this.state.selectedTab) {
        case TabKind.Assets:
          return DocTypes.BasicAccountGroup.Assets;
        case TabKind.Liabilities:
          return DocTypes.BasicAccountGroup.Liabilities;
        default:
          return DocTypes.BasicAccountGroup.Invalid;
      }
    };
    this.setState({ cardActionMenuActive: true, dialogAccountGroup: dialogAccountGroupSelector(), editAccountId: id });
    this.cardActionMenu.popup({
      callback: () => {
        this.setState({ cardActionMenuActive: false });
      },
    });
  }

  private onAccountEditDialogClosed(isCanceled: boolean): void {
    // タブを更新
    const selectedTabSelector = () => {
      // キャンセル時は変更無し
      if (isCanceled) {
        return this.state.selectedTab;
      }

      // 追加・更新があった場合はその口座のタブを選択
      switch (this.state.dialogAccountGroup) {
        case DocTypes.BasicAccountGroup.Assets:
          return TabKind.Assets;
        case DocTypes.BasicAccountGroup.Liabilities:
          return TabKind.Liabilities;
        default:
          return this.state.selectedTab;
      }
    };

    // 後始末
    this.setState({
      selectedTab: selectedTabSelector(),
      editAccountId: null,
      modalAccountEdit: false,
    });
  }

  private accountDelete() {
    // 値チェック
    if (this.state.editAccountId === null) {
      throw new Error();
    }

    // 確認
    if (
      !NativeDialogUtils.showOkCancelDialog(
        '口座の削除',
        `${this.props.doc.basicAccount.accounts[this.state.editAccountId].name}を削除しますか？`,
        '口座に紐付くレコードは削除されます。',
        '口座を削除',
      )
    ) {
      return;
    }

    // 削除を実行
    Store.dispatch(DocActions.deleteAccount(this.state.editAccountId));
    Store.dispatch(UiActions.recordEditDialogUpdateLatestValue(null, null, null)); // 前回入力値情報をリセット

    // 自動保存
    Store.dispatch(UiActions.documentRequestAutoSave());
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    doc: state.doc,
  };
};
export default ReactRedux.connect(mapStateToProps)(Account);
