/** レコードの並び順。 */
enum RecordOrderKind {
  Invalid = 0, // 無効値。
  RecordId = 1, // レコードID順。
  Date = 2, // 日付順
  Category = 3, // レコードの種類＆カテゴリ
}

export default RecordOrderKind;
