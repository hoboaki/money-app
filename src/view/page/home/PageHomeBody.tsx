import ClassNames from 'classnames';
import * as React from 'react';
import PageHomeBalance from './PageHomeBalance';
import * as Styles from './PageHomeBody.css';
import PageHomeCalendar from './PageHomeCalendar';

class PageHomeBody extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Styles.Root,
    );
    return (
      <div className={rootClass}>
        <PageHomeCalendar />
        <PageHomeBalance />
      </div>
    );
  }

}

export default PageHomeBody;
