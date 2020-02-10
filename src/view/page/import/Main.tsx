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
    btnInfos.push({
      settingId: 'ImportPalmCsvFile',
      title: 'Palm 書式 CSV ファイルから取込...',
      comment:
        '左列から日付，メモ，入金額，送金額，カテゴリの順に記述された CSV ファイル（UTF8エンコーディング）のレコードを取り込みます。別アプリケーション，ネットバンクからのインポート等で使うことを想定しています。',
    });
    btnInfos.push({
      settingId: 'ImportAmMarkdown',
      title: 'AdelMoney Markdown テキストから取込...（準備中）',
      comment:
        'AdelMoney オリジナル書式で書かれたテキストを使ってレコードを取り込みます。スマートデバイスのメモアプリ等に記入した入出金記録を取り込む際に使うことを想定しています。',
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
          />
          <div className={Styles.BtnComment}>
            <span>{btnInfo.comment}</span>
          </div>
        </div>,
      );
    });

    return <div className={rootClass}>{btnHolders}</div>;
  }

  private onClicked(settingId: string) {
    // ...
  }
}

export default Main;
