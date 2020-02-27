import ClassNames from 'classnames';
import * as React from 'react';
import * as PageStyles from 'src/view/page/Page.css';

import * as Styles from './Account.css';
import Header from './Header';

class Account extends React.Component {
  public render() {
    const rootClass = ClassNames(PageStyles.Base, Styles.Root);
    const header = <Header title={'口座管理'} />;
    const body = <div></div>;

    return (
      <div className={rootClass}>
        {header}
        {body}
      </div>
    );
  }
}

export default Account;
