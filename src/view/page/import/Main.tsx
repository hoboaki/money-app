import ClassNames from 'classnames';
import * as React from 'react';

import * as PageStyles from '../Page.css';
import Btn from './Btn';
import * as Styles from './Main.css';

class Main extends React.Component {
  public static PageId = 'Import';

  public render() {
    const rootClass = ClassNames(PageStyles.Base, Styles.Root);

    const btnInfos = [];
    btnInfos.push({ settingId: 'ImportPalmCsv', title: 'Palm 書式の CSV ファイルを取込...' });

    const btns: JSX.Element[] = [];
    btnInfos.forEach((btnInfo) => {
      btns.push(
        <Btn
          key={btnInfo.settingId}
          onClicked={() => {
            this.onClicked(btnInfo.settingId);
          }}
          title={btnInfo.title}
        />,
      );
    });

    return <div className={rootClass}>{btns}</div>;
  }

  private onClicked(settingId: string) {
    // ...
  }
}

export default Main;
