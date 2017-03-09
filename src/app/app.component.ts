import { Component, Injectable } from '@angular/core';
import { Http } from "@angular/http";

import { BehaviorSubject, Subject } from 'rxjs';

import { VideoService } from './services/video.service';

import { Store } from '@ngrx/store';
import * as fromRoot from './reducers/search.reducer';
import * as app from './app.actions';
import { YoutubeSearchResults } from './models/youtube-search-results.model';
import { TrayItem } from './models/tray-item.model';
import { SurfaceLayout, Tile } from './models/surface-layout.model';

import '../assets/css/styles.css';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [VideoService]
})

@Injectable()
export class AppComponent {
	private searchResults: YoutubeSearchResults;
	private loading: boolean;
	private searchResultsSubscription: any;
	private searchStream = new BehaviorSubject<string>("");
	private surfaceLayout: SurfaceLayout;
	private traySelectionStream = new Subject<TrayItem>();
	private placingTrayItem: TrayItem;
	private surfaceDisplayStream = new Subject<boolean>();
	private trayItems: TrayItem[];

	constructor(private videoService: VideoService, private store: Store<fromRoot.State>) {
		store.select('searchResults').subscribe((results: YoutubeSearchResults) => { this.searchResults = results });
		store.select('loading').subscribe((loading: boolean) => { this.loading = loading });
		store.select('surfaceLayout').subscribe((surfaceLayout: SurfaceLayout) => { this.surfaceLayout = surfaceLayout });
		store.select('placingTrayItem').subscribe((trayItem: TrayItem) => {
			this.placingTrayItem = trayItem;
			if (trayItem == undefined) {
				this.surfaceDisplayStream.next(false);
			} else {
				this.surfaceDisplayStream.next(true);
			}
		});
		store.select('trayItems').subscribe((trayItems: TrayItem[]) => {
			this.trayItems = trayItems;
		});

		this.searchStream
			.debounceTime(40)
			.filter(search => search.length > 1)
			.subscribe(search => {
				this.store.dispatch(new app.SearchAction(search))
				this.videoService.fetchVideos(search)
					.subscribe(searchResults => this.store.dispatch(new app.SearchCompleteAction(searchResults)));
			});
		this.searchStream.delay(300)
			.subscribe(search => {
				if (search == "") {
					this.store.dispatch(new app.SearchCompleteAction(new YoutubeSearchResults()));
				}
			});
		this.traySelectionStream
			.subscribe(trayItem => this.store.dispatch(new app.PlaceTrayItemAction(trayItem)));
	}
}
