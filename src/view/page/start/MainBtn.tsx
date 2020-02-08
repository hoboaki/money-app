import ClassNames from 'classnames';
import * as React from 'react';

import * as BasicStyles from './../../Basic.css';
import * as Styles from './MainBtn.css';

interface IProps {
  isEnabled: boolean;
  onClicked: () => void;
  title: string;
}

class MainBtn extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    const rootClass = ClassNames(Styles.Root, BasicStyles.StdBtnPrimary);
    return (
      <button
        className={rootClass}
        onClick={this.props.onClicked}
        disabled={!this.props.isEnabled}
        title={this.props.title}
      >
        <span>{this.props.title}</span>
      </button>
    );
  }
}

export default MainBtn;
