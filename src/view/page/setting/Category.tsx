import ClassNames from 'classnames';
import { Menu, remote } from 'electron';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import Sortable from 'sortablejs';
// import * as DocActions from 'src/state/doc/Actions';
// import * as DocStateMethods from 'src/state/doc/StateMethods';
import * as DocStates from 'src/state/doc/States';
import * as DocTypes from 'src/state/doc/Types';
import IStoreState from 'src/state/IStoreState';
// import Store from 'src/state/Store';
// import * as UiActions from 'src/state/ui/Actions';
import * as BasicStyles from 'src/view/Basic.css';
import * as LayoutStyles from 'src/view/Layout.css';
import * as PageStyles from 'src/view/page/Page.css';
import MaterialIcon from 'src/view/widget/material-icon';
// import * as NativeDialogUtils from 'src/view/widget/native-dialog-utils';
import RadioButtonGroup from 'src/view/widget/radio-button-group';
import { v4 as UUID } from 'uuid';

import * as Styles from './Category.css';
import Header from './Header';

interface IProps {
  doc: DocStates.IState;
}

interface IState {
  /** 選択中のタブ。 */
  selectedTab: DocTypes.CategoryKind;

  /** カテゴリ編集対象。 */
  editCategoryId: number | null;

  /** カードのコンテキストメニュー表示中か。 */
  cardActionMenuActive: boolean;

  /** 編集ダイアログをモーダル中か。 */
  modalCategoryEdit: boolean;
}

