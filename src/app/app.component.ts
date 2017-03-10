import { Component, Injectable, NgZone } from '@angular/core';
import { Http } from "@angular/http";

import { BehaviorSubject, Subject } from 'rxjs';

import { VideoService } from './services/video.service';
import { DragService } from './services/drag/drag.service';

import { Store } from '@ngrx/store';
import * as fromRoot from './reducers/search.reducer';
import * as app from './app.actions';
import { YoutubeSearchResults } from './models/youtube-search-results.model';
import { TrayItem } from './models/tray-item.model';
import { Point, SurfaceLayout, Tile } from './models/surface-layout.model';
import { DragSource, DragTarget } from './services/drag';

import '../assets/css/styles.css';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [VideoService,DragService]
})

@Injectable()
export class AppComponent {
	private searchResults: YoutubeSearchResults;
	private loading: boolean;
	private searchResultsSubscription: any;
	private searchStream = new BehaviorSubject<string>("");
	private gridTiles: void[];
	private surfaceTiles: Tile[];
	private trayClickStream = new Subject<[MouseEvent,number]>();
	private gridClickStream = new Subject<[MouseEvent,number]>();
	private tilesClickStream = new Subject<[MouseEvent,number]>();
	private trayItems: TrayItem[];
	private mouseLocation = new Point(0,0);
	private gridSize: Point;
	private draggingFromTray: boolean = false;

	constructor(private videoService: VideoService, private dragServicie: DragService, private store: Store<fromRoot.State>, zone: NgZone) {
		this.registerStoreListeners();
		this.registerStreamListeners();

		document.onmousemove = (e: MouseEvent) => 
			zone.run(() => this.mouseLocation = new Point(e.clientX,e.clientY));
	}

	registerStoreListeners() {
		this.store.select('searchResults').subscribe((results: YoutubeSearchResults) => { this.searchResults = results });
		this.store.select('loading').subscribe((loading: boolean) => { this.loading = loading });
		this.store.select('gridSize').subscribe((gridSize: Point) => { this.gridSize = gridSize });
		this.store.select('grid').subscribe((grid: void[][]) => { this.gridTiles = grid[0]; });
		this.store.select('tile').subscribe((tile: Tile[][]) => { this.surfaceTiles = tile[0] });
		this.store.select('tray').subscribe((tray: TrayItem[][]) => { this.trayItems = tray[0]; });
		this.store.select('dragSourceType').subscribe((type: string) => { this.draggingFromTray = type == "tray" });
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
		this.searchStream
			.delay(300)
			.subscribe(search => {
				if (search == "") {
					this.store.dispatch(new app.SearchCompleteAction(new YoutubeSearchResults()));
				}
			});
		this.trayClickStream
			.subscribe(([e,index]: [MouseEvent,number]) => {
				let path = [index];
				path.unshift(0);
				if (e.type == "mousedown") {
					this.store.dispatch(new app.DragAction(["tray",path]));
				}
			});
		this.gridClickStream
			.subscribe(([e,index]: [MouseEvent,number]) => {
				let path = [index];
				path.unshift(0);
				if (e.type == "mouseup") {
					this.store.dispatch(new app.DragCompleteAction(["grid",path]));
				}
			});
	}
}
