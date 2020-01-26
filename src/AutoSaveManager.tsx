/**
 * @fileoverview 自動保存に関するメインスレッド側の処理を記述する。
 */
import ClassNames from 'classnames';
import { remote } from 'electron';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/l10n/ja.js';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import Split from 'split.js';
import { v4 as UUID } from 'uuid';

import * as DocStates from 'src/state/doc/States';
import * as DocTypes from 'src/state/doc/Types';
import IStoreState from 'src/state/IStoreState';
import * as UiStates from 'src/state/ui/States';

// Worker 定義
import AutoSaveWorker from 'worker-loader!./AutoSaveWorker';
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

    // 一定時間毎に関数を実行して変数を監視
    const watchAutoSaveRequest = () => {
      const intervalSec = 1;
      setTimeout(() => {
        global.console.log(`Interval.`);
        watchAutoSaveRequest();
      }, intervalSec * 1000);
    };
    worker.postMessage({ a: 1 });
    worker.onmessage = (event) => {
      // ...
    };
    worker.addEventListener('message', (event) => {
      // ...
    });
    watchAutoSaveRequest();
  }

  public render() {
    return null;
  }
}

const mapStateToProps = (state: IStoreState, props: any) => {
  const result: IProps = Object.assign(
    props,
    {
      doc: state.doc,
      ui: state.ui,
    },
  );
  return result;
};
export default ReactRedux.connect(mapStateToProps)(AutoSaveManager);
