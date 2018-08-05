import ClassNames from 'classnames';
import * as React from 'react';
import * as Styles from './TitleBar.css';

interface IState {
  isActive: boolean;
}

class TitleBar extends React.Component<any, IState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      isActive: true,
    };
    global.console.log(this);
  }

  public render() {
    const rootClass = ClassNames(
      Styles.Base,
      Styles.Bg,
      {[Styles.BgActive]: this.state.isActive},
    );
    const titleClass = ClassNames(Styles.Base, Styles.Title);
    return (
      <div id="titleBar" className={rootClass}>
        <div className={titleClass}><div>{'\uD83D\uDC27'} ファイル名 - MoneyApp</div></div>
      </div>
    );
  }

}

export default TitleBar;
