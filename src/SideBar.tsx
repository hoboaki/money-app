import ClassNames from 'classnames';
import * as React from 'react';
import * as StylesLayout from './Layout.css';
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
      StylesLayout.TopToBottom,
    );
    return (
      <div className={rootClass}>
        <SideBarBtn onClicked={() => {this.onClicked('Sheet'); }} isActive={this.props.currentPageId === 'Sheet'}
          title="ホーム" iconName="home" />
        <SideBarBtn onClicked={() => {this.onClicked('Find'); }} isActive={this.props.currentPageId === 'Find'}
          title="レコードの検索" iconName="search" />
        <SideBarBtn onClicked={() => {this.onClicked('Account'); }} isActive={this.props.currentPageId === 'Account'}
          title="口座管理" iconName="account_balance" />
      </div>
    );
  }

  private onClicked(pageId: string) {
    this.props.onBtnClicked(pageId);
  }
}

export default SideBar;
