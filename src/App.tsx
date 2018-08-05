import {ipcRenderer as IpcRenderer} from 'electron';
import * as React from 'react';
import * as StylesLayout from './Layout.css';
import SideBar from './SideBar';
import TitleBar from './TitleBar';

interface IState {
  isActive: boolean;
}

class App extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isActive: true,
    };
  }

  public componentDidMount() {
    // Focus/Unfocus 切替
    window.onload = () => {
      IpcRenderer.on('app-message', (event: any, msg: string) => {
        switch (msg) {
          case 'focus':
            this.setState({isActive: true});
            break;

          case 'blur':
            this.setState({isActive: false});
            break;
        }
      });
    };
  }

  public render() {
    return (
      <div className={StylesLayout.TopToBottom}>
        <TitleBar isActive={this.state.isActive}/>
        <div className={StylesLayout.LeftToRight}>
          <SideBar />
        </div>
      </div>
    );
  }
}

export default App;
