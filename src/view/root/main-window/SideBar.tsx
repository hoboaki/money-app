import ClassNames from 'classnames';
import * as React from 'react';

import * as LayoutStyles from '../../Layout.css';
import * as Styles from './SideBar.css';
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
      Styles.Root,
      LayoutStyles.TopToBottom,
    );

    const btnInfos = [];
    btnInfos.push({pageId: 'Home', title: 'ホーム', iconName: 'home'});
    btnInfos.push({pageId: 'Sheet', title: '一覧', iconName: 'view_week'});
    btnInfos.push({pageId: 'Find', title: 'レコードの検索', iconName: 'search'});
    btnInfos.push({pageId: 'Setting', title: '設定', iconName: 'settings'});

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
