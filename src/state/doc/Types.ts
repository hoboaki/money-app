/** 口座タイプ。 */
export enum AccountType {
  Invalid = 0,
  /** 基本口座：資産。 */
  Assets = 1,
  /** 基本口座：負債。 */
  Liabilities = 2,
  /** 集計口座。 */
  Aggregate = 3,
}

/** 基本口座グループ。 */
export enum BasicAccountGroup {
  Invalid = 0,
  Assets = 1, // 資産。
  Liabilities = 2, // 負債。
}

/** 基本口座の種類。 */
export enum BasicAccountKind {
  Invalid = 0,
  AssetsCash = 10, // 資産：現金。
  AssetsBank = 11, // 資産：銀行口座。
  AssetsInvesting = 12, // 資産：:投資。
  AssetsOther = 19, // 資産：その他。
  LiabilitiesLoan = 20, // 負債：ローン。
  LiabilitiesCard = 21, // 負債：クレジットカード。
  LiabilitiesOther = 29, // 負債：その他。
}

/** BasicAccountKind -> AccountType 変換関数。 */
export const basicAccountKindToType = (kind: BasicAccountKind) => {
  switch (basicAccountKindToGroup(kind)) {
    case BasicAccountGroup.Assets:
      return AccountType.Assets;
    case BasicAccountGroup.Liabilities:
      return AccountType.Liabilities;
    default:
      return AccountType.Invalid;
  }
};

/** BasicAccountKind -> BasicAccountGroup 変換関数。 */
export const basicAccountKindToGroup = (kind: BasicAccountKind) => {
  switch (kind) {
    case BasicAccountKind.AssetsCash:
    case BasicAccountKind.AssetsBank:
    case BasicAccountKind.AssetsInvesting:
    case BasicAccountKind.AssetsOther:
      return BasicAccountGroup.Assets;

    case BasicAccountKind.LiabilitiesLoan:
    case BasicAccountKind.LiabilitiesCard:
    case BasicAccountKind.LiabilitiesOther:
      return BasicAccountGroup.Liabilities;

    default:
      return BasicAccountGroup.Invalid;
  }
};

/** BasicAccountKind の種類を示す日本語を取得する。 */
export const localizedBasicAccountKind = (kind: BasicAccountKind) => {
  switch (kind) {
    case BasicAccountKind.AssetsCash:
      return '現金';
    case BasicAccountKind.AssetsBank:
      return '銀行口座';
    case BasicAccountKind.AssetsInvesting:
      return '投資';
    case BasicAccountKind.AssetsOther:
      return 'その他';
    case BasicAccountKind.LiabilitiesLoan:
      return 'ローン';
    case BasicAccountKind.LiabilitiesCard:
      return 'クレジットカード';
    case BasicAccountKind.LiabilitiesOther:
      return 'その他';
    default:
      return '#';
  }
};

/** BasicAccountKind の種類を示す省略形日本語を取得する。 */
export const shortLocalizedBasicAccountKind = (kind: BasicAccountKind) => {
  switch (kind) {
    case BasicAccountKind.AssetsCash:
      return '現';
    case BasicAccountKind.AssetsBank:
      return '銀';
    case BasicAccountKind.AssetsInvesting:
      return '投';
    case BasicAccountKind.AssetsOther:
      return '他';
    case BasicAccountKind.LiabilitiesLoan:
      return 'ロ';
    case BasicAccountKind.LiabilitiesCard:
      return 'ク';
    case BasicAccountKind.LiabilitiesOther:
      return '他';
    default:
      return '#';
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
