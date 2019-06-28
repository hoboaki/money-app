import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import PageHomeBalance from './PageHomeBalance';
import * as Style from './PageHomeBody.css';
import PageHomeCalendar from './PageHomeCalendar';

class PageHomeBody extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Style.Root,
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
