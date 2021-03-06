import * as app from '../app.actions';
import { YoutubeSearchResults } from '../models/youtube-search-results.model';
import { YoutubeVideo } from '../models/youtube-video.model';
import { Point } from '../models/geom.model';
import { Tile } from '../models/tile.model';
import { Song } from '../models/song.model';
import { TrayItem } from '../models/tray-item.model';
import { State, initialState } from '../models/app.model';
import { CollectionModficationData } from '../models/collection-modification-data.model';


const allowedDragOperations = {
	"tray": ["tray","tile"],
	"song": ["song"],
	"tile": ["tile"],
};

export function reducer(state = initialState, action: app.Actions): State {
	console.log(action)
	console.log(state)
	switch (action.type) {
		case app.ActionTypes.SEARCH_COMPLETE: {
			const data = <CollectionModficationData>action.payload;
			console.log(data)

			state['song'][data.collectionIndex] = data.transformArguments;

			const newState = {};
			newState['song'] = Object.assign({}, state['song']);
			console.log("About to be new state is")
			console.log(newState)

			return Object.assign({}, state, newState);
		}

		case app.ActionTypes.SEARCH: {
			const data = <CollectionModficationData>action.payload;
			state['search'][data.collectionIndex] = data.transformArguments;
			state['search'][data.collectionIndex] = [].concat(state['search'][data.collectionIndex]);

			return Object.assign({}, state, {
				search: state['search'][data.collectionIndex]
			});
		}

		case app.ActionTypes.RENAME_LIST: {
			let newList = state['song'][action.payload];
			if (!newList) {
				newList = [];
			}
			state['song'][action.payload] = newList;

			return Object.assign({}, state, {
				song: state['song'],
			});
		}

		case app.ActionTypes.DELETE_LIST: {
			console.log("DELETING LIST")
			console.log(action.payload)
			state['tile']['base'].splice(action.payload,1);

			return Object.assign({}, state, {
				tile: state['tile'],
			});
		}

		case app.ActionTypes.DRAG: {
			const data = <CollectionModficationData>action.payload;

			if ((state.draggedItemData.length > 0 && data.collectionKey != state.draggedItemData[0].collectionKey) || (state.draggedItemData.length > 0 && (state.draggedItemData[0].collectionKey == "tray" && data.collectionKey == "tray"))) {
				console.log("CANCELING SELECTION")
				return Object.assign({}, state, {
					accumulatedDragSourceData: []
				});
			}

			if (state.draggedItemData.filter(item => item.collectionIndex == data.collectionIndex && item.collectionKey == data.collectionKey && item.path[0] == data.path[0]).length > 0) {
				return state;
			}

			console.log("DRAG STARTED")
			state.draggedItemData = state.draggedItemData.concat([data]);
			console.log(state.draggedItemData.map(x => x.path[0]));

			return Object.assign({}, state, {
				draggedItemData: state.draggedItemData,
			});
		}

		case app.ActionTypes.DRAG_COMPLETE: {
			const data = <CollectionModficationData>action.payload

			if (state.draggedItemData.length < 1) {
				console.log("ignoring drag completion because there are no dragged items")
				return state;
			}

			const sourceCollectionKey = state.draggedItemData[0].collectionKey;

			console.log("DRAG ENDED");
			console.log(sourceCollectionKey+" -> "+data.collectionKey);
			console.log("target path: "+data.path[0])
			console.log("target args: ");
			console.log(data.transformArguments);
			console.log("source paths: ");
			console.log(state.draggedItemData.map(x => x.path[0]));

			if (sourceCollectionKey == "tile" && data.collectionKey == "tile" && tileDragDoesNotChange(state.tile["base"],state.draggedItemData,data.transformArguments)) {
				console.log("ignoring drag completion because")
				console.log("TILE drag op doesn't change anything")
				return state;
			}

			if (!(sourceCollectionKey == "tile" && data.collectionKey == "tile") && state.draggedItemData.filter(item => item.collectionIndex == data.collectionIndex && item.collectionKey == data.collectionKey && item.path[0] == data.path[0]).length > 0) {
				console.log("ignoring drag completion because")
				console.log("drag op doesn't change anything")
				return state;
			}

			if (!allowedDragOperations[sourceCollectionKey].includes(data.collectionKey)) {
				console.log("ignoring drag completion because")
				console.log(sourceCollectionKey+" cannot be dragged to "+data.collectionKey);
				return Object.assign({}, state, {
					draggedItemData: [],
				});
			}

			const oldDraggedItemData = state.draggedItemData;
			const draggedItems = state.draggedItemData
				.map(itemData => state[sourceCollectionKey][itemData.collectionIndex].atIndexPath(itemData.path));

			const collectionIndices = <number[]>{};
			if (sourceCollectionKey == "tray") {
				console.log("About to make new collections for tile")
				draggedItems[0].requiredCollectionKeys.map((key: string) => {
					console.log("creating")
					console.log(key)
					collectionIndices[key] = Object.keys(state[key]).length.toString();
					state[key][collectionIndices[key]] = [];
				});
			}

			const targetCollection = state[data.collectionKey][data.collectionIndex] || [];

			if (sourceCollectionKey == "tile" && data.collectionKey == "tile") {
				console.log("setting arg [2] from draggedData's last type")
				data.transformArguments[2] = state.draggedItemData[0].transformArguments[0];
				
				console.log("replacing instead of inserting for tile self drag")
				transform(sourceCollectionKey,data.collectionKey,draggedItems,data.transformArguments,undefined);
				state[data.collectionKey][data.collectionIndex] = targetCollection;
			} else {	
				const newItemsArray = targetCollection
					.injectArray(data.path,
						transform(sourceCollectionKey,data.collectionKey,draggedItems,data.transformArguments,collectionIndices));
				state[data.collectionKey][data.collectionIndex] = newItemsArray;
			}
			console.log(state)


			if (sourceCollectionKey == "song") {
				state.draggedItemData.map(itemData => {
					state[sourceCollectionKey][itemData.collectionIndex][itemData.path[0]] = null;
				});
				state.draggedItemData.map(itemData => {
					state[sourceCollectionKey][itemData.collectionIndex] = state[sourceCollectionKey][itemData.collectionIndex].filter(x => x != null);
				});
			}

			const isTraySelfDrag = sourceCollectionKey == "tray" && data.collectionKey == "tray";
			const keysEqual = sourceCollectionKey == data.collectionKey
			const indicesEqual = state.draggedItemData[state.draggedItemData.length-1].collectionIndex == data.collectionIndex;
			const pathsEqual = state.draggedItemData[state.draggedItemData.length-1].path[0] == data.path[0];
			const isNoChangeSongDrag = keysEqual && indicesEqual && pathsEqual;
			
			console.log("clearing dragged items")
			state.draggedItemData = [];
			
			// if (data.collectionKey == "song" && sourceCollectionKey == "song") {
			// 	Array.from(new Array(draggedItems.length),(x,i) => i)
			// 		.map(i => {
			// 			const targetModificationData = new CollectionModficationData();;
			// 			targetModificationData.collectionKey = data.collectionKey;
			// 			targetModificationData.collectionIndex = data.collectionIndex;
			// 			targetModificationData.path = [data.path[0]+i];
			// 			state.draggedItemData.push(targetModificationData);
			// 		});
			// }

			const newState = <State>{};

			newState.draggedItemData = [].concat(state.draggedItemData);
			newState[data.collectionKey] = Object.assign({}, state[data.collectionKey]);
			newState[sourceCollectionKey] = Object.assign({}, state[sourceCollectionKey]);
			console.log(newState)

			return Object.assign({}, state, newState);
		}

		case app.ActionTypes.NEW_LAYOUT: {
			return Object.assign({}, state, {
				grid: { "base": <void[]>(new Array(action.payload)) },
			});
		}

		default: {
			console.log("UNRECOGNIZED ACTION SENT TO STORE")
			return state;
		}
	}
}

