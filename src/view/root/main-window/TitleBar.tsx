import ClassNames from 'classnames';
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import IStoreState from 'src/state/IStoreState';
import * as UiStates from 'src/state/ui/States';
import * as Styles from './TitleBar.css';

interface IProps {
  isActive: boolean;
}

interface ILocalProps extends IProps {
  ui: UiStates.IState;
}

class TitleBar extends React.Component<ILocalProps, any> {
  public constructor(props: ILocalProps) {
    super(props);
  }

  public render() {
    const rootClass = ClassNames(
      Styles.Base,
      Styles.Bg,
      {[Styles.BgActive]: this.props.isActive},
    );
    const titleClass = ClassNames(Styles.Base, Styles.Title);
    const titleText = this.props.ui.document.filePath.length === 0 ?
      'スタートページ' : this.props.ui.document.filePath.slice(this.props.ui.document.filePath.lastIndexOf('/') + 1);
    return (
      <div id="titleBar" className={rootClass}>
        <div className={titleClass}><div>{`\uD83D\uDC27 ${titleText}`}</div></div>
      </div>
    );
  }
}

const mapStateToProps = (state: IStoreState, props: IProps) => {
  const result: ILocalProps = Object.assign(
    props,
    {
      ui: state.ui,
    },
  );
  return result;
};
export default ReactRedux.connect(mapStateToProps)(TitleBar);
