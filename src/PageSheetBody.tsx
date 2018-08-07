import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import * as Style from './PageSheetBody.css';

class PageSheetBody extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Style.Root,
    );
    return (
      <div className={rootClass}>
      </div>
    );
  }

}

export default PageSheetBody;
