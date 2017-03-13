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
			this.items = [new Song('d','d',''),new Song('j','j',' ')];
		});
		store.select('draggedItemData')
			.subscribe((draggedItemData: CollectionModficationData[]) => {
				const myDraggedItemPaths = draggedItemData
					.filter(item => item.collectionKey == "song")
					.filter(item => item.collectionIndex == this.collectionIndex)
					.map(item => this.highlightClass[item.path[0]] = "selected");
				console.log(this.highlightClass);
				// this.highlightClass = this.highlightClass.map((className: string, index: number) => {
				// 	return "l"
				// })
			});

	}

	onMouse(e: MouseEvent) {
		const songDragInfo = new CollectionModficationData();
		songDragInfo.collectionKey = "song";
		songDragInfo.collectionIndex = this.collectionIndex;
		songDragInfo.path = [this.indexOf(e)];
		if (isNaN(songDragInfo.path[0])) {
			songDragInfo.path = [0];
		}
		console.log(e)
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
