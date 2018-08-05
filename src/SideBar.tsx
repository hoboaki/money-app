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
        <SideBarBtn onClicked={() => {this.print('Sheet');}} title="ホーム" iconName="home" />
        <SideBarBtn onClicked={() => {this.print('Find');}} title="レコードの検索" iconName="search" />
        <SideBarBtn onClicked={() => {this.print('Account');}} title="口座管理" iconName="account_balance" />
      </div>
    );
  }

  print(text: string) {
    global.console.log(text);
  }
}

export default SideBar;
