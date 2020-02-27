import ClassNames from 'classnames';
import * as React from 'react';
import Store from 'src/state/Store';
import * as UiActions from 'src/state/ui/Actions';
import * as PageStyles from 'src/view/page/Page.css';

import * as Styles from './Main.css';
import SettingBtn from './SettingBtn';

class Main extends React.Component {
  public static PageId = 'Setting';
  private static SubPageIdAccount = 'Account';
  private static SubPageIdCategory = 'Category';

  public render() {
    const rootClass = ClassNames(PageStyles.Base, Styles.Root);

    const btnInfos = [];
    btnInfos.push({ subPageId: Main.SubPageIdAccount, title: '口座管理', iconName: 'payment', disabled: false });
    btnInfos.push({
      subPageId: Main.SubPageIdCategory,
      title: 'カテゴリ管理（準備中）',
      iconName: 'class',
      disabled: true,
    });

    const btns: JSX.Element[] = [];
    btnInfos.forEach((btnInfo) => {
      btns.push(
        <SettingBtn
          key={btnInfo.subPageId}
          onClicked={() => {
            this.onClicked(btnInfo.subPageId);
          }}
          title={btnInfo.title}
          iconName={btnInfo.iconName}
          disabled={btnInfo.disabled}
        />,
      );
    });

    return (
      <div className={rootClass}>
        <div className={Styles.GridHolder}>{btns}</div>
      </div>
    );
  }

  private onClicked(subPageId: string) {
    Store.dispatch(UiActions.settingUpdateSubPage(subPageId));
  }
}

export default Main;
