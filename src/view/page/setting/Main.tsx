import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import IStoreState from 'src/state/IStoreState';
import Store from 'src/state/Store';
import * as UiActions from 'src/state/ui/Actions';
import * as UiStates from 'src/state/ui/States';
import * as PageStyles from 'src/view/page/Page.css';

import Account from './Account';
import * as Styles from './Main.css';
import SettingBtn from './SettingBtn';

interface IProps {
  states: UiStates.IPageSetting;
}

class Main extends React.Component<IProps> {
  public static PageId = 'Setting';
  private static SubPageIdAccount = 'Account';
  private static SubPageIdCategory = 'Category';

  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    switch (this.props.states.subPageId) {
      case Main.SubPageIdAccount:
        return <Account />;
      default:
        return this.renderTopPage();
    }
  }

  private renderTopPage() {
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

const mapStateToProps = (state: IStoreState) => {
  return {
    states: state.ui.pageSetting,
  };
};
export default ReactRedux.connect(mapStateToProps)(Main);
