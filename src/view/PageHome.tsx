import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyles from './Layout.css';
import * as PageStyles from './Page.css';
import PageHomeBody from './PageHomeBody';
import PageHomeHeader from './PageHomeHeader';

class PageHome extends React.Component<any, any> {
  public static PageId: string = 'Home';

  public render() {
    const rootClass = ClassNames(
      PageStyles.Base,
      LayoutStyles.TopToBottom,
    );
    return (
      <div className={rootClass}>
        <PageHomeHeader />
        <PageHomeBody />
      </div>
    );
  }

}

export default PageHome;
