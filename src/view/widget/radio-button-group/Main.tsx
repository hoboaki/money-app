import ClassNames from 'classnames';
import * as React from 'react';

import * as Styles from './Main.css';

interface IBtnInfo {
  /** ラベル。 */
  label: string;
}

interface IProps {
  /** ボタンの設定。 */
  btns: IBtnInfo[];

  /** 選択されているボタンの index 値。 */
  selectedBtnIndex: number;

  /** 変更時のコールバック。 */
  onChanged: (btnIndex: number) => void;
}

/** ラジオボタングループ。 */
class Main extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const btns = this.props.btns.map((btnInfo) => {
      return <div><input type="radio" name="title" /><label>{btnInfo.label}</label></div>;
    });
    return <div className={Styles.Root}>{btns}</div>;
  }
}

export default Main;
