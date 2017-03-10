import * as app from '../app.actions';
import { YoutubeSearchResults } from '../models/youtube-search-results.model';
import { YoutubeVideo } from '../models/youtube-video.model';
import { Point, SurfaceLayout, Tile } from '../models/surface-layout.model';
import { TrayItem } from '../models/tray-item.model';


export interface State {
	searchQuery: string;
	searchResults: YoutubeSearchResults;
	loading: boolean;
	grid: void[][];
	tray: TrayItem[][];
	tile: Tile[][];
	song: void[][];
	gridSize: Point;
	dragSourcePaths: number[][];
	dragSourceType: string;
};


const NUM_COLS = 6;
const GRID_CELL_PADDING = 18;
const surfaceHeight = window.innerHeight;
const surfaceWidth = window.innerWidth;

const scaleHeight = Math.ceil(surfaceHeight*NUM_COLS/surfaceWidth);
const scaleWidth = NUM_COLS;

const gridSize = new Point(surfaceWidth/scaleWidth-2*GRID_CELL_PADDING,surfaceHeight/scaleHeight-2*GRID_CELL_PADDING);

const initialState: State = {
	searchQuery: "",
	searchResults: new YoutubeSearchResults(),
	loading: false,
	grid: [<void[]>(new Array(scaleWidth*scaleHeight))],
	tray: [
		[
			new TrayItem("search","","fa-search"),
			new TrayItem("playback","","fa-youtube-play"),
			new TrayItem("decks","","💿"),
		],
	],
	tile: [
		[
			new Tile(0,0,1,1),
			new Tile(1,1,2,2),
		]
	],
	song: [],
	gridSize: new Point(gridSize.x,gridSize.y),
	dragSourcePaths: [],
	dragSourceType: "",
};

export function reducer(state = initialState, action: app.Actions): State {
	switch (action.type) {
		case app.ActionTypes.SEARCH_COMPLETE: {

			return Object.assign({}, state, {
				searchResults: action.payload,
				loading: false
			});
		}

		case app.ActionTypes.SEARCH: {
			let shouldDisplayLoading = false;
			if (state.searchResults.items.length == 0) {
				shouldDisplayLoading = true;
			}

			return Object.assign({}, state, {
				searchQuery: action.payload,
				loading: shouldDisplayLoading
			});
		}

		case app.ActionTypes.DRAG: {
			
			if (state.dragSourceType != "" && action.payload[0] != state.dragSourceType) {
				console.log("CANCEL SELECTION")
				return Object.assign({}, state, {
					dragSourceType: "",
					dragSourcePaths: [],
				});
			}
			console.log("DRAG")
			state.dragSourcePaths.push(action.payload[1])
			return Object.assign({}, state, {
				dragSourceType: action.payload[0],
				dragSourcePaths: state.dragSourcePaths,
			});
		}

		case app.ActionTypes.DRAG_COMPLETE: {
			if (state.dragSourceType == "" ) {
				return state;
			}
			console.log("COMPLETE")
			console.log("inserting into")
			console.log(action.payload[0])
			console.log("from")
			console.log(state.dragSourceType);

			let newState = {
				dragSourceType: "",
				dragSourcePaths: <number[][]>[],
			};
			
			const draggedItemsRaw = state.dragSourcePaths
				.map(path => state[state.dragSourceType][path[0]][path[1]])

			const draggedItems = draggedItemsRaw.reduce((prev,curr) => {
					prev.push(curr)
					return prev
				},[])

			if (action.payload[0] == "grid") {
				action.payload[0] = "tile";
			}
			const newItemsArray = state[action.payload[0]][action.payload[1][0]].injectArray(action.payload[1][1],transform(state.dragSourceType,action.payload[0],draggedItems,state.dragSourcePaths))
			state[action.payload[0]][action.payload[1][0]] = newItemsArray;

			newState[action.payload[0]] = [].concat(state[action.payload[0]]);
			return Object.assign({}, state, newState);
		}

		case app.ActionTypes.RESIZE_SURFACE_ITEM: {
			return Object.assign({}, state, {
				resizingTrayItem: action.payload,
			});
		}

		case app.ActionTypes.RESIZE_SURFACE_ITEM_COMPLETE: {
			return Object.assign({}, state, {
				resizingTrayItem: undefined,
				surfaceLayout: action.payload,
			});
		}

		default: {
			return state;
		}
	}
}

function transform(sourceType: string, targetType: string, items: TrayItem[], indexPaths: number[][]): void[]|TrayItem[]  {
	let transformFn = x => x;
	if (sourceType == "tray" && targetType == "tile") {
		transformFn = ([trayItem,indexPath]:[TrayItem,number[]]) => new Tile(3,0,1,1);
	}
	const mergedItemsPaths = items.map((item: void|TrayItem) => [item,indexPaths[items.indexOf(<TrayItem>item)]]);
	return mergedItemsPaths.map(transformFn);
}

Array.prototype.injectArray = function( idx, arr ) {
    return this.slice( 0, idx ).concat( arr ).concat( this.slice( idx ) );
};