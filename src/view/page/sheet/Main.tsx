import ClassNames from 'classnames';
import * as React from 'react';

import * as LayoutStyles from '../../Layout.css';
import * as PageStyles from '../Page.css';
import Body from './Body';
import Header from './Header';

class Main extends React.Component {
  public static PageId = 'Sheet';

  public render() {
    const rootClass = ClassNames(PageStyles.Base, LayoutStyles.TopToBottom);
    return (
      <div className={rootClass}>
        <Header />
        <Body />
      </div>
    );
  }
}

export default Main;
