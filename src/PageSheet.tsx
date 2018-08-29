import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import * as PageStyle from './Page.css';
import PageSheetBody from './PageSheetBody';
import PageSheetHeader from './PageSheetHeader';

class PageSheet extends React.Component<any, any> {
  public static PageId: string = 'Sheet';

  public render() {
    const rootClass = ClassNames(
      PageStyle.Base,
      LayoutStyle.TopToBottom,
    );
    return (
      <div className={rootClass}>
        <PageSheetHeader />
        <PageSheetBody />
      </div>
    );
  }

}

export default PageSheet;