function transform(sourceType: string, targetType: string, items: TrayItem[], args: any[], collectionIndices: number[]): void[]|TrayItem[]  {
	let transformFn = (x: any) => x;
	if (sourceType == "tray" && targetType == "tile") {
		transformFn = (trayItem:TrayItem) => new Tile(args[0],args[1],1,1,trayItem.componentName,collectionIndices);
	} else if (sourceType == "tile" && targetType == "tile") {
		transformFn = (tile:Tile) => {
			console.log("args")
			console.log(args)
			if (args[2] == "move") {
				tile.origin.x = args[0]-tile.relativeExtent.x+1;
				tile.origin.y = args[1]-tile.relativeExtent.y+1;
			} else {
				tile.relativeExtent.x = args[0]-tile.origin.x+1;
				tile.relativeExtent.y = args[1]-tile.origin.y+1;
			}
			return tile;
		};
	}
	return items.map(transformFn);
}

function tileDragDoesNotChange(existingTiles: Tile[], draggedTileData: CollectionModficationData[], targetArgs: number[]): boolean {
	const occupiedGrid = existingTiles
		.map(tile => {
			return [].range(tile.relativeExtent.x).map((xOffset: number) => {
				return [].range(tile.relativeExtent.y).map((yOffset: number) => {
					return [tile.origin.x+xOffset,tile.origin.y+yOffset];
				});
			});
		});
	console.log(occupiedGrid);
	if (occupiedGrid.filter(occupiedCell => occupiedCell.x == targetArgs[0] && occupiedCell.y == targetArgs[1]).length > 0) {
		console.log("ignoring because that cell is occupied")
		return true;
	}
	console.log("target cell is clear")
	return false;
}

Array.prototype.range = function(n): Number[] {
	return Array.from(new Array(n),(x,i)=>i);
}

Array.prototype.injectArray = function(idx: number, arr: any[]) {
    return this.slice(0,idx).concat(arr).concat(this.slice(idx));
};

Array.prototype.atIndexPath = function(path: number[]) {
	let segment = this;
	for (let pathComponent of path) {
		segment = segment[pathComponent];
	}
	return segment;
}