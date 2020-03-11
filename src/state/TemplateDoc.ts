import Clone from 'clone';
import IYearMonthDayDate from 'src/util/IYearMonthDayDate';

import * as StateMethods from './doc/StateMethods';
import * as States from './doc/States';
import * as Types from './doc/Types';

interface ICategory {
  name: string;
  collapse: boolean;
  items: {
    name: string;
  }[];
}

/// テンプレートドキュメントデータ
class TemplateDoc {
  /// サンプルドキュメントの作成。
  public static Create() {
    const state = Clone(States.defaultState);

    // 口座
    const accountStartDate: IYearMonthDayDate = {
      year: 2000,
      month: 1,
      day: 1,
    };
    StateMethods.basicAccountAdd(state, '財布', Types.BasicAccountKind.AssetsCash, 2020, accountStartDate);
    StateMethods.basicAccountAdd(
      state,
      'クレジットカード',
      Types.BasicAccountKind.LiabilitiesCard,
      0,
      accountStartDate,
    );

    // 入金カテゴリ作成
    {
      const categories: ICategory[] = [
        {
          name: '雑収入',
          collapse: false,
          items: [],
        },
        {
          name: '給与',
          collapse: false,
          items: [],
        },
      ];
      const rootCategoryId = StateMethods.incomeCategoryAdd(state, '', null);
      categories.forEach((parent) => {
        const parentId = StateMethods.incomeCategoryAdd(state, parent.name, rootCategoryId);
        if (parent.collapse) {
          StateMethods.categoryCollapsedStateUpdate(state, parentId, true);
        }
        parent.items.forEach((child) => {
          StateMethods.incomeCategoryAdd(state, child.name, parentId);
        });
      });
    }

    // 出金カテゴリ作成
    {
      const categories: ICategory[] = [
        {
          name: '雑出費',
          collapse: false,
          items: [],
        },
        {
          name: '食費',
          collapse: false,
          items: [{ name: '外食' }, { name: '食材' }],
        },
        {
          name: '光熱費',
          collapse: false,
          items: [],
        },
        {
          name: '教育費',
          collapse: false,
          items: [],
        },
        {
          name: '通信費',
          collapse: false,
          items: [],
        },
        {
          name: '保険・医療費',
          collapse: false,
          items: [],
        },
        {
          name: '日用品',
          collapse: false,
          items: [],
        },
        {
          name: '医療',
          collapse: false,
          items: [],
        },
        {
          name: '選択・クリーニング',
          collapse: false,
          items: [],
        },
        {
          name: '交通費',
          collapse: false,
          items: [],
        },
        {
          name: '新聞',
          collapse: false,
          items: [],
        },
        {
          name: '娯楽',
          collapse: false,
          items: [],
        },
        {
          name: '家電',
          collapse: false,
          items: [],
        },
        {
          name: '利息・手数料',
          collapse: false,
          items: [],
        },
      ];
      const rootCategoryId = StateMethods.outgoCategoryAdd(state, '', null);
      categories.forEach((parent) => {
        const parentId = StateMethods.outgoCategoryAdd(state, parent.name, rootCategoryId);
        if (parent.collapse) {
          StateMethods.categoryCollapsedStateUpdate(state, parentId, true);
        }
        parent.items.forEach((child) => {
          StateMethods.outgoCategoryAdd(state, child.name, parentId);
        });
      });
    }

    return state;
  }
}

export default TemplateDoc;
