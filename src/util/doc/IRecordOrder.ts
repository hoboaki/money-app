import RecordOrderKind from './RecordOrderKind';

interface IRecordOrder {
  /** 並び順のキーにする種類。 */
  kind: RecordOrderKind;

  /** 並び順を反転させるか。false が昇順。 true が降順。 */
  reverse: boolean;
}

export default IRecordOrder;
