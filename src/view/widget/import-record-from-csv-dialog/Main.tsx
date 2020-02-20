import 'flatpickr/dist/l10n/ja.js';
import 'src/@types/mdb/modal';

import ClassNames from 'classnames';
import CsvParse from 'csv-parse/lib/sync';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as DocStates from 'src/state/doc/States';
import { INVALID_ID } from 'src/state/doc/Types';
import IStoreState from 'src/state/IStoreState';
import * as PriceUtils from 'src/util/PriceUtils';
import * as BasicStyles from 'src/view/Basic.css';
import { v4 as UUID } from 'uuid';

import * as Styles from './Main.css';

interface IProps {
  /** 処理する csv テキスト。 */
  csvText: string;

  /** 閉じる際のコールバック。 */
  onClosed: () => void;
}

interface ILocalProps extends IProps {
  doc: DocStates.IState;
}

interface CsvRow {
  date: string;
  memo: string;
  income: number | null;
  outgo: number | null;
  category: string;
}

interface IState {
  csvRows: CsvRow[];
  targetAccountId: number;
  isGroupCellSelected: boolean;
}

class Main extends React.Component<ILocalProps, IState> {
  private elementIdRoot: string;
  private elementIdCloseBtn: string;
  private elementIdFormSubmitBtn: string;
  private elementIdGroupPrefix: string;
  private classNameIncomeGroupSelect: string;
  private classNameOutgoGroupSelect: string;

  /** 選択中の GroupCell の html element id。 */
  private selectedGroupCellId: string;

  constructor(props: ILocalProps) {
    super(props);
    this.state = {
      csvRows: [],
      targetAccountId: props.doc.account.order[0],
      isGroupCellSelected: false,
    };
    this.elementIdRoot = `elem-${UUID()}`;
    this.elementIdCloseBtn = `elem-${UUID()}`;
    this.elementIdFormSubmitBtn = `elem-${UUID()}`;
    this.elementIdGroupPrefix = `elem-${UUID()}`;
    this.classNameIncomeGroupSelect = `class-${UUID()}`;
    this.classNameOutgoGroupSelect = `class-${UUID()}`;
    this.selectedGroupCellId = '';
  }

