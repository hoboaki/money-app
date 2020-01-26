/**
 * @fileoverview 自動保存に関するメインスレッド側の処理を記述する。
 */
import ClassNames from 'classnames';
import { remote } from 'electron';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/l10n/ja.js';
import * as Fs from 'fs';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import Split from 'split.js';
import { v4 as UUID } from 'uuid';

import IAutoSaveMsgData from 'src/IAutoSaveMsgData';
import * as DocStates from 'src/state/doc/States';
import IStoreState from 'src/state/IStoreState';
import * as UiActions from 'src/state/ui/Actions';
import * as UiStates from 'src/state/ui/States';

// Worker 定義
import AutoSaveWorker from 'worker-loader!./AutoSaveWorker';
import store from './state/Store';
let worker: AutoSaveWorker | null = null;

interface IProps {
  doc: DocStates.IState;
  ui: UiStates.IState;
}

interface IState {
  isSaving: boolean;
}

class AutoSaveManager extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isSaving: false,
    };
  }

  public componentDidMount() {
    // Worker 起動
    worker = new AutoSaveWorker();

    // 一定時間毎に関数を実行して自動保存リクエストを監視
    const watchAutoSaveRequest = () => {
      const intervalSec = 1;
      setTimeout(() => {
        // リクエストがなければ何もせず終了
        if (!this.props.ui.document.requestAutoSave) {
          watchAutoSaveRequest();
          return;
        }

        // リクエスト受理処理
        store.dispatch(UiActions.documentReceivedRequestAutoSave());

        // 自動保存処理を開始
        if (worker === null) {
          throw new Error(`AutoSaveWorker is null.`);
        }
        const data: IAutoSaveMsgData = {
          doc: this.props.doc,
          ui: this.props.ui,
        };
        worker.postMessage(data);
      }, intervalSec * 1000);
    };
    worker.onmessage = (event) => {
      // 受け取り
      const jsonText: string = event.data;

      // 保存
      Fs.writeFile(this.props.ui.document.filePath, jsonText, {encoding: 'utf-8'}, (err) => {
        if (err !== null) {
          throw err;
        }
        // 成功したので監視を再開
        watchAutoSaveRequest();
      });
    };
    worker.onerror = (event) => {
      // エラーが起きたことを通知
      throw new Error(event.error);
    };
    watchAutoSaveRequest();
  }

  public render() {
    return null;
  }
}

const mapStateToProps = (state: IStoreState) => {
  const result: IProps = {
    doc: state.doc,
    ui: state.ui,
  };
  return result;
};
export default ReactRedux.connect(mapStateToProps)(AutoSaveManager);
