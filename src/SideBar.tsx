import ClassNames from 'classnames';
import * as React from 'react';
import * as StylesLayout from './Layout.css';
import * as Styles from './SideBar.css';
import SideBarBtn from './SideBarBtn';

class SideBar extends React.Component {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    const rootClass = ClassNames(
      Styles.Root,
      StylesLayout.TopToBottom,
    );
    return (
      <div className={rootClass}>
        <SideBarBtn pageId="sheet" title="ホーム" iconName="home" />
        <SideBarBtn pageId="sheet" title="レコードの検索" iconName="search" />
        <SideBarBtn pageId="sheet" title="口座管理" iconName="account_balance" />
      </div>
    );
  }

}

export default SideBar;