  public componentDidMount() {
    // csv 解析
    const csvRows: CsvRow[] = [];
    this.props.csvText.split('\n').forEach((line) => {
      // 0000/00/00 フォーマットから始まる行を対象データとして扱う
      if (!line.match(/\d{4}\/\d{1,2}\/\d{1,2}/)) {
        return;
      }

      // 行解析
      const cols = CsvParse(line, { columns: false })[0] as string[];
      const incomeText = cols[2].replace(',', '');
      const income = parseInt(incomeText);
      const outgoText = cols[3].replace(',', '');
      const outgo = parseInt(outgoText);
      csvRows.push({
        date: cols[0],
        memo: cols[1],
        income: isNaN(income) ? null : income,
        outgo: isNaN(outgo) ? null : outgo,
        category: cols[4],
      });
    });
    this.setState({
      csvRows,
    });
    global.console.log(csvRows);

    // ContextMenu セットアップ
    const groupSetup = (
      accountLabel: string,
      rootCategory: number,
      categories: { [key: number]: DocStates.ICategory },
      onAccountSelected: (rowIdx: number, accountId: number) => void,
      onCategorySelected: (rowIdx: number, categoryId: number) => void,
      selector: string,
    ) => {
      const prefixAccount = 'account';
      const prefixCategory = 'category';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const groupItems: { [key: string]: any } = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const accountItems: { [key: string]: any } = {};
      this.props.doc.account.order.forEach((accountId) => {
        const key = `account-${accountId}`;
        const name = this.props.doc.account.accounts[accountId].name;
        accountItems[key] = {
          name,
          items: null,
        };
      });
      groupItems[INVALID_ID] = {
        name: accountLabel,
        items: accountItems,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const categoryConvertFunc = (parent: { [key: string]: any }, cat: DocStates.ICategory) => {
        const key = `category-${cat.id}`;
        const name = cat.name;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: { [key: string]: any } = {};
        cat.childs.forEach((child) => {
          categoryConvertFunc(items, categories[child]);
        });
        parent[key] = {
          name,
          items: Object.keys(items).length === 0 ? null : items,
        };
      };
      categories[rootCategory].childs.forEach((id) => {
        categoryConvertFunc(groupItems, categories[id]);
      });

      $.contextMenu({
        callback: (key, options) => {
          const rowIdx = Number(options.$trigger.attr('data-row-idx'));
          const texts = key.split('-');
          const selectedId = Number(texts[1]);
          switch (texts[0]) {
            case prefixAccount:
              onAccountSelected(rowIdx, selectedId);
              break;
            case prefixCategory:
              onCategorySelected(rowIdx, selectedId);
              break;
          }
        },
        determinePosition: (menu) => {
          const parent = $(`#${this.selectedGroupCellId}`);
          const base = parent.offset();
          const height = parent.height();
          if (base !== undefined && height !== undefined) {
            menu.offset({ top: base.top + height + 2, left: base.left - 20 });
          }
        },
        events: {
          hide: (opts) => {
            this.setState({
              isGroupCellSelected: false,
            });
            return true;
          },
        },
        className: Styles.ContextMenuRoot,
        items: groupItems,
        selector,
        trigger: 'none',
      });
    };
    groupSetup(
      '送金元口座',
      this.props.doc.income.rootCategoryId,
      this.props.doc.income.categories,
      (rowIdx, accountId) => {
        /* */
      },
      (rowIdx, categoryId) => {
        /* */
      },
      `.${this.classNameIncomeGroupSelect}`,
    );
    groupSetup(
      '送金先口座',
      this.props.doc.outgo.rootCategoryId,
      this.props.doc.outgo.categories,
      (rowIdx, accountId) => {
        /* */
      },
      (rowIdx, categoryId) => {
        /* */
      },
      `.${this.classNameOutgoGroupSelect}`,
    );

    // ダイアログ表示
    $(`#${this.elementIdRoot}`).modal({ show: true, backdrop: false });

    // ダイアログ閉じたらコールバック
    $(`#${this.elementIdRoot}`).on('hidden.bs.modal', () => {
      this.props.onClosed();
    });
  }

  public render() {
    // ヘッダ
    const dialogHeaderClass = ClassNames('modal-header', Styles.DialogHeader);
    const header = (
      <div className={dialogHeaderClass}>
        <h5 className="modal-title" id="exampleModalLabel">
          レコードの取込
        </h5>
        <button type="button" id={this.elementIdCloseBtn} className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );

    // 取込先口座
    const targetAccountSelectClass = ClassNames(BasicStyles.StdSelect);
    const targetAccountOptions = this.props.doc.account.order.map((id) => {
      const account = this.props.doc.account.accounts[id];
      return (
        <option key={account.id} value={account.id}>
          {account.name}
        </option>
      );
    });
    const targetAccount = (
      <div className={Styles.TargetAccountRoot}>
        <span>取込先口座:</span>
        <select
          className={targetAccountSelectClass}
          defaultValue=""
          onChange={(e) => {
            this.onTargetAccountChanged(e);
          }}
        >
          {targetAccountOptions}
        </select>
      </div>
    );

    // テーブル
    const tableHeader = (
      <table className={Styles.TableHeader}>
        <tbody>
          <tr>
            <td data-header={true} data-col-category={'date'}>
              日付
            </td>
            <td data-header={true} data-col-category={'memo'}>
              メモ
            </td>
            <td data-header={true} data-col-category={'income'}>
              入金
            </td>
            <td data-header={true} data-col-category={'outgo'}>
              出金
            </td>
            <td data-header={true} data-col-category={'palm-category'}>
              Palmカテゴリ
            </td>
            <td data-header={true} data-col-category={'group'}>
              分類
            </td>
            <td data-header={true} data-col-category={'tail-space'}></td>
          </tr>
        </tbody>
      </table>
    );
    const tableBodyRows = this.state.csvRows.map((row, idx) => {
      const isIncome = row.income != null && row.outgo == null;
      const isOutgo = row.outgo != null && row.income == null;
      const groupClass = ClassNames(
        isIncome ? this.classNameIncomeGroupSelect : '',
        isOutgo ? this.classNameOutgoGroupSelect : '',
      );
      const groupCellId = `${this.elementIdGroupPrefix}${idx}`;
      const isGroupSelected = this.state.isGroupCellSelected && this.selectedGroupCellId === groupCellId;
      return (
        <tr key={idx}>
          <td data-col-category={'date'}>{row.date}</td>
          <td data-col-category={'memo'}>{row.memo}</td>
          <td data-col-category={'income'}>{row.income != null ? PriceUtils.numToLocaleString(row.income) : ''}</td>
          <td data-col-category={'outgo'}>{row.outgo != null ? PriceUtils.numToLocaleString(row.outgo) : ''}</td>
          <td data-col-category={'palm-category'}>{row.category}</td>
          <td
            id={groupCellId}
            data-col-category={'group'}
            data-row-idx={idx}
            data-selected={isGroupSelected}
            className={groupClass}
            onClick={(e) => {
              this.onGroupCellClicked(e.currentTarget);
            }}
          >
            <span className={Styles.TableGroupLabel}>（未選択）</span>
            <span className={Styles.TableGroupSelectIcon}>▼</span>
          </td>
        </tr>
      );
    });
    const tableBody = (
      <div className={Styles.TableBody}>
        <table>
          <tbody>{tableBodyRows}</tbody>
        </table>
      </div>
    );
    const tableRoot = (
      <div className={Styles.TableRoot}>
        {tableHeader}
        {tableBody}
      </div>
    );

    // フッタ
    const importBtnClass = ClassNames(BasicStyles.StdBtnSecondary);
    const footer = (
      <div className={Styles.FooterRoot}>
        <button className={importBtnClass}>取込</button>
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
            <div className={Styles.BodyAndFooter}>
              {targetAccount}
              {tableRoot}
              {footer}
            </div>
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
      $(`#${this.elementIdCloseBtn}`).trigger('click');
      return;
    }
  }

  /// 共通キーダウンイベント処理。
  private onKeyDownCommon(event: React.KeyboardEvent<HTMLElement>) {
    // Command + Enter で追加ボタンを押下
    if (event.keyCode === 13 && event.metaKey) {
      $(`#${this.elementIdFormSubmitBtn}`).click();
      event.stopPropagation();
      event.preventDefault();
      return;
    }
  }

  /// 取込先口座変更イベント。
  private onTargetAccountChanged(e: React.ChangeEvent<HTMLSelectElement>) {
    e.stopPropagation();
    this.setState({
      targetAccountId: Number(e.target.value),
    });
  }

  /// 分類がクリックされたときの処理。
  private onGroupCellClicked(sender: EventTarget & HTMLTableDataCellElement) {
    this.selectedGroupCellId = sender.id; // contextMenu() がすぐにアクセスするためこちらは State ではなくメンバ変数
    this.setState({
      isGroupCellSelected: true, // こちらは render() に関わる変数なので State 変数
    });
    $(`#${sender.id}`).contextMenu();
  }
}

const mapStateToProps = (state: IStoreState, props: IProps) => {
  const result: ILocalProps = Object.assign({}, props, {
    doc: state.doc,
  });
  return result;
};
export default ReactRedux.connect(mapStateToProps)(Main);
