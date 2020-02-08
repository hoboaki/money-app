/// 入出金レコード共通クラスデータ版。
class Record {
  public createDate = ''; // 作成日時。Date.toISOString() 形式。
  public updateDate = ''; // 更新日時。Date.toISOString() 形式。
  public date = ''; // 入出金発生日付。(YYYY-MM-DD形式)
  public memo = ''; // メモ。
}

export default Record;
