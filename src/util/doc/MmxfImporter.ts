import * as Fs from 'fs';
import * as Xmldom from 'xmldom';
import * as Xpath from 'xpath-ts';
import * as StateMethods from '../../state/doc/StateMethods';
import * as States from '../../state/doc/States';
import * as Types from '../../state/doc/Types';
import YearMonthDayDate from '../YearMonthDayDate';

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
    // 読み込み失敗したら即終了
    if (err) {
      result.errorMsgs.push(err.message);
      return result;
    }

    // 設定する対象
    const doc = States.defaultState;

    // 便利関数定義
    const dateTextToYearMonthDate = (text: string) => {
      const texts = text.split('.');
      return YearMonthDayDate.fromDate(new Date(
        Number(texts[0]), Number(texts[1]), Number(texts[2]),
        ));
    };

    // パース
    const xmlDoc = new Xmldom.DOMParser().parseFromString(data, 'application/xml');

    // JPY の currency id を取得
    const jpyCurrencyNodes = Xpath.select(`//currency_list/currency[@abbr='JPY']`, xmlDoc) as Element[];
    if (jpyCurrencyNodes == null) {
      result.errorMsgs.push(`日本円(JPY) currency 要素が見つかりませんでした。`);
      return result;
    }
    const jpyCurrencyId = (jpyCurrencyNodes[0].attributes.getNamedItem('id') as Attr).value;

    // 口座の解析
    const toAccountIdDict: {[key: number]: number} = {}; // node_cache id -> accountId の辞書
    {
      const registerAccountFunc = (node: Element, accountKind: Types.AccountKind) => {
        const id = Number((node.attributes.getNamedItem('id') as Attr).value);
        const currency = (node.attributes.getNamedItem('currency') as Attr).value;
        const dateText = (node.attributes.getNamedItem('date') as Attr).value;
        const valueAttr = node.attributes.getNamedItem('value');
        const value = valueAttr != null ? Number(valueAttr.value) : 0;
        const title = (Xpath.select('title', node) as Element[])[0].textContent as string;
        if (currency !== jpyCurrencyId) {
          result.errorMsgs.push(`アカウント（名前＝'${title}'）は日本円ではない通貨が設定されていました。`);
        }
        const accountId = StateMethods.accountAdd(
          doc,
          title,
          accountKind,
          value,
          dateTextToYearMonthDate(dateText),
          );
        toAccountIdDict[id] = accountId;
      };

      // 現金
      (Xpath.select('//asset/node_cache', xmlDoc) as Element[]).forEach((node) => {
        registerAccountFunc(node, Types.AccountKind.AssetsCash);
      });

      // 銀行
      (Xpath.select('//asset/node_bank', xmlDoc) as Element[]).forEach((node) => {
        registerAccountFunc(node, Types.AccountKind.AssetsBank);
      });

      // 投資
      (Xpath.select('//asset/node_invest', xmlDoc) as Element[]).forEach((node) => {
        registerAccountFunc(node, Types.AccountKind.AssetsInvesting);
      });

      // その他資産
      (Xpath.select('//asset/node_asset', xmlDoc) as Element[]).forEach((node) => {
        registerAccountFunc(node, Types.AccountKind.AssetsOther);
      });

      // ローン
      if ((Xpath.select('//debt/node_loan', xmlDoc) as Element[]).length !== 0) {
        result.errorMsgs.push(`種類がローンの口座は未対応です。`);
      }

      // クレジットカード
      (Xpath.select('//debt/node_credit', xmlDoc) as Element[]).forEach((node) => {
        registerAccountFunc(node, Types.AccountKind.LiabilitiesCard);
      });

      // その他負債
      (Xpath.select('//debt/node_debt', xmlDoc) as Element[]).forEach((node) => {
        registerAccountFunc(node, Types.AccountKind.LiabilitiesOther);
      });
    }
    if (result.errorMsgs.length !== 0) {
      return result;
    }
    global.console.log(doc);
  });
  return result;
};
