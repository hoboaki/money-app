import ClassNames from 'classnames';
import * as React from 'react';

import * as BasicStyles from '../../Basic.css';
import * as Styles from './SettingBtn.css';

interface IProps {
  onClicked: (() => void);
  title: string;
  iconName: string;
}

class SideBarBtn extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    const rootClass = ClassNames(
      Styles.Root,
      BasicStyles.StdButton,
    );
    const iconClass = ClassNames(
      'material-icons',
      'md-36',
      'md-dark',
    );
    return (
      <button
        className={rootClass}
        onClick={this.props.onClicked}
        title={this.props.title}>
        <i className={iconClass}>{this.props.iconName}</i><span>{this.props.title}</span>
      </button>
    );
  }

}

export default SideBarBtn;
