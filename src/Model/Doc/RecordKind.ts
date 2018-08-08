/// 入出金レコードの種類。
enum RecordKind {
   Invalid = 0, ///< 無効値。
   Income = 1, ///< 入金。
   Outgo = 2, ///< 出金。
   Transfer = 3, ///< 資金移動。
}

export default RecordKind;
