import * as React from 'react';
import * as StylesLayout from './Layout.css';
import TitleBar from './TitleBar';

class App extends React.Component {
  public render() {
    return (
      <div className={StylesLayout.TopToBottom}>
        <TitleBar />
      </div>
    );
  }
}

export default App;
