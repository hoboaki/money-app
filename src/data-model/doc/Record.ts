/// 入出金レコード共通クラスデータ版。
class Record {
  public createDate: string = ''; // 作成日時。Date.toISOString() 形式。
  public updateDate: string = ''; // 更新日時。Date.toISOString() 形式。
  public date: string = ''; // 入出金発生日付。(YYYY-MM-DD形式)
  public memo: string = ''; // メモ。
}

export default Record;
