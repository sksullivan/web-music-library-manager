import { Component, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import * as app from '../../../../app.actions';
import * as fromRoot from '../../../../reducers/search.reducer';

import { Song } from '../../../../models/song.model';
import { TileBase } from '../../tile-base.model';
import { CollectionModficationData } from '../../../../models/collection-modification-data.model';


@Component({
  selector: 'results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.css']
})
export class ResultsListComponent extends TileBase {
	items: Song[];

	constructor(protected store: Store<fromRoot.State>, private collectionIndex: number) {
		super(store,collectionIndex);
		store.select('song').subscribe((newSongs: Song[][]) => {
			this.items = newSongs[collectionIndex];
			this.highlightClass = <string[]>Array(this.items.length);
			// if (this.items.length == 0) {
			// 	this.items = Array.from(new Array(10),() => new Song('','',''));
			// }
				console.log(this.items);

		});
	}

	onMouse(e: MouseEvent, ignoreIfHaveItems: boolean) {
		// if (ignoreIfHaveItems && this.items.length > 0) {
		// 	console.log("ignroed")
		// 	return false;
		// }
		const songDragInfo = new CollectionModficationData();
		songDragInfo.collectionKey = "song";
		songDragInfo.collectionIndex = this.collectionIndex;
		songDragInfo.path = [this.indexOf(e)];
		if (isNaN(songDragInfo.path[0])) {
			songDragInfo.path = [this.items.length];
		}
		if (e.type == "mousedown") {
			this.store.dispatch(new app.DragAction(songDragInfo));
		} else {
			this.store.dispatch(new app.DragCompleteAction(songDragInfo));
		}
	}

	indexOf(e: MouseEvent) {
		return parseInt(e.target.getAttribute('data-index'));
	}
}
