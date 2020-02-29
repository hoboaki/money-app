import ClassNames from 'classnames';
import * as React from 'react';
import * as BasicStyles from 'src/view/Basic.css';
import * as LayoutStyles from 'src/view/Layout.css';
import * as PageStyles from 'src/view/page/Page.css';
import MaterialIcon from 'src/view/widget/material-icon';

import * as Styles from './Account.css';
import Header from './Header';

class Account extends React.Component {
  public render() {
    const rootClass = ClassNames(PageStyles.Base, LayoutStyles.TopToBottom);
    const header = <Header title={'口座管理'} iconName="payment" />;

    const controlBar = (
      <div className={Styles.ControlBar}>
        <div className={Styles.ControlBarAreaLeft}>
          <button>資産</button>
          <button>負債</button>
          <button>集計</button>
        </div>
        <div className={Styles.ControlBarAreaRight}>
          <button className={BasicStyles.IconBtn}>
            <MaterialIcon name={'add'} classNames={[]} darkMode={false} />
          </button>
        </div>
      </div>
    );

    const accountList = <div className={Styles.AccountList}>口座リスト</div>;

    const body = (
      <div className={Styles.BodyRoot}>
        {controlBar}
        {accountList}
      </div>
    );

    return (
      <div className={rootClass}>
        {header}
        {body}
      </div>
    );
  }
}

export default Account;
