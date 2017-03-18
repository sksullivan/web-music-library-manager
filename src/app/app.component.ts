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
import { selectors, State } from './models/app.model';

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
	private tilesClickStream = new Subject<[MouseEvent,number,string]>();
	private trayItems: TrayItem[];
	private mouseLocation = new Point(0,0);
	private gridSize: Point;
	private draggingFromTray: boolean = false;
	private resizingOrMovingTile: boolean = false;
	private draggedItemCount = 0;
	private firstDraggedCollectionIndex: number;
	private proposedTile = new Tile(0,0,1,1,'',[]);
	private gridHoverStream = new Subject<[MouseEvent,number[]]>();

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
			this.draggedItemCount = draggedItemData.length;
			console.log('set draggedItemCollectionIndex')
			if (draggedItemData.length > 0) {
				this.firstDraggedCollectionIndex = draggedItemData[0].path;
			} else {
				this.firstDraggedCollectionIndex = -1;
			}

			console.log("Now have "+draggedItemData.length+" dragged items.");
			console.log("dragged collection index is: "+this.firstDraggedCollectionIndex)
			this.store.take(1).subscribe(state => {
				this.draggingFromTray = selectors.isDraggingFromTray(state);
				this.resizingOrMovingTile = selectors.isDraggingTile(state) || selectors.isResizingTile(state);
			});
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
					const gridDropInfo = new CollectionModficationData();
					gridDropInfo.collectionKey = "tile";
					gridDropInfo.collectionIndex = 0;
					gridDropInfo.path = [0];
					gridDropInfo.transformArguments = indexPath;
					this.store.dispatch(new app.DragCompleteAction(gridDropInfo));
				}
			});
		this.gridService.layoutInfoStream
			.subscribe(() => this.store.dispatch(new app.NewLayout(this.gridService.cols*this.gridService.rows)));
		this.tilesClickStream
			.subscribe(([e,indexPath,type]: [MouseEvent,number,string]) => {
				const gridDragInfo = new CollectionModficationData();
				gridDragInfo.collectionKey = "tile";
				gridDragInfo.collectionIndex = 0;
				gridDragInfo.path = [indexPath];
				gridDragInfo.transformArguments = [type];
				if (e.type == 'mousedown') {
					this.store.dispatch(new app.DragAction(gridDragInfo));
				} else {
					// gridDragInfo.transformArguments = 
				}
			});
		this.gridHoverStream.subscribe(([e,indexPath]: [MouseEvent,number[]]) => {
			if (this.resizingOrMovingTile) {
				this.store.take(1).subscribe((state: State) => {
					const existingTile = <Tile>selectors.firstDraggedItem(state);

					if (state.draggedItemData[0].transformArguments[0] == 'resize') {
						this.proposedTile.origin.x = existingTile.origin.x;
						this.proposedTile.origin.y = existingTile.origin.y;

						this.proposedTile.relativeExtent.x = indexPath[0] - existingTile.origin.x + 1;
						this.proposedTile.relativeExtent.y = indexPath[1] - existingTile.origin.y + 1; 
					} else {
						this.proposedTile.origin.x = indexPath[0] - existingTile.relativeExtent.x + 1;
						this.proposedTile.origin.y = indexPath[1] - existingTile.relativeExtent.y + 1;

						this.proposedTile.relativeExtent.x = existingTile.relativeExtent.x;
						this.proposedTile.relativeExtent.y = existingTile.relativeExtent.y; 
					}
				});
			}
		})
	}
}
