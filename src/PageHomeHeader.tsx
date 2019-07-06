import ClassNames from 'classnames';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/l10n/ja.js';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import * as Style from './PageHomeHeader.css';

class PageHomeHeader extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Style.Root,
    );
    const currentDateClass = ClassNames(
      Style.CurrentDate,
    );
    const movePrevBtnClass = ClassNames(
      Style.Btn,
      Style.FrameBtn,
      Style.MoveBtn,
      Style.MovePrevBtn,
    );
    const moveTodayBtnClass = ClassNames(
      Style.Btn,
      Style.FrameBtn,
      Style.MoveBtn,
    );
    const moveNextBtnClass = ClassNames(
      Style.Btn,
      Style.FrameBtn,
      Style.MoveBtn,
      Style.MoveNextBtn,
    );
    const jumpBtnClass = ClassNames(
      Style.Btn,
      Style.FrameBtn,
      Style.JumpBtn,
    );
    const filterBtnClass = ClassNames(
      Style.Btn,
      Style.NoFrameBtn,
      Style.FilterBtn,
    );
    const rightAreaClass = ClassNames(
      LayoutStyle.RightToLeft,
      Style.RightArea,
    );
    const newRecordBtnClass = ClassNames(
      Style.Btn,
      Style.NoFrameBtn,
      Style.NewRecordBtn,
    );
    const iconClass = ClassNames(
      'material-icons',
      'md-16',
      'md-dark',
    );

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
    return (
      <div className={rootClass}>
        <span className={currentDateClass}>2019年6月</span>
        <button className={movePrevBtnClass} onClick={this.onMovePrevBtnPushed}>
          <i className={iconClass}>chevron_left</i>
        </button>
        <button className={moveTodayBtnClass} onClick={this.onMoveTodayBtnPushed}>今月</button>
        <button className={moveNextBtnClass} onClick={this.onMoveNextBtnPushed}>
          <i className={iconClass}>chevron_right</i>
        </button>
        <button className={jumpBtnClass} onClick={this.onJumpBtnPushed}>移動</button>
        <select className={Style.ViewUnitSelect} defaultValue="month" onChange={this.onViewUnitChanged}>
          <option value="month">月表示</option>
          <option value="year">年表示</option>
        </select>
        <button className={filterBtnClass} onClick={this.onFilterBtnPushed}>
          <i className={iconClass}>filter_list</i>
        </button>
        <div className={rightAreaClass}>
          <button className={newRecordBtnClass} onClick={this.onNewRecordBtnPushed}
            data-toggle="modal" data-target="#basicExampleModal"
            >
            <i className={iconClass}>note_add</i>
          </button>
          <div style={{width: '100%'}}/>
        </div>
        <div className="modal fade" id="basicExampleModal" tabIndex={-1}
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
                    <tr>
                      <th scope="row">日付</th>
                      <td>
                        <input type="text" id="formDate" value="2019-07-07"/>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">カテゴリ</th>
                      <td>
                        <input type="text" value="家事費 > 食費"/>
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
                        <input type="text" value="お弁当代"/>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private onViewUnitChanged() {
    global.console.log('onViewUnitChanged');
  }

  private onMovePrevBtnPushed() {
    global.console.log('onMovePrevBtnPushed');
  }

  private onMoveTodayBtnPushed() {
    global.console.log('onMoveTodayBtnPushed');
  }

  private onMoveNextBtnPushed() {
    global.console.log('onMoveNextBtnPushed');
  }

  private onJumpBtnPushed() {
    global.console.log('onJumpBtnPushed');
  }

  private onFilterBtnPushed() {
    global.console.log('onFilterBtnPushed');
  }

  private onNewRecordBtnPushed() {
    global.console.log('onNewRecordBtnPushed');
    flatpickr('#formDate', {locale: 'ja'});
  }
}

export default PageHomeHeader;
