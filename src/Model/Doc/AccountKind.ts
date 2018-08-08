/// 口座の種類。
enum AccountKind {
  Invalid = 0,
  AssetsCash = 10, // 資産：現金。
  AssetsBank = 11, // 資産：銀行口座。
  AssetsInvesting = 12, // 資産：:投資。
  AssetsOther = 19, // 資産：その他。
  LiabilitiesLoan = 20, // 負債：ローン。
  LiabilitiesCard = 21, // 負債：クレジットカード。
  LiabilitiesOther = 29, // 負債：その他。
}

export default AccountKind;
