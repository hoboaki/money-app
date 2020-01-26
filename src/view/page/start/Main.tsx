import ClassNames from 'classnames';
import { remote } from 'electron';
import * as React from 'react';

import * as PageStyles from '../Page.css';
import * as Styles from './Main.css';
import MainBtn from './MainBtn';

interface IProps {
  onNewFromMmxfSelected: ((filePath: string) => void);
  onNewExampleSelected: (() => void);
}

class Main extends React.Component<IProps, any> {
  public static PageId: string = 'Start';
  private static BtnIdOpenLatest: string = 'OpenLatest';
  private static BtnIdNewFromMmxf: string = 'NewFromMmxf';
  private static BtnIdNewExample: string = 'NewExample';

  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    const rootClass = ClassNames(
      PageStyles.Base,
      Styles.Root,
    );

    const openBtnInfos = [];
    openBtnInfos.push({
      btnId: Main.BtnIdOpenLatest,
      title: '最近開いたファイルを開く（準備中）',
      iconName: 'payment',
      isEnabled: false,
    });
    openBtnInfos.push({
      btnId: '',
      title: 'ファイルを指定して開く（準備中）',
      iconName: 'class',
      isEnabled: false,
    });

    const newBtnInfos = [];
    newBtnInfos.push({
      btnId: Main.BtnIdNewFromMmxf,
      title: 'MasterMoney ファイル (mmxf) を使って作成',
      iconName: 'class',
      isEnabled: true,
    });
    newBtnInfos.push({
      btnId: '',
      title: 'テンプレートを使って作成（準備中）',
      iconName: 'class',
      isEnabled: false,
    });
    newBtnInfos.push({
      btnId: Main.BtnIdNewExample,
      title: 'デモ用データを使って作成',
      iconName: 'class',
      isEnabled: true,
    });

    const openBtns: JSX.Element[] = [];
    openBtnInfos.forEach((btnInfo) => {
      openBtns.push(<MainBtn
        key={btnInfo.btnId}
        onClicked={() => {this.onClicked(btnInfo.btnId); }}
        isEnabled={btnInfo.isEnabled}
        title={btnInfo.title}
        />);
    });

    const newBtns: JSX.Element[] = [];
    newBtnInfos.forEach((btnInfo) => {
      newBtns.push(<MainBtn
        key={btnInfo.btnId}
        onClicked={() => {this.onClicked(btnInfo.btnId); }}
        isEnabled={btnInfo.isEnabled}
        title={btnInfo.title}
        />);
    });

    return (
      <div className={rootClass}>
        <div className={Styles.BtnContainer}>
          <span className={Styles.Label}>ファイルを開く</span>
          {openBtns}
          <span className={Styles.Label}>新規作成</span>
          {newBtns}
        </div>
      </div>
    );
  }

  private onClicked(btnId: string) {
    switch (btnId) {
      case Main.BtnIdOpenLatest:
        this.props.onNewFromMmxfSelected(`${process.env.HOME}/Desktop/MoneyAppTest.mmxf`);
        break;

      case Main.BtnIdNewFromMmxf:
        const dialog = remote.dialog;
        const filePaths = dialog.showOpenDialogSync(
          remote.getCurrentWindow(),
          {
            properties: ['openFile'],
            filters: [
              {
                name: 'MasterMoney ファイル',
                extensions: ['mmxf'],
              },
            ],
          },
        );
        if (filePaths === undefined || filePaths.length === 0) {
          return;
        }
        this.props.onNewFromMmxfSelected(filePaths[0]);
        break;

      case Main.BtnIdNewExample:
        this.props.onNewExampleSelected();
        break;
    }
  }
}

export default Main;
