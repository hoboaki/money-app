import ClassNames from 'classnames';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/l10n/ja.js';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import { v4 as UUID } from 'uuid';
import * as DocActions from '../state/doc/Actions';
import * as DocStateMethods from '../state/doc/StateMethods';
import * as DocStates from '../state/doc/States';
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
  formDate: string;
  formCategory: number;
  formAccount: number;
  formAmount: number | null;
  formMemo: string;
  isAmountEmptyError: boolean;
}

class DialogRecordAdd extends React.Component<ILocalProps, IState> {
  private elementIdRoot: string;
  private elementIdFormCategory: string;
  private elementIdFormDate: string;
  private elementIdFormAccount: string;
  private elementIdFormAmount: string;
  private elementIdFormMemo: string;
  private elementIdFormIsContinueMode: string;
  private elementIdFormSubmit: string;
  private closeObserver: MutationObserver;

  constructor(props: ILocalProps) {
    super(props);
    this.state = {
      formDate: new YearMonthDayDate().toText(),
      formCategory: DocStateMethods.firstLeafCategory(this.props.outgoCategories).id,
      formAccount: Number(Object.keys(props.accounts)[0]),
      formAmount: null,
      formMemo: '',
      isAmountEmptyError: false,
    };
    this.elementIdRoot = `elem-${UUID()}`;
    this.elementIdFormCategory = `elem-${UUID()}`;
    this.elementIdFormDate = `elem-${UUID()}`;
    this.elementIdFormAccount = `elem-${UUID()}`;
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
    const categoryItems: {[key: string]: any} = {};
    const categoryConvertFunc = (parent: {[key: string]: any}, cat: DocStates.ICategory) => {
      const key = `category-${cat.id}`;
      const name = cat.name;
      const items: {[key: string]: any} = {};
      cat.childs.forEach((child) => {
        categoryConvertFunc(items, this.props.outgoCategories[child]);
      });
      parent[key] = {
        name,
        items: Object.keys(items).length === 0 ? null : items,
      };
    };
    Object.entries(this.props.outgoCategories).forEach(([key, value]) => {
      if (value.parent == null) {
        categoryConvertFunc(categoryItems, this.props.outgoCategories[value.id]);
      }
    });
    $.contextMenu({
      callback: (key, options) => {
        const texts = key.split('-');
        this.setState({
          formCategory: Number(texts[1]),
        });
      },
      className: Style.ContextMenuRoot,
      items: categoryItems,
      selector: `#${this.elementIdFormCategory}`,
      trigger: 'left',
    });

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
      Style.FormTabActive,
    );
    const formTabIncomeClass = ClassNames(
      Style.FormTab,
    );
    const formTabTransferClass = ClassNames(
      Style.FormTab,
      Style.FormTabLast,
    );
    const formSvgIconClass = ClassNames(
      Style.FormSvgIcon,
    );

    const formInputRootClass = ClassNames(
      Style.FormInputRoot,
    );
    const formInputCategoryClass = ClassNames(
      Style.FormInputCategory,
    );

    const formFooterRootClass = ClassNames(
      'modal-footer',
      Style.FormFooterRoot,
    );

    const amountEmptyErrorMsg = !this.state.isAmountEmptyError ? null :
      <span className={Style.FormErrorMsg}>入力してください</span>;

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
                    <img className={formSvgIconClass} src="./image/icon-ex/outgo-outline.svg"/>
                    <span>支出</span>
                  </div>
                  <div className={formTabIncomeClass}>
                    <img className={formSvgIconClass} src="./image/icon-ex/income-outline.svg"/>
                    <span>収入</span>
                  </div>
                  <div className={formTabTransferClass}>
                    <img className={formSvgIconClass} src="./image/icon-ex/transfer-outline.svg"/>
                    <span>振替</span>
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
                    <tr>
                      <th scope="row">カテゴリ</th>
                      <td>
                        <input
                          type="text"
                          id={this.elementIdFormCategory}
                          className={formInputCategoryClass}
                          readOnly={true}
                          value={this.categoryDisplayText()}
                          />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">口座</th>
                      <td>
                        <select defaultValue={this.state.formAccount.toString()}
                          id={this.elementIdFormAccount}
                          onChange={(event) => {this.onFormAccountChanged(event.target); }}
                          >
                          {Object.keys(this.props.accounts).map((key) => {
                            const account = this.props.accounts[Number(key)];
                            return (
                              <option key={key} value={key}>{account.name}</option>
                            );
                          })}
                        </select>
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
  private categoryDisplayText(): string {
    const funcParentPath = (categoryId: number): string => {
      const cat = this.props.outgoCategories[categoryId];
      if (cat.parent == null) {
        return cat.name;
      }
      return `${funcParentPath(cat.parent)} > ${cat.name}`;
    };
    return funcParentPath(this.state.formCategory);
  }

  /// 口座値変更時の処理。
  private onFormAccountChanged(sender: HTMLSelectElement) {
    this.setState({formAccount: Number(sender.value)});
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
    if (this.state.formAmount == null) {
      this.setState({isAmountEmptyError: true});
      return;
    }

    // 追加イベントを実行
    Store.dispatch(DocActions.addRecordOutgo(
      new Date(),
      YearMonthDayDate.fromText(this.state.formDate),
      this.state.formMemo,
      this.state.formAccount,
      this.state.formCategory,
      this.state.formAmount != null ? this.state.formAmount : 0,
      ));
    this.setState({isAmountEmptyError: false});

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
