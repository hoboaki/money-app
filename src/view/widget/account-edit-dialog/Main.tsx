import 'src/@types/mdb/modal';

import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
// import * as DocActions from 'src/state/doc/Actions';
// import * as DocStateMethods from 'src/state/doc/StateMethods';
import * as DocStates from 'src/state/doc/States';
import * as DocTypes from 'src/state/doc/Types';
import IStoreState from 'src/state/IStoreState';
// import Store from 'src/state/Store';
import IYearMonthDayDate from 'src/util/IYearMonthDayDate';
import * as IYearMonthDayDateUtils from 'src/util/IYearMonthDayDateUtils';
// import * as PriceUtils from 'src/util/PriceUtils';
import * as BasicStyles from 'src/view/Basic.css';
import { v4 as UUID } from 'uuid';

import * as Styles from './Main.css';

interface IProps {
  /** 追加・編集する口座グループ。 */
  accountGroup: DocTypes.AccountGroup;

  /** 編集する場合は口座のIDを指定。 */
  editAccountId: number | null;

  /** 閉じる際のコールバック。 */
  onClosed: (isCanceled: boolean) => void;
}

interface ILocalProps extends IProps {
  doc: DocStates.IState;
}

interface IState {
  name: string;
  kind: DocTypes.AccountKind;
  /** 初期金額。プラスが貯蓄。マイナスが負債。 */
  initialAmount: number;
  /** 口座開設日。initialAmount が加算される日。 */
  startDate: IYearMonthDayDate;
  isCanceled: boolean;
}

class Main extends React.Component<ILocalProps, IState> {
  private elementIdRoot: string;
  private elementIdCloseBtn: string;
  private elementIdSubmitBtn: string;

  constructor(props: ILocalProps) {
    super(props);
    if (props.editAccountId !== null) {
      const account = props.doc.account.accounts[props.editAccountId];
      this.state = {
        name: account.name,
        kind: account.kind,
        initialAmount: account.initialAmount,
        startDate: account.startDate,
        isCanceled: true,
      };
    } else {
      this.state = {
        name: '',
        kind:
          props.accountGroup === DocTypes.AccountGroup.Assets
            ? DocTypes.AccountKind.AssetsCash
            : DocTypes.AccountKind.LiabilitiesCard,
        initialAmount: 0,
        startDate: IYearMonthDayDateUtils.today(),
        isCanceled: true,
      };
    }
    this.elementIdRoot = `elem-${UUID()}`;
    this.elementIdCloseBtn = `elem-${UUID()}`;
    this.elementIdSubmitBtn = `elem-${UUID()}`;
  }

  public componentDidMount() {
    // ダイアログ表示
    $(`#${this.elementIdRoot}`).modal({ show: true, backdrop: false });

    // ダイアログ閉じたらコールバック
    $(`#${this.elementIdRoot}`).on('hidden.bs.modal', () => {
      this.props.onClosed(this.state.isCanceled);
    });
  }

  public render() {
    // ヘッダ
    const dialogHeaderClass = ClassNames('modal-header', Styles.DialogHeader);
    const header = (
      <div className={dialogHeaderClass}>
        <h5 className="modal-title" id="exampleModalLabel">
          {`${this.props.accountGroup === DocTypes.AccountGroup.Assets ? '資産口座' : '負債口座'}の${
            this.props.editAccountId !== null ? '編集' : '追加'
          }`}
        </h5>
        <button type="button" id={this.elementIdCloseBtn} className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );

    // 本体
    const body = <div></div>;

    // フッタ
    const submitBtnClass = ClassNames(BasicStyles.StdBtnSecondary);
    const footer = (
      <div className={Styles.FooterRoot}>
        <button
          id={this.elementIdSubmitBtn}
          className={submitBtnClass}
          disabled={this.state.name === ''}
          onClick={(e) => this.onSubmitBtnClicked(e)}
        >
          {this.props.editAccountId !== null ? '更新' : '追加'}
        </button>
      </div>
    );

    // 全体
    const rootClass = ClassNames('modal', 'fade', BasicStyles.DialogBackdrop);
    const dialogRootClass = ClassNames('modal-dialog', 'modal-dialog-centered', Styles.DialogRoot);
    const dialogContentClass = ClassNames('modal-content', Styles.DialogContent);
    return (
      <div
        id={this.elementIdRoot}
        className={rootClass}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-keyboard="false"
        onKeyDown={(e) => {
          this.onRootKeyDown(e);
        }}
      >
        <div className={dialogRootClass} role="document">
          <div className={dialogContentClass}>
            {header}
            {body}
            {footer}
          </div>
        </div>
      </div>
    );
  }

  /// ダイアログ全体のホットキー対応。
  private onRootKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // ESC でダイアログを閉じる。
    if (e.keyCode === 27) {
      e.stopPropagation();
      $(`#${this.elementIdRoot}`).modal('hide');
      return;
    }
    // Command + Enter で追加ボタンを押下
    if (e.keyCode === 13 && e.metaKey) {
      e.stopPropagation();
      $(`#${this.elementIdSubmitBtn}`).click();
      return;
    }
  }

  /// 取込ボタンが押されたときの処理。
  private onSubmitBtnClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    e.stopPropagation();

    // ダイアログ閉じる
    this.setState({ isCanceled: false });
    $(`#${this.elementIdRoot}`).modal('hide');
  }
}

const mapStateToProps = (state: IStoreState, props: IProps) => {
  const result: ILocalProps = Object.assign({}, props, {
    doc: state.doc,
  });
  return result;
};
export default ReactRedux.connect(mapStateToProps)(Main);
