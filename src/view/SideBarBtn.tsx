import ClassNames from 'classnames';
import * as React from 'react';
import * as Styles from './SideBarBtn.css';

interface IProps {
  onClicked: (() => void);
  title: string;
  iconName: string;
  isActive: boolean;
}

class SideBarBtn extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    const rootClass = ClassNames(
      Styles.Root,
      {[Styles.RootActive]: this.props.isActive},
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
        <i className={iconClass}>{this.props.iconName}</i>
      </button>
    );
  }

}

export default SideBarBtn;
