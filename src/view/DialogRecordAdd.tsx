import ClassNames from 'classnames';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/l10n/ja.js';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import { v4 as UUID } from 'uuid';
import * as DocActions from '../state/doc/Actions';
import * as DocStateMethods from '../state/doc/StateMethods';
import * as DocStates from '../state/doc/States';
import * as DocTypes from '../state/doc/Types';
import IStoreState from '../state/IStoreState';
import Store from '../state/Store';
import * as UiActions from '../state/ui/Actions';
import * as UiStates from '../state/ui/States';
import YearMonthDayDate from '../util/YearMonthDayDate';
import * as Style from './DialogRecordAdd.css';

interface IProps {
  onClosed: (() => void);
}

interface ILocalProps extends IProps {
  accounts: DocStates.IAccount[];
  incomeCategories: { [key: number]: DocStates.ICategory };
  outgoCategories: { [key: number]: DocStates.ICategory };
  dialogRecordAdd: UiStates.IDialogAddRecord;
}

interface IState {
  formKind: DocTypes.RecordKind;
  formDate: string;
  formCategoryOutgo: number;
  formCategoryIncome: number;
  formAccount: number;
  formAccountFrom: number;
  formAccountTo: number;
  formAmount: number | null;
  formMemo: string;
  amountErrorMsg: string | null;
  accountFromErrorMsg: string | null;
  accountToErrorMsg: string | null;
}

class DialogRecordAdd extends React.Component<ILocalProps, IState> {
  private elementIdRoot: string;
  private elementIdFormCategoryOutgo: string;
  private elementIdFormCategoryIncome: string;
  private elementIdFormDate: string;
  private elementIdFormAccount: string;
  private elementIdFormAccountFrom: string;
  private elementIdFormAccountTo: string;
  private elementIdFormAmount: string;
  private elementIdFormMemo: string;
  private elementIdFormIsContinueMode: string;
  private elementIdFormSubmit: string;
  private closeObserver: MutationObserver;

