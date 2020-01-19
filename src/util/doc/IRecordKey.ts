import { RecordKind } from 'src/state/doc/Types';

/** １つのレコードを特定するためのキー。ID だけでなく RecordKind も持つことで検索しやすくしてある。 */
interface IRecordKey {
  /** レコードID。 */
  id: number;

  /** レコードの種類。 */
  kind: RecordKind;
}

export default IRecordKey;
