import { BehaviorSubject, Subject } from 'rxjs';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import * as app from '../../../app.actions';
import * as fromRoot from '../../../reducers/search.reducer';

import { VideoService } from '../../../services/video.service';

import { TileBase } from '../tile-base.model';
import { Song } from '../../../models/song.model';
import { CollectionModficationData } from '../../../models/collection-modification-data.model';
import { CollectionIndices } from '../../../models/collection-indices.model';



@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent extends TileBase {
	private searchStream = new BehaviorSubject<string>("");
	private songsClickStream = new Subject<[MouseEvent,number[]]>();

	private songs: Song[];

	constructor(protected store: Store<fromRoot.State>, private videoService: VideoService, protected collectionIndices: number[]) {
		super(store,collectionIndices);
		this.searchStream
			.debounceTime(40)
			.filter(search => search.length > 1)
			.subscribe((search: string) => {
				const searchData = new CollectionModficationData();
				searchData.collectionKey = "search";
				searchData.collectionIndex = this.collectionIndices["search"];
				searchData.transformArguments = search;
				this.store.dispatch(new app.SearchAction(searchData))
				this.videoService.fetchVideos(search)
					.subscribe(searchResults => {
						const resultsData = new CollectionModficationData();
						resultsData.collectionKey = "song";
						resultsData.collectionIndex = this.collectionIndices["song"];
						resultsData.transformArguments = searchResults.items.map((result: any) => new Song(result.etag,result.id.videoId,result.snippet.title));
						this.store.dispatch(new app.SearchCompleteAction(resultsData))
					});
			});
		this.searchStream
			.delay(300)
				.subscribe(search => {
					if (search == "") {
						const searchEndedData = new CollectionModficationData();
						searchEndedData.collectionKey = "search";
						searchEndedData.collectionIndex = this.collectionIndices["search"];
						searchEndedData.transformArguments = [];
						this.store.dispatch(new app.SearchCompleteAction(searchEndedData));
					}
				});
	}
}
