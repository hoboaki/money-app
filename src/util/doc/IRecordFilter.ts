import * as States from '../state/doc/States';
import IRecordCollection from './IRecordCollection';

/** フィルタインターフェース。 */
interface IRecordFilter {
  filter: (collection: IRecordCollection, state: States.IState) => IRecordCollection;
}
export default IRecordFilter;
