import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import * as Style from './PageHomeBody.css';
import PageHomeBalance from './PageHomeBalance';

class PageHomeBody extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Style.Root,
    );
    return (
      <div className={rootClass}>
        <PageHomeBalance />
      </div>
    );
  }

}

export default PageHomeBody;
