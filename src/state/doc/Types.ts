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
