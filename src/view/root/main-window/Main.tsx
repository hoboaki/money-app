import ClassNames from 'classnames';
import {ipcRenderer as IpcRenderer, remote} from 'electron';
import * as Fs from 'fs';
import * as React from 'react';
import Split from 'split.js';

import * as DocActions from 'src/state/doc/Actions';
import * as DocStates from 'src/state/doc/States';
import SampleDoc from 'src/state/SampleDoc';
import Store from 'src/state/Store';
import * as UiActions from 'src/state/ui/Actions';
import * as MmxfImporter from 'src/util/doc/MmxfImporter';
import LayoutStyle from 'src/view/Layout.css';
import PageCalendar from 'src/view/page/calendar';
import PageStyles from 'src/view/page/Page.css';
import PageSetting from 'src/view/page/setting';
import PageSheet from 'src/view/page/sheet';
import PageStart from 'src/view/page/start';
import * as Styles from './Main.css';
import SideBar from './SideBar';
import TitleBar from './TitleBar';

interface IState {
  currentPageId: string;
  isActive: boolean;
}

enum Color {
  Red = 0,
}
class MainWindow extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentPageId: '',
      isActive: true,
    };
  }

  public componentDidMount() {
    // テスト実行
    SampleDoc.Test();

    // Focus/Unfocus 切替
    window.onload = () => {
      IpcRenderer.on('app-message', (event: any, msg: string) => {
        switch (msg) {
          case 'focus':
            this.setState({isActive: true});
            break;

          case 'blur':
            this.setState({isActive: false});
            break;
        }
      });
    };

    // ページ有効化
    this.activatePage(PageStart.PageId);
  }

  public render() {
    let pageContent = <div className={PageStyles.Base}/>;
    switch (this.state.currentPageId) {
      case PageStart.PageId:
        pageContent = <PageStart
          onNewFromMmxfSelected={(filePath) => {this.pageStartOnNewFromMmxfSelected(filePath); }}
          onNewExampleSelected={() => {this.pageStartOnNewExampleSelected(); }}
          />;
        break;
      case PageCalendar.PageId:
        pageContent = <PageCalendar />;
        break;
      case PageSheet.PageId:
        pageContent = <PageSheet />;
        break;
        case PageSetting.PageId:
          pageContent = <PageSetting />;
          break;
    }

    const rootClass = ClassNames(
      Styles.Root,
      LayoutStyle.TopToBottom,
    );
    return (
      <div className={rootClass}>
        <TitleBar isActive={this.state.isActive}/>
        <div className={LayoutStyle.LeftToRight}>
          <SideBar
            onBtnClicked={(pageId) => {this.onPageBtnClicked(pageId); }}
            currentPageId={this.state.currentPageId}
            />
          {pageContent}
        </div>
      </div>
    );
  }

  private pageStartOnNewFromMmxfSelected(filePath: string) {
    // ファイルを開く
    let resetDoc: DocStates.IState | null = null;
    const mmxfFilePath = filePath;
    try {
      Fs.accessSync(mmxfFilePath, Fs.constants.R_OK);
    } catch (err) {
      global.console.log(`Can\'t access document '${mmxfFilePath}'.`);
      global.console.log(err.message);
      this.showErrorDialog('指定のファイルにアクセスできませんでした。ファイルが存在していることと，ファイルを読み取る権限があることを確認してください。');
      return;
    }
    {
      const result = MmxfImporter.importFile(mmxfFilePath);
      if (result.doc === null) {
        this.showErrorDialog('ファイルのインポート処理中にエラーが発生しました。ファイルが壊れているか，未対応のデータフォーマットの可能性があります。');
        return;
      }
      resetDoc = result.doc;
    }

    // 自動保存先を選択
    const autoSaveFilePath = this.selectAutoSaveFilePath();
    if (autoSaveFilePath === null) {
      return;
    }

    // スタート
    this.startEditDocument(resetDoc, autoSaveFilePath, true);
  }

  private pageStartOnNewExampleSelected() {
    // 自動保存先を選択
    const autoSaveFilePath = this.selectAutoSaveFilePath();
    global.console.log(autoSaveFilePath);
    if (autoSaveFilePath === null) {
      return;
    }

    // サンプルドキュメントでスタート
    this.startEditDocument(SampleDoc.Create(), autoSaveFilePath, true);
  }

  // 自動保存先をユーザーに尋ねる。キャンセルされたら null が返る。
  private selectAutoSaveFilePath(): string | null {
    // 事前説明ダイアログ
    const dialog = remote.dialog;
    dialog.showMessageBox(
      remote.getCurrentWindow(),
      {
        type: 'info',
        buttons: ['OK'],
        defaultId: 0,
        title: '自動保存設定',
        message: 'このあとに表示されるダイアログでファイルの保存先を決定してください。（本アプリケーションはファイルを自動保存します。）',
      });

    // 保存先選択
    const result = dialog.showSaveDialog(
      remote.getCurrentWindow(),
      {
        filters: [
          {
            name: 'AdelMoney ドキュメント',
            extensions: ['amdoc'],
          },
        ],
      },
      (filePaths) => {
        if (filePaths === undefined || filePaths.length === 0) {
          return;
        }
        this.props.onNewFromMmxfSelected(filePaths[0]);
      },
    );
    return '';
  }

  // ドキュメント編集の開始処理
  private startEditDocument(doc: DocStates.IState, filePath: string, isNeedToSave: boolean) {
    // 保存
    if (isNeedToSave) {
      // ...
    }

    // リセット処理
    Store.dispatch(DocActions.resetDocument(doc));
    Store.dispatch(UiActions.documentSetFilePath(filePath));

    // Page変更
    this.activatePage(PageCalendar.PageId);
  }

  private showErrorDialog(msg: string) {
    const dialog = remote.dialog;
    dialog.showMessageBox(
      remote.getCurrentWindow(),
      {
        type: 'error',
        buttons: ['OK'],
        defaultId: 0,
        title: 'スタートページ',
        message: msg,
      });
  }

  private onPageBtnClicked(pageId: string) {
    // 変更がなければ何もしない
    if (this.state.currentPageId === pageId) {
      return;
    }

    // ページの有効化
    this.activatePage(pageId);
  }

  private activatePage(pageId: string) {
    this.setState({currentPageId: pageId});
  }
}

export default MainWindow;
