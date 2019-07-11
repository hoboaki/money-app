import ClassNames from 'classnames';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/l10n/ja.js';
import * as Lodash from 'lodash';
import * as React from 'react';
import * as Style from './DialogRecordAdd.css';

interface IProps {
  onClosed: (() => void);
}

class DialogRecordAdd extends React.Component<IProps, any> {
  private elementIdRoot: string;
  private elementIdFormCategory: string;
  private elementIdFormDate: string;
  private closeObserver: MutationObserver;

  constructor(props: IProps) {
    super(props);
    this.elementIdRoot = Lodash.uniqueId('dialogRecordAddRoot');
    this.elementIdFormCategory = Lodash.uniqueId('dialogRecordAddFormCategory');
    this.elementIdFormDate = Lodash.uniqueId('dialogRecordAddFormDate');
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
    flatpickr(`#${this.elementIdFormDate}`, {locale: 'ja'});

    // ContextMenu セットアップ
    $.contextMenu({
      callback: (key, options) => {
        const m = 'clicked: ' + key;
        global.console.log(m);
      },
      items: {
        edit: {name: 'Edit', icon: 'edit'},
        cut: {name: 'Cut', icon: 'cut'},
        copy: {name: 'Copy', icon: 'copy'},
        paste: {name: 'Paste', icon: 'paste'},
        delete: {name: 'Delete', icon: 'delete'},
        sep1: '---------',
        quit: {
          name: 'Quit',
        },
      },
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
                        <input type="text" id={this.elementIdFormDate} value="2019-07-07"/>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">カテゴリ</th>
                      <td>
                        <input type="text" id={this.elementIdFormCategory} value="家事費 > 食費"/>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">口座</th>
                      <td>
                        <select defaultValue="財布">
                          <option value="財布">財布</option>
                          <option value="アデリー銀行">アデリー銀行</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">金額</th>
                      <td>
                        <input type="text" value="10000"/>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">メモ</th>
                      <td>
                        <input className={Style.FormInputMemo} type="text" value="お弁当代"/>
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
              <button type="button" className="btn btn-primary">追加</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DialogRecordAdd;
