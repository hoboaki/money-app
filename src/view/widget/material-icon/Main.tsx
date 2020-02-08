import ClassNames from 'classnames';
import * as React from 'react';

interface IProps {
  /** 使用するアイコンの名前。 */
  name: string;

  /** 追加設定するクラス名。 */
  classNames: string[];

  /** ダークモードアイコンを使う場合は true を指定。 */
  darkMode: boolean;
}

/** マテリアルアイコンを表示するクラス。 */
class Main extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const className = ClassNames('material-icons', this.props.darkMode ? 'md-dark' : null, this.props.classNames);
    return <i className={className}>{this.props.name}</i>;
  }
}

export default Main;
