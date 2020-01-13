import ClassNames from 'classnames';
import {ipcRenderer as IpcRenderer} from 'electron';
import * as Fs from 'fs';
import * as React from 'react';
import Split from 'split.js';

import * as DocActions from 'src/state/doc/Actions';
import * as DocStates from 'src/state/doc/States';
import SampleDoc from 'src/state/SampleDoc';
import Store from 'src/state/Store';
import * as MmxfImporter from 'src/util/doc/MmxfImporter';
import LayoutStyle from 'src/view/Layout.css';
import PageHome from 'src/view/page/home';
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
      case PageHome.PageId:
        pageContent = <PageHome />;
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
    let resetDoc: DocStates.IState | null = null;
    const localMmxfFilePath = filePath;
    let isExistSampleFile = false;
    try {
      Fs.accessSync(localMmxfFilePath, Fs.constants.R_OK);
      isExistSampleFile = true;
    } catch (err) {
      global.console.log('Can\'t access test document.');
      global.console.log(err.message);
    }
    if (isExistSampleFile) {
      const result = MmxfImporter.importFile(localMmxfFilePath);
      if (result.doc != null) {
        resetDoc = result.doc;
        global.console.log('Document load successed.');
      } else {
        global.console.log('Document load failed.');
        global.console.log(result);
      }
    }
    if (resetDoc === null) {
      return;
    }
    Store.dispatch(DocActions.resetDocument(resetDoc));

    // Page変更
    this.activatePage(PageHome.PageId);
  }

  private pageStartOnNewExampleSelected() {
    // サンプルドキュメントで初期化
    const resetDoc = SampleDoc.Create();
    Store.dispatch(DocActions.resetDocument(resetDoc));

    // Page変更
    this.activatePage(PageHome.PageId);
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
