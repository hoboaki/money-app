import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyles from 'src/view/Layout.css';
import * as PageStyles from 'src/view/page/Page.css';

import * as Styles from './Account.css';
import Header from './Header';

class Account extends React.Component {
  public render() {
    const rootClass = ClassNames(PageStyles.Base, LayoutStyles.TopToBottom);
    const header = <Header title={'口座管理'} iconName="payment" />;
    const body = <div className={Styles.BodyRoot}></div>;

    return (
      <div className={rootClass}>
        {header}
        {body}
      </div>
    );
  }
}

export default Account;
