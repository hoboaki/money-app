import ClassNames from 'classnames';
import { remote } from 'electron';
import * as React from 'react';

import * as PageStyles from '../Page.css';
import * as Styles from './Main.css';
import MainBtn from './MainBtn';

interface IProps {
  onFileSelected: ((filePath: string) => void);
}

class Main extends React.Component<IProps, any> {
  public static PageId: string = 'Start';
  private static BtnIdOpenLatest: string = 'OpenLatest';
  private static BtnIdNewMmxf: string = 'NewFromMmxf';

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
      iconName: 'account_balance',
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
      btnId: Main.BtnIdNewMmxf,
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
        this.props.onFileSelected(`${process.env.HOME}/Desktop/MoneyAppTest.mmxf`);
        break;

      case Main.BtnIdNewMmxf:
        const dialog = remote.dialog;
        dialog.showOpenDialog(
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
          (filePaths) => {
            if (filePaths === undefined || filePaths.length === 0) {
              return;
            }
            this.props.onFileSelected(filePaths[0]);
          },
        );
        break;
    }
  }
}

export default Main;
