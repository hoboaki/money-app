import ClassNames from 'classnames';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/l10n/ja.js';
import * as Lodash from 'lodash';
import * as React from 'react';
import * as Style from './DialogRecordAdd.css';

interface IProps {
  onClosed: (() => void);
}
interface IState {
  elementId: string;
}

class DialogRecordAdd extends React.Component<IProps, IState> {
  private elementIdRoot: string;
  private elementIdFormDate: string;

  constructor(props: IProps) {
    super(props);
    this.state = {
      elementId: Lodash.uniqueId('FormDate'),
    };
    this.elementIdRoot = Lodash.uniqueId('Root');
    this.elementIdFormDate = this.state.elementId;
  }

  public componentDidMount() {
    global.console.log('DialogRecordAdd.componentDidMount');
    flatpickr(`#${this.elementIdFormDate}`, {locale: 'ja'});
    new Function(`$('#${this.elementIdRoot}').modal('show')`)();
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
                        <input type="text" value="家事費 > 食費"/>
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
