import YearMonthDayDate from '../../utils/YearMonthDayDate';

export interface IRecord {
  id: number;
  date: YearMonthDayDate;
  memo: string;
}

export interface IRecordOutgo extends IRecord {
  accountId: number;
  categoryId: number;
  /** 金額。(出金がプラス・入金がマイナス) */
  amount: number;
}

export interface IState {
  outgo: {
    records: {[key: number]: IRecordOutgo};
  };

  // 次に使用するId。
  nextId: {
    account: number;
    income: {
      category: number;
      record: number;
    };
    outgo: {
      category: number;
      record: number;
    };
    transfer: {
      record: number;
    };
  };
}

export const defaultState: IState = {
  outgo: {
    records: {},
  },

  nextId: {
    account: 1,
    income: {
      category: 1,
      record: 1,
    },
    outgo: {
      category: 1,
      record: 1,
    },
    transfer: {
      record: 1,
    },
  },
};
