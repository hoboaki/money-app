import ClassNames from 'classnames';
import * as React from 'react';

interface IProps {
  /** 使用するアイコンの名前。 */
  name: string;

  /** アイコンサイズ。18 24 36 など。 */
  iconSize: number;

  /** ダークモードアイコンを使う場合は true を指定。 */
  darkMode: boolean;
}

/** マテリアルアイコンを表示するクラス。 */
class Main extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const className = ClassNames(
      'material-icons',
      `md-${this.props.iconSize}`,
      this.props.darkMode ? `md-dark` : null,
    );
    return <i className={className}>{this.props.name}</i>;
  }
}

export default Main;
