import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers/search.reducer';


export class TileBase {
	constructor(protected store: Store<fromRoot.State>, protected collectionIndices: number[]) {

	}
}