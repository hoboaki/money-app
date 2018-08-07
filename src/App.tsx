import {ipcRenderer as IpcRenderer} from 'electron';
import * as React from 'react';
import * as StylesLayout from './Layout.css';
import PageSheet from './PageSheet';
import PageSheetBody from './PageSheetBody';
import SideBar from './SideBar';
import TitleBar from './TitleBar';

interface IState {
  currentPageId: string;
  isActive: boolean;
}

class App extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentPageId: '',
      isActive: true,
    };
  }

  public componentDidMount() {
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
    this.activatePage(PageSheet.PageId);
  }

  public render() {
    let pageContent = <div/>;
    switch (this.state.currentPageId) {
      case PageSheet.PageId:
        pageContent = <PageSheet />;
        break;
    }

    return (
      <div className={StylesLayout.TopToBottom}>
        <TitleBar isActive={this.state.isActive}/>
        <div className={StylesLayout.LeftToRight}>
          <SideBar
            onBtnClicked={(pageId) => {this.onPageBtnClicked(pageId); }}
            currentPageId={this.state.currentPageId}
            />
          {pageContent}
        </div>
      </div>
    );
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

export default App;