class Category extends React.Component<IProps, IState> {
  private cardActionMenu: Menu;
  private elemIdCategoryList: string;
  private sortedGroup: string;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      selectedTab: DocTypes.CategoryKind.Income,
      editCategoryId: null,
      modalCategoryEdit: false,
      cardActionMenuActive: false,
    };
    this.elemIdCategoryList = `elem-${UUID}`;
    this.sortedGroup = `sorted-group-${UUID}`;

    // カードアクションMenu
    this.cardActionMenu = new remote.Menu();
    this.cardActionMenu.append(
      new remote.MenuItem({
        label: '編集...',
        click: () => {
          this.setState({ modalCategoryEdit: true });
        },
      }),
    );
    this.cardActionMenu.append(
      new remote.MenuItem({
        label: '削除...',
        click: () => {
          this.categoryDelete();
        },
      }),
    );
  }

  public componentDidMount() {
    this.setupSortable();
  }

  public componentDidUpdate() {
    this.setupSortable();
  }

  public render() {
    const rootClass = ClassNames(PageStyles.Base, LayoutStyles.TopToBottom);
    const header = <Header title={'カテゴリ設定'} iconName="class" />;

    const btnInfos = [
      { label: '収入', onChanged: () => this.onTabChanged(DocTypes.CategoryKind.Income) },
      { label: '支出', onChanged: () => this.onTabChanged(DocTypes.CategoryKind.Outgo) },
    ];
    const controlBar = (
      <div className={Styles.ControlBar}>
        <div className={Styles.ControlBarAreaLeft}>
          <RadioButtonGroup btns={btnInfos} selectedBtnIndex={this.state.selectedTab - 1} />
        </div>
        <div className={Styles.ControlBarAreaRight}></div>
      </div>
    );

    const rootCard = (() => {
      const categories =
        this.state.selectedTab === DocTypes.CategoryKind.Income
          ? this.props.doc.income.categories
          : this.props.doc.outgo.categories;

      // let recordExistsLeafCategories: number[] = [];
      // if (this.state.selectedTab === DocTypes.CategoryKind.Income) {
      //   const categoryIds = Object.values(this.props.doc.income.records).map((record) => record.category);
      //   recordExistsLeafCategories = categoryIds.filter((id, idx) => categoryIds.indexOf(id) === idx);
      // }

      const categoryConverter = (categoryId: number, indentLevel: number) => {
        // 自身
        const self = categories[categoryId];
        const selfName =
          indentLevel === 0 ? (this.state.selectedTab === DocTypes.CategoryKind.Income ? '収入' : '支出') : self.name;
        const reorder =
          indentLevel === 0 ? null : (
            <MaterialIcon name="reorder" classNames={[Styles.CategoryCardHeaderHandle]} darkMode={false} />
          );

        // 子
        const childElems = self.childs.map((id) => categoryConverter(id, indentLevel + 1));
        const childs =
          childElems.length === 0 ? null : (
            <div id={`${this.elemIdCategoryList}-${categoryId}`} className={Styles.CategoryList}>
              {childElems}
            </div>
          );
        return (
          <div
            key={`${this.state.selectedTab}-${categoryId}`}
            className={Styles.CategoryCard}
            data-selected={this.state.cardActionMenuActive && this.state.editCategoryId === categoryId}
          >
            <div className={Styles.CategoryCardHeader}>
              {reorder}
              <span>{selfName}</span>
              <div className={Styles.CategoryCardHeaderTailSpace}>
                <button className={BasicStyles.IconBtn} onClick={(e) => this.onCardActionBtnClicked(e, categoryId)}>
                  <MaterialIcon name="more_horiz" classNames={[]} darkMode={false} />
                </button>
              </div>
            </div>
            {childs}
          </div>
        );
      };

      return categoryConverter(
        this.state.selectedTab == DocTypes.CategoryKind.Income
          ? this.props.doc.income.rootCategoryId
          : this.props.doc.outgo.rootCategoryId,
        0,
      );
    })();
    const categoryList = (
      <div id={this.elemIdCategoryList} className={Styles.CategoryList}>
        {rootCard}
      </div>
    );

    const modalDialog = ((): JSX.Element | null => {
      if (!this.state.modalCategoryEdit) {
        return null;
      }
      return null;
    })();

    const body = (
      <div className={Styles.BodyRoot}>
        <div className={Styles.Body}>
          {controlBar}
          {categoryList}
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

  private setupSortable() {
    const categories =
      this.state.selectedTab === DocTypes.CategoryKind.Income
        ? this.props.doc.income.categories
        : this.props.doc.outgo.categories;
    Object.keys(categories)
      .map((keyText) => Number(keyText))
      .forEach((id) => {
        const category = categories[id];
        if (category.childs.length === 0) {
          return;
        }
        const elem = document.getElementById(`${this.elemIdCategoryList}-${id}`);
        if (elem === null) {
          throw new Error();
        }
        Sortable.create(elem, {
          animation: 150,
          fallbackOnBody: true,
          ghostClass: Styles.CategoryCardGhost,
          group: this.sortedGroup,
          handle: `.${Styles.CategoryCardHeaderHandle}`,
          onEnd: (evt) => {
            // 値チェック
            if (evt.newIndex === undefined || evt.oldIndex === undefined) {
              throw new Error();
            }

            // // 順番変更を反映
            // const oldIndex = evt.oldIndex;
            // const newIndex = evt.newIndex;
            // Store.dispatch(DocActions.updateCategoryOrder(this.state.selectedTab, oldIndex, newIndex));

            // // 自動保存リクエスト
            // Store.dispatch(UiActions.documentRequestAutoSave());
          },
        });
      });
  }

  private onTabChanged(kind: DocTypes.CategoryKind) {
    this.setState({
      selectedTab: kind,
    });
  }

  private onCardActionBtnClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number): void {
    e.stopPropagation();
    this.setState({ cardActionMenuActive: true, editCategoryId: id });
    this.cardActionMenu.popup({
      callback: () => {
        this.setState({ cardActionMenuActive: false });
      },
    });
  }

  private categoryDelete() {
    // 値チェック
    if (this.state.editCategoryId === null) {
      throw new Error();
    }
    return;
    // // 確認
    // if (
    //   !NativeDialogUtils.showOkCancelDialog(
    //     '口座の削除',
    //     `口座“${DocStateMethods.categoryById(this.props.doc, this.state.editCategoryId).name}"を削除しますか？`,
    //     this.state.selectedTab !== DocTypes.CategoryKind.Aggregate ? '口座に紐付くレコードは削除されます。' : undefined,
    //     '口座を削除',
    //   )
    // ) {
    //   return;
    // }

    // // 削除を実行
    // Store.dispatch(DocActions.deleteCategory(this.state.editCategoryId));
    // Store.dispatch(UiActions.recordEditDialogUpdateLatestValue(null, null, null)); // 前回入力値情報をリセット

    // // 自動保存
    // Store.dispatch(UiActions.documentRequestAutoSave());
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    doc: state.doc,
  };
};
export default ReactRedux.connect(mapStateToProps)(Category);
