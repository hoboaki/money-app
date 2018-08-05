import * as React from 'react';
import * as Styles from './TitleBar.css';
import ClassNames from 'classnames';

class TitleBar extends React.Component {
  public render() {
    const rootClass = ClassNames(Styles.Base, Styles.Bg, Styles.BgActive);
    const titleClass = ClassNames(Styles.Base, Styles.Title);
    return (
      <div id="titleBar" className={rootClass}>
        <div className={titleClass}><div>{'\uD83D\uDC27'} ファイル名 - MoneyApp</div></div>
      </div>
    );
  }
}

export default TitleBar;
