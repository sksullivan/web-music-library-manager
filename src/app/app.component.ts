import { Component, Injectable, NgZone } from '@angular/core';
import { Http } from "@angular/http";

import { BehaviorSubject, Subject } from 'rxjs';

import { VideoService } from './services/video.service';

import { Store } from '@ngrx/store';
import * as fromRoot from './reducers/search.reducer';
import * as app from './app.actions';
import { YoutubeSearchResults } from './models/youtube-search-results.model';
import { TrayItem } from './models/tray-item.model';
import { Point, SurfaceLayout, Tile } from './models/surface-layout.model';

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
	private mouseLocation = new Point(0,0);

	constructor(private videoService: VideoService, private store: Store<fromRoot.State>, zone: NgZone) {
		this.registerStoreListeners();
		this.registerStreamListeners();

		document.onmousemove = (e: MouseEvent) => 
			zone.run(() => this.mouseLocation = new Point(e.clientX,e.clientY));
	}

	registerStoreListeners() {
		this.store.select('searchResults').subscribe((results: YoutubeSearchResults) => { this.searchResults = results });
		this.store.select('loading').subscribe((loading: boolean) => { this.loading = loading });
		this.store.select('surfaceLayout').subscribe((surfaceLayout: SurfaceLayout) => { this.surfaceLayout = surfaceLayout });
		this.store.select('placingTrayItem').subscribe((trayItem: TrayItem) => {
			this.placingTrayItem = trayItem;
			this.surfaceDisplayStream.next(true);
		});
		this.store.select('trayItems').subscribe((trayItems: TrayItem[]) => {
			this.trayItems = trayItems;
		});
	}

	registerStreamListeners() {
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
		this.surfaceDisplayStream
			.subscribe((status: boolean) => {
				if (!status) {
					// this.store.dispatch(new app.PlaceTrayItemCompleteAction());
				}
			});
	}
}
