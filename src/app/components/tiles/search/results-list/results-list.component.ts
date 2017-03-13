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
	highlightClass: string[];

	constructor(protected store: Store<fromRoot.State>, private collectionIndex: number) {
		super(store,collectionIndex);
		store.select('song').subscribe((newSongs: Song[][]) => {
			this.items = newSongs[collectionIndex];
			this.highlightClass = <string[]>Array(this.items.length);
		});
		// store.select('draggedItemData')
		// 	.subscribe((draggedItemData: CollectionModficationData[]) => {
		// 		console.log(draggedItemData
		// 			.filter(item => item.collectionKey = "song"))
		// 	});

	}

	onMouse(e: MouseEvent) {
		const songDragInfo = new CollectionModficationData();
		songDragInfo.collectionKey = "song";
		songDragInfo.collectionIndex = this.collectionIndex;
		songDragInfo.path = [this.indexOf(e)];
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
