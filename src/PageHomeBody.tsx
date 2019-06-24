import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import PageHomeBalance from './PageHomeBalance';
import * as Style from './PageHomeBody.css';

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
