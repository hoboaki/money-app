import ClassNames from 'classnames';
import * as React from 'react';
import PageCalendar from 'src/view/page/calendar';
import PageSetting from 'src/view/page/setting';
import PageSheet from 'src/view/page/sheet';
import PageStart from 'src/view/page/start';

import * as LayoutStyles from '../../Layout.css';
import * as Styles from './SideBar.css';
import SideBarBtn from './SideBarBtn';

interface IProps {
  currentPageId: string;
  onBtnClicked: (pageId: string) => void;
}

class SideBar extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    const rootClass = ClassNames(Styles.Root, LayoutStyles.TopToBottom);

    const btnInfos = [];
    btnInfos.push({ pageId: PageCalendar.PageId, title: 'カレンダー', iconName: 'event_note' });
    btnInfos.push({ pageId: PageSheet.PageId, title: 'ワークシート', iconName: 'view_week' });
    btnInfos.push({ pageId: 'Find', title: 'レコードの検索（準備中）', iconName: 'search' });
    btnInfos.push({ pageId: PageSetting.PageId, title: '設定', iconName: 'settings' });

    const btns = [];
    for (const btnInfo of btnInfos) {
      btns.push(
        <SideBarBtn
          key={btnInfo.pageId}
          onClicked={() => {
            this.onClicked(btnInfo.pageId);
          }}
          isActive={this.props.currentPageId === btnInfo.pageId}
          isEnabled={this.props.currentPageId !== PageStart.PageId}
          title={btnInfo.title}
          iconName={btnInfo.iconName}
        />,
      );
    }

    return <div className={rootClass}>{btns}</div>;
  }

  private onClicked(pageId: string) {
    this.props.onBtnClicked(pageId);
  }
}

export default SideBar;
