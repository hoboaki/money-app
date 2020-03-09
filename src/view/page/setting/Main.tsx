import * as React from 'react';
import * as ReactRedux from 'react-redux';
import IStoreState from 'src/state/IStoreState';
import * as UiStates from 'src/state/ui/States';

import Account from './Account';
import Category from './Category';

interface IProps {
  states: UiStates.IPageSetting;
}

class Main extends React.Component<IProps> {
  public static PageId = 'Setting';
  public static SubPageIdAccount = 'Account';
  public static SubPageIdCategory = 'Category';

  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    switch (this.props.states.subPageId) {
      case Main.SubPageIdAccount:
        return <Account />;
      case Main.SubPageIdCategory:
        return <Category />;
      default:
        return <div />;
    }
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    states: state.ui.pageSetting,
  };
};
export default ReactRedux.connect(mapStateToProps)(Main);
