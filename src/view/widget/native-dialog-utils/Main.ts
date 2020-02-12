import { remote } from 'electron';

export const showInfoDialog = (title: string, msg: string, detail: string | undefined): void => {
  const dialog = remote.dialog;
  dialog.showMessageBox(remote.getCurrentWindow(), {
    type: 'error',
    buttons: ['OK'],
    defaultId: 0,
    title: title,
    message: msg,
    detail,
  });
};

export const showErrorDialog = (title: string, msg: string, detail: string | undefined): void => {
  const dialog = remote.dialog;
  dialog.showMessageBox(remote.getCurrentWindow(), {
    type: 'error',
    buttons: ['OK'],
    defaultId: 0,
    title: title,
    message: msg,
    detail,
  });
};