  constructor(props: ILocalProps) {
    super(props);
    this.state = {
      formKind: DocTypes.RecordKind.Outgo,
      formDate: new YearMonthDayDate().toText(),
      formCategoryOutgo: DocStateMethods.firstLeafCategory(this.props.outgoCategories).id,
      formCategoryIncome: DocStateMethods.firstLeafCategory(this.props.incomeCategories).id,
      formAccount: Number(Object.keys(props.accounts)[0]),
      formAccountFrom: DocTypes.INVALID_ID,
      formAccountTo: DocTypes.INVALID_ID,
      formAmount: null,
      formMemo: '',
      amountErrorMsg: null,
      accountFromErrorMsg: null,
      accountToErrorMsg: null,
    };
    this.elementIdRoot = `elem-${UUID()}`;
    this.elementIdFormCategoryOutgo = `elem-${UUID()}`;
    this.elementIdFormCategoryIncome = `elem-${UUID()}`;
    this.elementIdFormDate = `elem-${UUID()}`;
    this.elementIdFormAccount = `elem-${UUID()}`;
    this.elementIdFormAccountFrom = `elem-${UUID()}`;
    this.elementIdFormAccountTo = `elem-${UUID()}`;
    this.elementIdFormAmount = `elem-${UUID()}`;
    this.elementIdFormMemo = `elem-${UUID()}`;
    this.elementIdFormIsContinueMode = `elem-${UUID()}`;
    this.elementIdFormSubmit = `elem-${UUID()}`;
    this.closeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'aria-modal' && mutation.oldValue === 'true') {
          this.props.onClosed();
        }
      });
    });
  }

  public componentDidMount() {
    // DatePicker セットアップ
    flatpickr(`#${this.elementIdFormDate}`, {
      locale: 'ja',
      onClose: ((selectedDates, dateStr, instance) => {
        this.setState({formDate: dateStr});
      }),
    });

    // ContextMenu セットアップ
    const categorySetup = (
      categories: {[key: number]: DocStates.ICategory},
      onCategorySelected: (categoryId: number) => void,
      selector: string,
      ) => {
        const categoryItems: {[key: string]: any} = {};
        const categoryConvertFunc = (parent: {[key: string]: any}, cat: DocStates.ICategory) => {
          const key = `category-${cat.id}`;
          const name = cat.name;
          const items: {[key: string]: any} = {};
          cat.childs.forEach((child) => {
            categoryConvertFunc(items, categories[child]);
          });
          parent[key] = {
            name,
            items: Object.keys(items).length === 0 ? null : items,
          };
        };
        Object.entries(categories).forEach(([key, value]) => {
          if (value.parent == null) {
            categoryConvertFunc(categoryItems, categories[value.id]);
          }
        });
        $.contextMenu({
          callback: (key, options) => {
            const texts = key.split('-');
            onCategorySelected(Number(texts[1]));
          },
          className: Style.ContextMenuRoot,
          items: categoryItems,
          selector,
          trigger: 'left',
        });
    };
    categorySetup(
      this.props.outgoCategories,
      (categoryId) => {
        this.setState({
          formCategoryOutgo: categoryId,
        });
      },
      `#${this.elementIdFormCategoryOutgo}`,
    );
    categorySetup(
      this.props.incomeCategories,
      (categoryId) => {
        this.setState({
          formCategoryIncome: categoryId,
        });
      },
      `#${this.elementIdFormCategoryIncome}`,
    );

    // ツールチップ対応
    new Function(`$('#${this.elementIdFormSubmit}').tooltip({
      title: '⌘Cmd + ⏎', delay: {show: 500, hide: 100}, placement:'bottom'
    })`)();

    // ダイアログ表示（MDB が TypeScript 非対応なので文字列で実行）
    new Function(`$('#${this.elementIdRoot}').modal('show')`)();

    // ダイアログの閉じ終わった瞬間を感知するための監視
    // TypeScript 環境では MDB Modal に JavaScript イベントを登録できないため属性変更検知で代用
    const target = document.getElementById(this.elementIdRoot);
    if (target === null) {
      throw new Error();
    }
    const config = {
      attributeOldValue: true,
      attributes: true,
      subtree: false,
    };
    this.closeObserver.observe(target, config);
  }

  public componentWillUnmount() {
    this.closeObserver.disconnect();
  }

  public render() {
    const formTabsRootClass = ClassNames(
      Style.FormTabsRoot,
    );
    const formTabsBaseClass = ClassNames(
      Style.FormTabsBase,
    );
    const formTabOutgoClass = ClassNames(
      Style.FormTab,
      this.state.formKind === DocTypes.RecordKind.Outgo ? Style.FormTabActive : null,
    );
    const formTabIncomeClass = ClassNames(
      Style.FormTab,
      this.state.formKind === DocTypes.RecordKind.Income ? Style.FormTabActive : null,
    );
    const formTabTransferClass = ClassNames(
      Style.FormTab,
      Style.FormTabLast,
      this.state.formKind === DocTypes.RecordKind.Transfer ? Style.FormTabActive : null,
    );
    const formSvgIconClass = ClassNames(
      Style.FormSvgIcon,
    );

    const formInputRootClass = ClassNames(
      Style.FormInputRoot,
    );
    const formInputRowCategoryOutgoClass = ClassNames(
      this.state.formKind === DocTypes.RecordKind.Outgo ? null : Style.FormInputRowHide,
    );
    const formInputRowCategoryIncomeClass = ClassNames(
      this.state.formKind === DocTypes.RecordKind.Income ? null : Style.FormInputRowHide,
    );
    const formInputRowAcountClass = ClassNames(
      this.state.formKind !== DocTypes.RecordKind.Transfer ? null : Style.FormInputRowHide,
    );
    const formInputRowAcountFromToClass = ClassNames(
      this.state.formKind === DocTypes.RecordKind.Transfer ? null : Style.FormInputRowHide,
    );
    const formInputCategoryClass = ClassNames(
      Style.FormInputCategory,
    );
    const formInputAccountSelectClass = ClassNames(
      Style.FormInputAccount,
    );

    const formFooterRootClass = ClassNames(
      'modal-footer',
      Style.FormFooterRoot,
    );

    const amountEmptyErrorMsg = this.state.amountErrorMsg == null ? null :
      <span className={Style.FormErrorMsg}>{this.state.amountErrorMsg}</span>;
    const accountFromErrorMsg = this.state.accountFromErrorMsg == null ? null :
      <span className={Style.FormErrorMsg}>{this.state.accountFromErrorMsg}</span>;
    const accountToErrorMsg = this.state.accountToErrorMsg == null ? null :
      <span className={Style.FormErrorMsg}>{this.state.accountToErrorMsg}</span>;

    return (
      <div className="modal fade" id={this.elementIdRoot} tabIndex={-1}
        role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">レコードの追加</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div>
              <div className={formTabsRootClass}>
                <div className={formTabsBaseClass}>
                  <div className={formTabOutgoClass}>
                    <button className={Style.FormTabButton}
                      disabled={this.state.formKind === DocTypes.RecordKind.Outgo}
                      onClick={() => {this.setState({formKind: DocTypes.RecordKind.Outgo}); }}
                      >
                      <img className={formSvgIconClass} src="./image/icon-ex/outgo-outline.svg"/>
                      <span className={Style.FormTabLabel}>支出</span>
                    </button>
                  </div>
                  <div className={formTabIncomeClass}>
                    <button className={Style.FormTabButton}
                      disabled={this.state.formKind === DocTypes.RecordKind.Income}
                      onClick={() => {this.setState({formKind: DocTypes.RecordKind.Income}); }}
                      >
                      <img className={formSvgIconClass} src="./image/icon-ex/income-outline.svg"/>
                      <span className={Style.FormTabLabel}>収入</span>
                    </button>
                  </div>
                  <div className={formTabTransferClass}>
                    <button className={Style.FormTabButton}
                      disabled={this.state.formKind === DocTypes.RecordKind.Transfer}
                      onClick={() => {this.setState({formKind: DocTypes.RecordKind.Transfer}); }}
                      >
                      <img className={formSvgIconClass} src="./image/icon-ex/transfer-outline.svg"/>
                      <span className={Style.FormTabLabel}>振替</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className={formInputRootClass}>
                <table>
                  <tbody>
                    <tr>
                      <th scope="row">日付</th>
                      <td>
                        <input
                          type="text"
                          id={this.elementIdFormDate}
                          value={this.state.formDate}
                          readOnly={true}
                          />
                      </td>
                    </tr>
                    <tr className={formInputRowCategoryOutgoClass}>
                      <th scope="row">カテゴリ</th>
                      <td>
                        <input
                          type="text"
                          id={this.elementIdFormCategoryOutgo}
                          className={formInputCategoryClass}
                          readOnly={true}
                          value={this.categoryOutgoDisplayText()}
                          />
                      </td>
                    </tr>
                    <tr className={formInputRowCategoryIncomeClass}>
                      <th scope="row">カテゴリ</th>
                      <td>
                        <input
                          type="text"
                          id={this.elementIdFormCategoryIncome}
                          className={formInputCategoryClass}
                          readOnly={true}
                          value={this.categoryIncomeDisplayText()}
                          />
                      </td>
                    </tr>
                    <tr className={formInputRowAcountClass}>
                      <th scope="row">口座</th>
                      <td>
                        <select value={this.state.formAccount.toString()}
                          className={formInputAccountSelectClass}
                          id={this.elementIdFormAccount}
                          onChange={(event) => {this.onFormAccountChanged(event.target); }}
                          onKeyDown={(event) => {this.onKeyDown(event); }}
                          >
                          {this.props.accounts.map((account) => {
                            return (
                              <option key={account.id} value={account.id}>{account.name}</option>
                            );
                          })}
                        </select>
                      </td>
                    </tr>
                    <tr className={formInputRowAcountFromToClass}>
                      <th scope="row">送金元</th>
                      <td>
                        <select value={this.state.formAccountFrom}
                          className={formInputAccountSelectClass}
                          id={this.elementIdFormAccountFrom}
                          onChange={(event) => {this.onFormAccountFromChanged(event.target); }}
                          onKeyDown={(event) => {this.onKeyDown(event); }}
                          >
                          <option value={DocTypes.INVALID_ID}>（未選択）</option>
                          {this.props.accounts.map((account) => {
                            return (
                              <option key={account.id} value={account.id}>{account.name}</option>
                            );
                          })}
                        </select>
                        {accountFromErrorMsg}
                      </td>
                    </tr>
                    <tr className={formInputRowAcountFromToClass}>
                      <th scope="row">送金先</th>
                      <td>
                        <select value={this.state.formAccountTo}
                          className={formInputAccountSelectClass}
                          id={this.elementIdFormAccountTo}
                          onChange={(event) => {this.onFormAccountToChanged(event.target); }}
                          onKeyDown={(event) => {this.onKeyDown(event); }}
                          >
                          <option value={DocTypes.INVALID_ID}>（未選択）</option>
                          {this.props.accounts.map((account) => {
                            return (
                              <option key={account.id} value={account.id}>{account.name}</option>
                            );
                          })}
                        </select>
                        {accountToErrorMsg}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">金額</th>
                      <td>
                        <input type="text"
                          id={this.elementIdFormAmount}
                          value={this.state.formAmount != null ? this.state.formAmount.toString() : ''}
                          onChange={(event) => {this.onFormAmountChanged(event.target); }}
                          onKeyDown={(event) => {this.onKeyDown(event); }}
                          onFocus={(event) => {event.target.select(); }}
                          onClick={(event) => {event.currentTarget.select(); return false; }}
                          />
                        {amountEmptyErrorMsg}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">メモ</th>
                      <td>
                        <input className={Style.FormInputMemo} type="text"
                          id={this.elementIdFormMemo}
                          value={this.state.formMemo}
                          onChange={(event) => {this.onFormMemoChanged(event.target); }}
                          onKeyDown={(event) => {this.onKeyDown(event); }}
                          onFocus={(event) => {event.target.select(); }}
                          onClick={(event) => {event.currentTarget.select(); return false; }}
                          />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className={formFooterRootClass}>
              <label>
                <input type="checkbox"
                  id={this.elementIdFormIsContinueMode}
                  checked={this.props.dialogRecordAdd.isContinueMode}
                  onChange={(event) => {this.onIsContinueModeChanged(event.target); }}
                  />続けて入力
              </label>
              <button type="button"
                className="btn btn-primary"
                id={this.elementIdFormSubmit}
                data-toggle="tooltip"
                onClick={() => {this.onAddButtonClicked(); }}
                >追加</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /// カテゴリインプットに表示するテキストを返す。
  private categoryOutgoDisplayText(): string {
    return this.categoryDisplayText(
      this.props.outgoCategories,
      this.state.formCategoryOutgo,
    );
  }
  private categoryIncomeDisplayText(): string {
    return this.categoryDisplayText(
      this.props.incomeCategories,
      this.state.formCategoryIncome,
    );
  }
  private categoryDisplayText(categories: {[key: number]: DocStates.ICategory}, categoryId: number): string {
    const funcParentPath = (catId: number): string => {
      const cat = categories[catId];
      if (cat.parent == null) {
        return cat.name;
      }
      return `${funcParentPath(cat.parent)} > ${cat.name}`;
    };
    return funcParentPath(categoryId);
  }

  /// 口座値変更時の処理。
  private onFormAccountChanged(sender: HTMLSelectElement) {
    this.setState({formAccount: Number(sender.value)});
  }

  /// 送金元値変更時の処理。
  private onFormAccountFromChanged(sender: HTMLSelectElement) {
    const newAccountFrom = Number(sender.value);
    let accountTo = this.state.formAccountTo;
    if (newAccountFrom !== DocTypes.INVALID_ID && newAccountFrom === accountTo) {
      // 同じ口座を選ばせないようにするために片方を未選択にする
      accountTo = DocTypes.INVALID_ID;
    }
    this.setState({
      formAccountFrom: newAccountFrom,
      formAccountTo: accountTo,
    });
  }

  /// 送金先値変更時の処理。
  private onFormAccountToChanged(sender: HTMLSelectElement) {
    const newAccountTo = Number(sender.value);
    let accountFrom = this.state.formAccountFrom;
    if (newAccountTo !== DocTypes.INVALID_ID && newAccountTo === accountFrom) {
      // 同じ口座を選ばせないようにするために片方を未選択にする
      accountFrom = DocTypes.INVALID_ID;
    }
    this.setState({
      formAccountFrom: accountFrom,
      formAccountTo: newAccountTo,
    });
  }

  /// 価格値変更時の処理。
  private onFormAmountChanged(sender: HTMLInputElement) {
    this.setState({formAmount: Number(sender.value)});
  }

  /// メモ変更時の処理。
  private onFormMemoChanged(sender: HTMLInputElement) {
    this.setState({formMemo: sender.value});
  }

  /// 続けて入力モードフラグ変更時の処理。
  private onIsContinueModeChanged(sender: HTMLInputElement) {
    Store.dispatch(UiActions.dialogAddRecordSetContinueMode(sender.checked));
  }

  /// 追加ボタンクリック時処理。
  private onAddButtonClicked() {
    // エラーチェック
    const errorMsgNeedsInput = '入力してください';
    let amountErrorMsg: string | null = null;
    let accountFromErrorMsg: string | null = null;
    let accountToErrorMsg: string | null = null;
    if (this.state.formAmount == null) {
      amountErrorMsg = errorMsgNeedsInput;
    }
    if (this.state.formKind === DocTypes.RecordKind.Transfer) {
      if (this.state.formAccountFrom === DocTypes.INVALID_ID) {
        accountFromErrorMsg = errorMsgNeedsInput;
      }
      if (this.state.formAccountTo === DocTypes.INVALID_ID) {
        accountToErrorMsg = errorMsgNeedsInput;
      }
    }
    this.setState({
      amountErrorMsg,
      accountFromErrorMsg,
      accountToErrorMsg,
    });
    if (amountErrorMsg != null || accountFromErrorMsg != null || accountToErrorMsg != null) {
      return;
    }

    // 追加イベントを実行
    switch (this.state.formKind) {
      case DocTypes.RecordKind.Outgo:
        Store.dispatch(DocActions.addRecordOutgo(
          new Date(),
          YearMonthDayDate.fromText(this.state.formDate),
          this.state.formMemo,
          this.state.formAccount,
          this.state.formCategoryOutgo,
          this.state.formAmount != null ? this.state.formAmount : 0,
          ));
        break;

      case DocTypes.RecordKind.Income:
        Store.dispatch(DocActions.addRecordIncome(
          new Date(),
          YearMonthDayDate.fromText(this.state.formDate),
          this.state.formMemo,
          this.state.formAccount,
          this.state.formCategoryIncome,
          this.state.formAmount != null ? this.state.formAmount : 0,
          ));
        break;

      case DocTypes.RecordKind.Transfer:
        Store.dispatch(DocActions.addRecordTransfer(
          new Date(),
          YearMonthDayDate.fromText(this.state.formDate),
          this.state.formMemo,
          this.state.formAccountFrom,
          this.state.formAccountTo,
          this.state.formAmount != null ? this.state.formAmount : 0,
          ));
        break;
    }

    // 続けて入力モード用の処理
    if (this.props.dialogRecordAdd.isContinueMode) {
      this.setState({
        formAmount: null,
        formMemo: '',
      });
      return;
    }

    // ダイアログを閉じる
    // MDB が TypeScript 非対応なので文字列で実行
    new Function(`$('#${this.elementIdRoot}').modal('hide')`)();
  }

  /// キーダウンイベント処理。
  private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    // Command + Enter で追加ボタンを押下
    if (event.keyCode === 13 && event.metaKey) {
      this.onAddButtonClicked();
      return;
    }
  }

}

const mapStateToProps = (state: IStoreState, props: IProps) => {
  const result: ILocalProps = Object.assign(
    props,
    {
      accounts: Object.values(state.doc.accounts),
      incomeCategories: state.doc.income.categories,
      outgoCategories: state.doc.outgo.categories,
      dialogRecordAdd: state.ui.dialogAddRecord,
    },
  );
  return result;
};
export default ReactRedux.connect(mapStateToProps)(DialogRecordAdd);
