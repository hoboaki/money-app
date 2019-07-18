import ClassNames from 'classnames';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/l10n/ja.js';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import { v4 as UUID } from 'uuid';
import * as DocStates from '../state/doc/States';
import IStoreState from '../state/IStoreState';
import Store from '../state/Store';
import YearMonthDayDate from '../util/YearMonthDayDate';
import * as Style from './DialogRecordAdd.css';

interface IProps {
  onClosed: (() => void);
  accounts: DocStates.IAccount[];
  incomeCategories: { [key: number]: DocStates.ICategory };
  outgoCategories: { [key: number]: DocStates.ICategory };
}

interface ICategory {
  name: string;
  items: Array<{
    name: string;
  }>;
}

interface ISelectedCategory {
  index: number;
  indexSub: number;
}

interface IState {
  formDate: string;
  formCategory: ISelectedCategory;
  formAccount: number;
  formAmount: number | null;
  formMemo: string;
}

class DialogRecordAdd extends React.Component<IProps, IState> {
  private elementIdRoot: string;
  private elementIdFormCategory: string;
  private elementIdFormDate: string;
  private elementIdFormAccount: string;
  private elementIdFormAmount: string;
  private elementIdFormMemo: string;
  private closeObserver: MutationObserver;
  private demoCategories: ICategory[];

  constructor(props: IProps) {
    super(props);
    this.state = {
      formDate: new YearMonthDayDate().toText(),
      formCategory: {
        index: 0,
        indexSub: 0,
      },
      formAccount: Number(Object.keys(props.accounts)[0]),
      formAmount: null,
      formMemo: '',
    };
    this.elementIdRoot = UUID();
    this.elementIdFormCategory = UUID();
    this.elementIdFormDate = UUID();
    this.elementIdFormAccount = UUID();
    this.elementIdFormAmount = UUID();
    this.elementIdFormMemo = UUID();
    this.closeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'aria-modal' && mutation.oldValue === 'true') {
          this.props.onClosed();
        }
      });
    });
    this.demoCategories = [
      {
        name: '家事費',
        items: [
          {name: '食費'},
          {name: '日用品'},
          {name: '妻小遣い'},
        ],
      },
      {
        name: '光熱・通信費',
        items: [
          {name: '電気'},
          {name: 'プロバイダ・光電話'},
          {name: '水道'},
          {name: 'CATV'},
          {name: 'NHK'},
        ],
      },
      {
        name: '通勤・通学費',
        items: [
          {name: '洗車'},
          {name: 'ガソリン'},
        ],
      },
    ];
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
    this.demoCategories.map((mainValue, mainIndex, mainArray) => {
      const subItems: {[key: string]: any} = {};
      mainValue.items.map((subValue, subIndex, subArray) => {
        subItems[`category-${mainIndex}-${subIndex}`] = {
          name: subValue.name,
        };
      });
      categoryItems[`category-${mainIndex}`] = {
        name: mainValue.name,
        items: subItems,
      };
    });
    $.contextMenu({
      callback: (key, options) => {
        const texts = key.split('-');
        this.setState({
          formCategory: {
            index: parseInt(texts[1], 10),
            indexSub: parseInt(texts[2], 10),
          },
        });
      },
      className: Style.ContextMenuRoot,
      items: categoryItems,
      selector: `#${this.elementIdFormCategory}`,
      trigger: 'left',
    });

    // MDB が TypeScript 非対応なので文字列で実行
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
                        <input type="text" id={this.elementIdFormDate} value={this.state.formDate} readOnly={true}/>
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
                          onChange={(sender) => {this.onFormAccountChanged(sender.target); }}
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
                          onChange={(sender) => {this.onFormAmountChanged(sender.target); }}
                          />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">メモ</th>
                      <td>
                        <input className={Style.FormInputMemo} type="text"
                          id={this.elementIdFormMemo}
                          value={this.state.formMemo}
                          onChange={(sender) => {this.onFormMemoChanged(sender.target); }}
                          />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className={formFooterRootClass}>
              <label>
                <input type="checkbox" id="continueCheckbox"/>続けて入力
              </label>
              <button type="button" className="btn btn-primary"
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
    const parentCategory = this.demoCategories[this.state.formCategory.index];
    const name0 = parentCategory.name;
    const name1 = parentCategory.items[this.state.formCategory.indexSub].name;
    return `${name0} > ${name1}`;
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

  /// 追加ボタンクリック時処理。
  private onAddButtonClicked() {
    // 追加イベントを実行

    // ダイアログを閉じる
    // MDB が TypeScript 非対応なので文字列で実行
    new Function(`$('#${this.elementIdRoot}').modal('hide')`)();
  }
}

const mapStateToProps = (state: IStoreState, props: IProps) => {
  const result = Object.assign(props, {
    accounts: state.doc.accounts,
    incomeCategories: state.doc.income.categories,
    outgoCategories: state.doc.outgo.categories,
  });
  return result;
};
export default ReactRedux.connect(mapStateToProps)(DialogRecordAdd);
