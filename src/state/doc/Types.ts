/** 口座グループ。 */
export enum AccountGroup {
  Invalid = 0,
  Assets = 1, // 資産。
  Liabilities = 2, // 負債。
}

/** 口座の種類。 */
export enum AccountKind {
  Invalid = 0,
  AssetsCash = 10, // 資産：現金。
  AssetsBank = 11, // 資産：銀行口座。
  AssetsInvesting = 12, // 資産：:投資。
  AssetsOther = 19, // 資産：その他。
  LiabilitiesLoan = 20, // 負債：ローン。
  LiabilitiesCard = 21, // 負債：クレジットカード。
  LiabilitiesOther = 29, // 負債：その他。
}

/** AccountKind -> AccountGroup 変換関数。 */
export const accountKindToAccountGroup = (kind: AccountKind) => {
  switch (kind) {
    case AccountKind.AssetsCash:
    case AccountKind.AssetsBank:
    case AccountKind.AssetsInvesting:
    case AccountKind.AssetsOther:
      return AccountGroup.Assets;

    case AccountKind.LiabilitiesLoan:
    case AccountKind.LiabilitiesCard:
    case AccountKind.LiabilitiesOther:
        return AccountGroup.Liabilities;

    default:
      return AccountGroup.Invalid;
  }
};

/** AccountKind の種類を示す日本語を取得する。 */
export const localizedAccountKind = (kind: AccountKind) => {
  switch (kind) {
    case AccountKind.AssetsCash: return '現金';
    case AccountKind.AssetsBank: return '銀行口座';
    case AccountKind.AssetsInvesting: return '投資';
    case AccountKind.AssetsOther: return 'その他';
    case AccountKind.LiabilitiesLoan: return 'ローン';
    case AccountKind.LiabilitiesCard: return 'クレジットカード';
    case AccountKind.LiabilitiesOther: return 'その他';
    default: return '#';
  }
};

/** AccountKind の種類を示す省略形日本語を取得する。 */
export const shortLocalizedAccountKind = (kind: AccountKind) => {
  switch (kind) {
    case AccountKind.AssetsCash: return '現';
    case AccountKind.AssetsBank: return '銀';
    case AccountKind.AssetsInvesting: return '投';
    case AccountKind.AssetsOther: return '他';
    case AccountKind.LiabilitiesLoan: return 'ロ';
    case AccountKind.LiabilitiesCard: return 'ク';
    case AccountKind.LiabilitiesOther: return '他';
    default: return '#';
  }
};

/** カテゴリの種類。 */
export enum CategoryKind {
  Invalid = 0, // 無効値。
  Income = 1, // 入金。
  Outgo = 2, // 出金。
}

/** 入出金レコードの種類。 */
export enum RecordKind {
  Invalid = 0, // 無効値。
  Income = 1, // 入金。
  Outgo = 2, // 出金。
  Transfer = 3, // 資金移動。
}

/** 各種 ID の無効値。0番は使わない。 */
export const INVALID_ID = 0;
