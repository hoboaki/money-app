import * as States from 'src/state/doc/States';
import IRecordCollection from './IRecordCollection';

/** フィルタインターフェース。 */
interface IRecordFilter {
  filter: (collection: IRecordCollection, state: States.IState) => IRecordCollection;
}
export default IRecordFilter;
