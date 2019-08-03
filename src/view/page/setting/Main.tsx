import ClassNames from 'classnames';
import * as React from 'react';

import * as PageStyles from '../Page.css';
import * as Styles from './Main.css';
import SettingBtn from './SettingBtn';

class Main extends React.Component<any, any> {
  public static PageId: string = 'Setting';

  public render() {
    const rootClass = ClassNames(
      PageStyles.Base,
      Styles.Root,
    );

    const btnInfos = [];
    btnInfos.push({settingId: 'Account', title: '口座管理', iconName: 'account_balance'});
    btnInfos.push({settingId: 'Category', title: 'カテゴリ管理', iconName: 'class'});

    const btns: JSX.Element[] = [];
    btnInfos.forEach((btnInfo) => {
      btns.push(<SettingBtn
        key={btnInfo.settingId}
        onClicked={() => {this.onClicked(btnInfo.settingId); }}
        title={btnInfo.title}
        iconName={btnInfo.iconName}
        />);
    });

    return (
      <div className={rootClass}>
        {btns}
      </div>
    );
  }

  private onClicked(settingId: string) {
    // ...
  }
}

export default Main;
