import { remote } from 'electron';

export const showErrorDialog = (title: string, msg: string, detail: string): void => {
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
