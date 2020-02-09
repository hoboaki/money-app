import * as Fs from 'fs';
import * as StateMethods from 'src/state/doc/StateMethods';
import * as States from 'src/state/doc/States';
import * as Types from 'src/state/doc/Types';
import * as Xmldom from 'xmldom';
import * as Xpath from 'xpath-ts';

import * as IYearMonthDayDateUtils from '../IYearMonthDayDateUtils';

export interface IImportResult {
  errorMsgs: string[];
  doc: States.IState | null;
}

export const importFile = (filePath: string): IImportResult => {
  const result: IImportResult = {
    errorMsgs: [],
    doc: null,
  };

  // ファイルロード
  let fileText = '';
  try {
    fileText = Fs.readFileSync(filePath, { encoding: 'utf-8' });
  } catch (err) {
    result.errorMsgs.push(err.message);
    return result;
  }

  // 設定する対象
  const doc = States.defaultState;

  // 便利関数定義
  const dateTextToYearMonthDate = (text: string) => {
    const texts = text.split('.');
    return IYearMonthDayDateUtils.fromDate(new Date(Number(texts[0]), Number(texts[1]) - 1, Number(texts[2])));
  };

  // パース
  const xmlDoc = new Xmldom.DOMParser().parseFromString(fileText, 'application/xml');

  // JPY の currency id を取得
  const jpyCurrencyNodes = Xpath.select("//currency_list/currency[@abbr='JPY']", xmlDoc) as Element[];
  if (jpyCurrencyNodes == null) {
    result.errorMsgs.push('日本円(JPY) currency 要素が見つかりませんでした。');
    return result;
  }
  const jpyCurrencyId = (jpyCurrencyNodes[0].attributes.getNamedItem('id') as Attr).value;

  // 口座
  const toAccountIdDict: { [key: string]: number } = {}; // node_cache id -> accountId の辞書
  {
    const registerAccountFunc = (node: Element, accountKind: Types.AccountKind) => {
      const id = (node.attributes.getNamedItem('id') as Attr).value;
      const currency = (node.attributes.getNamedItem('currency') as Attr).value;
      const dateAttr = node.attributes.getNamedItem('date');
      const dateText =
        dateAttr == null
          ? IYearMonthDayDateUtils.toDataFormatText(IYearMonthDayDateUtils.fromDate(new Date(0)))
          : dateAttr.value;
      const valueAttr = node.attributes.getNamedItem('value');
      const value = valueAttr != null ? Number(valueAttr.value) : 0;
      const title = (Xpath.select('title', node) as Element[])[0].textContent as string;
      if (currency !== jpyCurrencyId) {
        result.errorMsgs.push(`アカウント（名前＝'${title}'）は日本円ではない通貨が設定されていました。`);
      }
      const accountId = StateMethods.accountAdd(doc, title, accountKind, value, dateTextToYearMonthDate(dateText));
      toAccountIdDict[id] = accountId;
    };

    // 資産
    (Xpath.select('//asset/*', xmlDoc) as Element[]).forEach((node) => {
      const tagName = node.tagName;
      let accountKind = Types.AccountKind.Invalid;
      switch (tagName) {
        case 'node_cache':
          accountKind = Types.AccountKind.AssetsCash;
          break;
        case 'node_bank':
          accountKind = Types.AccountKind.AssetsBank;
          break;
        case 'node_invest':
          accountKind = Types.AccountKind.AssetsInvesting;
          break;
        case 'node_asset':
          accountKind = Types.AccountKind.AssetsOther;
          break;
      }
      if (accountKind === Types.AccountKind.Invalid) {
        result.errorMsgs.push(`asset 以下に未対応の要素（名前='${tagName}'）が見つかりました。`);
      } else {
        registerAccountFunc(node, accountKind);
      }
    });

    // 負債
    (Xpath.select('//debt/*', xmlDoc) as Element[]).forEach((node) => {
      const tagName = node.tagName;
      let accountKind = Types.AccountKind.Invalid;
      switch (tagName) {
        case 'node_loan':
          result.errorMsgs.push('種類がローンの口座は未対応です。');
          break;
        case 'node_credit':
          accountKind = Types.AccountKind.LiabilitiesCard;
          break;
        case 'node_other':
          accountKind = Types.AccountKind.LiabilitiesOther;
          break;
      }
      if (accountKind === Types.AccountKind.Invalid) {
        result.errorMsgs.push(`debt 以下に未対応の要素（名前='${tagName}'）が見つかりました。`);
      } else {
        registerAccountFunc(node, accountKind);
      }
    });
  }
  if (result.errorMsgs.length !== 0) {
    return result;
  }

  // 資金移動
  if ((Xpath.select(`//transfer/node_system[@currency!='${jpyCurrencyId}']`, xmlDoc) as Element[]).length !== 0) {
    result.errorMsgs.push('資金移動に日本円以外の通貨が使われています。');
    return result;
  }
  (Xpath.select('//transfer/node_system/actual', xmlDoc) as Element[]).forEach((node) => {
    const accountFrom = (node.attributes.getNamedItem('account') as Attr).value;
    const accountTo = (node.attributes.getNamedItem('transfer') as Attr).value;
    const date = dateTextToYearMonthDate((node.attributes.getNamedItem('date') as Attr).value);
    const nativeDate = IYearMonthDayDateUtils.toNativeDate(date);
    const value = Number((node.attributes.getNamedItem('value') as Attr).value);
    const noteNode = (Xpath.select('note', node) as Element[])[0];
    const note = noteNode != null ? noteNode.textContent : '';
    StateMethods.transferRecordAdd(
      doc,
      nativeDate, // createDate
      nativeDate, // updateDate
      date, // date
      note != null ? note : '',
      toAccountIdDict[accountFrom],
      toAccountIdDict[accountTo],
      value,
    );
  });
  if (result.errorMsgs.length !== 0) {
    return result;
  }

  // 入金
  {
    const toCategoryId: { [key: string]: number } = {}; // node_group id から CategoryId に変換する辞書
    const parseActual = (node: Element, parentCategoryId: number) => {
      const account = (node.attributes.getNamedItem('account') as Attr).value;
      const date = dateTextToYearMonthDate((node.attributes.getNamedItem('date') as Attr).value);
      const nativeDate = IYearMonthDayDateUtils.toNativeDate(date);
      const value = Number((node.attributes.getNamedItem('value') as Attr).value);
      const noteNode = (Xpath.select('note', node) as Element[])[0];
      const note = noteNode != null ? noteNode.textContent : '';
      StateMethods.incomeRecordAdd(
        doc,
        nativeDate, // createDate
        nativeDate, // updateDate
        date, // date
        note != null ? note : '',
        toAccountIdDict[account],
        parentCategoryId,
        value,
      );
    };
    const parseNode = (node: Element, parentCategoryId: number) => {
      const id = (node.attributes.getNamedItem('id') as Attr).value;
      const title = (Xpath.select('title', node) as Element[])[0].textContent as string;
      const groups = Xpath.select('node_group', node) as Element[];
      const actuals = Xpath.select('actual', node) as Element[];
      if (groups.length !== 0 && actuals.length !== 0) {
        result.errorMsgs.push(`収入カテゴリ（名前='${title}）は子カテゴリもレコードも持つ不正なカテゴリです。'`);
        return;
      }

      // カテゴリ登録
      const categoryId = StateMethods.incomeCategoryAdd(doc, title, parentCategoryId);
      toCategoryId[id] = categoryId;

      // 子カテゴリ対応
      if (node.nodeName === 'node_group') {
        parseChilds(node, categoryId);
        return;
      }

      // レコードのパース
      actuals.forEach((actual) => {
        parseActual(actual, categoryId);
      });
    };
    const parseChilds = (node: Element, parentCategoryId: number) => {
      for (let idx = 0; idx < node.childNodes.length; ++idx) {
        const childNode = node.childNodes.item(idx);
        switch (childNode.nodeName) {
          case 'node_group':
          case 'node_actual':
            parseNode(childNode as Element, parentCategoryId);
            break;
        }
      }
    };

    // ルートを追加
    const rootCategoryId = StateMethods.incomeCategoryAdd(doc, '', null);

    // 実行
    parseChilds((Xpath.select('//income', xmlDoc) as Element[])[0], rootCategoryId);
  }
  if (result.errorMsgs.length !== 0) {
    return result;
  }

  // 出金
  {
    const toCategoryId: { [key: string]: number } = {}; // node_group id から CategoryId に変換する辞書
    const parseActual = (node: Element, parentCategoryId: number) => {
      const account = (node.attributes.getNamedItem('account') as Attr).value;
      const date = dateTextToYearMonthDate((node.attributes.getNamedItem('date') as Attr).value);
      const nativeDate = IYearMonthDayDateUtils.toNativeDate(date);
      const value = Number((node.attributes.getNamedItem('value') as Attr).value);
      const noteNode = (Xpath.select('note', node) as Element[])[0];
      const note = noteNode != null ? noteNode.textContent : '';
      StateMethods.outgoRecordAdd(
        doc,
        nativeDate, // createDate
        nativeDate, // updateDate
        date, // date
        note != null ? note : '',
        toAccountIdDict[account],
        parentCategoryId,
        value,
      );
    };
    const parseNode = (node: Element, parentCategoryId: number) => {
      const id = (node.attributes.getNamedItem('id') as Attr).value;
      const title = (Xpath.select('title', node) as Element[])[0].textContent as string;
      const groups = Xpath.select('node_group', node) as Element[];
      const actuals = Xpath.select('actual', node) as Element[];
      if (groups.length !== 0 && actuals.length !== 0) {
        result.errorMsgs.push(`支出カテゴリ（名前='${title}）は子カテゴリもレコードも持つ不正なカテゴリです。'`);
        return;
      }

      // カテゴリ登録
      const categoryId = StateMethods.outgoCategoryAdd(doc, title, parentCategoryId);
      toCategoryId[id] = categoryId;

      // 子カテゴリ対応
      if (node.nodeName === 'node_group') {
        parseChilds(node, categoryId);
        return;
      }

      // レコードのパース
      actuals.forEach((actual) => {
        parseActual(actual, categoryId);
      });
    };
    const parseChilds = (node: Element, parentCategoryId: number) => {
      for (let idx = 0; idx < node.childNodes.length; ++idx) {
        const childNode = node.childNodes.item(idx);
        switch (childNode.nodeName) {
          case 'node_group':
          case 'node_actual':
            parseNode(childNode as Element, parentCategoryId);
            break;
        }
      }
    };

    // ルートを追加
    const rootCategoryId = StateMethods.outgoCategoryAdd(doc, '', null);

    // 実行
    parseChilds((Xpath.select('//expense', xmlDoc) as Element[])[0], rootCategoryId);
  }
  if (result.errorMsgs.length !== 0) {
    return result;
  }

  // 計算アカウント
  (Xpath.select('//account_sum/node_account_sum', xmlDoc) as Element[]).forEach((node) => {
    const title = (Xpath.select('title', node) as Element[])[0].textContent as string;
    const references = Xpath.select('reference', node) as Element[];
    const accounts = references.map((ref) => toAccountIdDict[Number(ref.getAttribute('refid') as string)]);
    StateMethods.aggregateAccountAdd(doc, title, accounts);
  });

  // インポート成功
  result.doc = doc;
  return result;
};
