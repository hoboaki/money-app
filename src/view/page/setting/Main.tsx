import ClassNames from 'classnames';
import * as React from 'react';

import * as PageStyles from '../Page.css';
import * as Styles from './Main.css';
import SettingBtn from './SettingBtn';

class Main extends React.Component {
  public static PageId = 'Setting';

  public render() {
    const rootClass = ClassNames(PageStyles.Base, Styles.Root);

    const btnInfos = [];
    btnInfos.push({ settingId: 'Account', title: '口座管理（準備中）', iconName: 'payment' });
    btnInfos.push({ settingId: 'Category', title: 'カテゴリ管理（準備中）', iconName: 'class' });

    const btns: JSX.Element[] = [];
    btnInfos.forEach((btnInfo) => {
      btns.push(
        <SettingBtn
          key={btnInfo.settingId}
          onClicked={() => {
            this.onClicked(btnInfo.settingId);
          }}
          title={btnInfo.title}
          iconName={btnInfo.iconName}
        />,
      );
    });

    return (
      <div className={rootClass}>
        <div className={Styles.GridHolder}>{btns}</div>
      </div>
    );
  }

  private onClicked(settingId: string) {
    // ...
  }
}

export default Main;
