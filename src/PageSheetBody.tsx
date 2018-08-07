import ClassNames from 'classnames';
import * as React from 'react';
import * as StylesLayout from './Layout.css';
import * as Styles from './PageSheetBody.css';

class PageSheetBody extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Styles.Root,
    );
    return (
      <div className={rootClass}>
      </div>
    );
  }

}

export default PageSheetBody;
