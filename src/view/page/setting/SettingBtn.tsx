import ClassNames from 'classnames';
import * as React from 'react';
import Materialicon from 'src/view/widget/material-icon';

import * as BasicStyles from '../../Basic.css';
import * as Styles from './SettingBtn.css';

interface IProps {
  onClicked: () => void;
  title: string;
  iconName: string;
}

class SideBarBtn extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    const rootClass = ClassNames(Styles.Root, BasicStyles.StdBtnPrimary);
    return (
      <button className={rootClass} onClick={this.props.onClicked} disabled={true} title={this.props.title}>
        <Materialicon name={this.props.iconName} darkMode={false} classNames={[]} />
        <span>{this.props.title}</span>
      </button>
    );
  }
}

export default SideBarBtn;
