import ClassNames from 'classnames';
import { remote } from 'electron';
import * as Fs from 'fs';
import * as React from 'react';
import * as PageStyles from 'src/view/page/Page.css';
import * as NativeDialogUtils from 'src/view/widget/native-dialog-utils';

import Btn from './Btn';
import * as Styles from './Main.css';

interface IState {
  csvText: string;
  modalRecordImportFromCsv: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Main extends React.Component<any, IState> {
  public static PageId = 'Import';
  private static BtnIdFromPalmCsvFile = 'FromPalmCsvFile';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(props: any) {
    super(props);
    this.state = {
      csvText: '',
      modalRecordImportFromCsv: false,
    };
  }

  public render() {
    const rootClass = ClassNames(PageStyles.Base, Styles.Root);

    const btnInfos = [];
    btnInfos.push({
      settingId: Main.BtnIdFromPalmCsvFile,
      title: 'Palm 書式 CSV ファイルから取込...',
      comment:
        '左列から日付，メモ，入金額，出金額，カテゴリの順に記述された CSV ファイル（UTF8エンコーディング）のレコードを取り込みます。別アプリケーション，ネットバンクからのインポート等で使うことを想定しています。',
      isEnabled: true,
    });
    btnInfos.push({
      settingId: 'ImportAmMarkdown',
      title: 'AdelMoney Markdown テキストから取込...（準備中）',
      comment:
        'AdelMoney オリジナル書式で書かれたテキストを使ってレコードを取り込みます。スマートデバイスのメモアプリ等に記入した入出金記録を取り込む際に使うことを想定しています。',
      isEnabled: false,
    });

    const btnHolders: JSX.Element[] = [];
    btnInfos.forEach((btnInfo) => {
      btnHolders.push(
        <div className={Styles.BtnHolder}>
          <Btn
            key={btnInfo.settingId}
            onClicked={() => {
              this.onClicked(btnInfo.settingId);
            }}
            title={btnInfo.title}
            isEnabled={btnInfo.isEnabled}
          />
          <div className={Styles.BtnComment}>
            <span>{btnInfo.comment}</span>
          </div>
        </div>,
      );
    });

    return <div className={rootClass}>{btnHolders}</div>;
  }

  private onClicked(btnId: string) {
    switch (btnId) {
      case Main.BtnIdFromPalmCsvFile: {
        const dialog = remote.dialog;
        const filePaths = dialog.showOpenDialogSync(remote.getCurrentWindow(), {
          properties: ['openFile'],
          filters: [
            {
              name: 'CSV ファイル',
              extensions: ['csv'],
            },
          ],
        });
        if (filePaths === undefined || filePaths.length === 0) {
          return;
        }

        // ファイル読み込みを試す
        const filePath = filePaths[0];
        let csvText = '';
        try {
          csvText = Fs.readFileSync(filePath, { encoding: 'utf-8' });
        } catch (err) {
          global.console.log(`Can't read document '${filePath}'.`);
          global.console.log(err.message);
          NativeDialogUtils.showErrorDialog(
            'レコードのインポート',
            'ファイルの読み込みに失敗しました。',
            'ファイルが存在していることと，ファイルを読み取る権限があることを確認してください。',
          );
          return;
        }

        // ダイアログオープン
        this.setState({
          csvText,
          modalRecordImportFromCsv: true,
        });

        break;
      }
    }
  }
}

export default Main;
