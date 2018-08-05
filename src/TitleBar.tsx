import ClassNames from 'classnames';
import * as React from 'react';
import * as Styles from './TitleBar.css';

interface IProps {
  isActive: boolean;
}

class TitleBar extends React.Component<IProps, any> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    const rootClass = ClassNames(
      Styles.Base,
      Styles.Bg,
      {[Styles.BgActive]: this.props.isActive},
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
