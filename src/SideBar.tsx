import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import * as Style from './SideBar.css';
import SideBarBtn from './SideBarBtn';

interface IProps {
  currentPageId: string;
  onBtnClicked: ((pageId: string) => void);
}

class SideBar extends React.Component<IProps, any> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    const rootClass = ClassNames(
      Style.Root,
      LayoutStyle.TopToBottom,
    );

    const btnInfos = [];
    btnInfos.push({pageId: 'Home', title: 'ホーム', iconName: 'home'});
    btnInfos.push({pageId: 'Sheet', title: '一覧', iconName: 'view_week'});
    btnInfos.push({pageId: 'Find', title: 'レコードの検索', iconName: 'search'});
    btnInfos.push({pageId: 'Account', title: '口座管理', iconName: 'account_balance'});

    const btns = [];
    for (const btnInfo of btnInfos) {
      btns.push(<SideBarBtn
        key={btnInfo.pageId}
        onClicked={() => {this.onClicked(btnInfo.pageId); }}
        isActive={this.props.currentPageId === btnInfo.pageId}
        title={btnInfo.title}
        iconName={btnInfo.iconName}
        />);
    }

    return (
      <div className={rootClass}>
        {btns}
      </div>
    );
  }

  private onClicked(pageId: string) {
    this.props.onBtnClicked(pageId);
  }
}

export default SideBar;
