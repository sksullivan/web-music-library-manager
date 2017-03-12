import { Component, Injectable, NgZone } from '@angular/core';
import { Http } from "@angular/http";

import { BehaviorSubject, Subject } from 'rxjs';

import { VideoService } from './services/video.service';
import { GridService } from './services/grid.service';

import { Store } from '@ngrx/store';
import * as fromRoot from './reducers/search.reducer';
import * as app from './app.actions';
import { YoutubeSearchResults } from './models/youtube-search-results.model';
import { TrayItem } from './models/tray-item.model';
import { Point } from './models/geom.model';
import { Tile } from './models/tile.model';
import { CollectionModficationData } from './models/collection-modification-data.model';

import '../assets/css/styles.css';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [VideoService,GridService]
})

@Injectable()
export class AppComponent {
	private searchResults: YoutubeSearchResults;
	private loading: boolean;
	private searchResultsSubscription: any;
	private searchStream = new BehaviorSubject<string>("");
	private gridTiles: void[];
	private surfaceTiles: Tile[];
	private trayClickStream = new Subject<[MouseEvent,number[]]>();
	private gridClickStream = new Subject<[MouseEvent,number[]]>();
	private tilesClickStream = new Subject<[MouseEvent,number[]]>();
	private trayItems: TrayItem[];
	private mouseLocation = new Point(0,0);
	private gridSize: Point;
	private draggingFromTray: boolean = false;

	constructor(
		private videoService: VideoService,
		private gridService: GridService,
		private store: Store<fromRoot.State>,
		zone: NgZone) {
		this.registerStoreListeners();
		this.registerStreamListeners();

		document.onmousemove = (e: MouseEvent) => 
			zone.run(() => this.mouseLocation = new Point(e.clientX,e.clientY));
	}

	registerStoreListeners() {
		this.store.select('searchResults').subscribe((results: YoutubeSearchResults) => this.searchResults = results);
		this.store.select('loading').subscribe((loading: boolean) => this.loading = loading);
		this.store.select('gridSize').subscribe((gridSize: Point) => this.gridSize = gridSize);
		this.store.select('grid').subscribe((grid: void[][]) => this.gridTiles = grid[0]);
		this.store.select('tile').subscribe((tile: Tile[][]) => this.surfaceTiles = tile[0]);
		this.store.select('tray').subscribe((tray: TrayItem[][]) => this.trayItems = tray[0]);
		this.store.select('draggedItemData').subscribe((draggedItemData: CollectionModficationData[] ) => {
			this.draggingFromTray = draggedItemData.length > 0 && draggedItemData[0].collectionKey == "tray";
		});
	}

	registerStreamListeners() {
		this.trayClickStream
			.subscribe(([e,indexPath]: [MouseEvent,number[]]) => {
				const trayDragInfo = new CollectionModficationData();
				trayDragInfo.collectionKey = "tray";
				trayDragInfo.collectionIndex = 0;
				trayDragInfo.path = indexPath;
				if (e.type == "mousedown") {
					this.store.dispatch(new app.DragAction(trayDragInfo));
				}
			});
		this.gridClickStream
			.subscribe(([e,indexPath]: [MouseEvent,number[]]) => {
				if (e.type == "mouseup") {
					indexPath.push(0);
					console.log("lookin for vals")
					const nextCollectionId = this.store.select('tile') /* ? SHOULD BE ARRAY HERE ? */.map(x => x).scan((acc: number,value: number) => acc + 1)
					console.log(nextCollectionId);
					const gridDropInfo = new CollectionModficationData();
					gridDropInfo.collectionKey = "tile";
					gridDropInfo.collectionIndex = 0;
					gridDropInfo.path = [0];
					gridDropInfo.transformArguments = indexPath;
					this.store.dispatch(new app.DragCompleteAction(gridDropInfo));
				}
			});
		this.gridService.layoutInfoStream
			.subscribe(() => { this.store.dispatch(new app.NewLayout(this.gridService.cols*this.gridService.rows)) });
	}
}
