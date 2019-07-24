import * as Fs from 'fs';
import * as States from '../../state/doc/States';

export interface IImportResult {
  errorMsgs: string[];
  doc: States.IState | null;
}

export const importFile = (filePath: string): IImportResult => {
  const result: IImportResult = {
    errorMsgs: [],
    doc: null,
  };
  Fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      result.errorMsgs.push(err.message);
      return result;
    }

    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'application/xml');
    global.console.log(xml);
  });
  return result;
};
