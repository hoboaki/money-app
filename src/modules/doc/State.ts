export interface IRecord {
  id: number;
  date: string;
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

/**
 * 出金レコードの新規追加。
 * @param amount 金額。(出金がプラス・入金がマイナス)
 */
export const outgoRecordAddNew = (
  state: IState,
  date: string,
  memo: string,
  accountId: number,
  categoryId: number,
  amount: number,
  ) => {
  // オブジェクト作成
  const obj = {
    id: 0,
    date,
    memo,
    accountId,
    categoryId,
    amount,
  };

  // 追加
  obj.id = state.nextId.outgo.record;
  state.nextId.outgo.record++;
  state.outgo.records[obj.id] = obj;
  return obj.id;
};
