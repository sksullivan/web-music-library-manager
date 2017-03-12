import * as app from '../app.actions';
import { YoutubeSearchResults } from '../models/youtube-search-results.model';
import { YoutubeVideo } from '../models/youtube-video.model';
import { Point } from '../models/geom.model';
import { Tile } from '../models/tile.model';
import { Song } from '../models/song.model';
import { TrayItem } from '../models/tray-item.model';
import { State, initialState } from '../models/app.model';
import { CollectionModficationData } from '../models/collection-modification-data.model';


export function reducer(state = initialState, action: app.Actions): State {
	console.log(action)
	console.log(state)
	switch (action.type) {
		case app.ActionTypes.SEARCH_COMPLETE: {
			const data = <CollectionModficationData>action.payload;
			console.log(data)

			state['song'][data.collectionIndex] = data.transformArguments;
				
			const newState = {};
			newState['song'] = [].concat(state['song']);
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

		case app.ActionTypes.DRAG: {
			const data = <CollectionModficationData>action.payload;
			if (state.draggedItemData.length > 0 && data.collectionKey != state.draggedItemData[0].collectionKey) {
				console.log("CANCELING SELECTION")
				return Object.assign({}, state, {
					accumulatedDragSourceData: []
				});
			}
			console.log("DRAG STARTED")
			state.draggedItemData = state.draggedItemData.concat([data]);
			return Object.assign({}, state, {
				draggedItemData: state.draggedItemData,
			});
		}

		case app.ActionTypes.DRAG_COMPLETE: {
			const data = <CollectionModficationData>action.payload

			if (state.draggedItemData.length < 1) {
				return state;
			}
			const sourceCollectionKey = state.draggedItemData[0].collectionKey;


			console.log("DRAG ENDED");
			console.log("from");
			console.log(sourceCollectionKey);
			console.log("to");
			console.log(data.collectionKey);
			console.log(data)
			
			const draggedItemsRaw = state.draggedItemData
				.map(itemData => state[sourceCollectionKey][itemData.collectionIndex].atIndexPath(itemData.path));

			const draggedItems = draggedItemsRaw.reduce((prev,curr) => {
					prev.push(curr)
					return prev
				},[])

			const targetCollection = state[data.collectionKey][data.collectionIndex];

			console.log("inserting new stuff at path")
			console.log(data.path)
			const newItemsArray = targetCollection
				.injectArray(data.path,
					transform(sourceCollectionKey,data.collectionKey,draggedItems,data.transformArguments,targetCollection.length));

			state[data.collectionKey][data.collectionIndex] = newItemsArray;

			state.draggedItemData = [];

			const newState = {};
			newState[data.collectionKey] = [];
			newState[data.collectionKey] = [].concat(state[data.collectionKey]);

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

		case app.ActionTypes.NEW_LAYOUT: {
			return Object.assign({}, state, {
				grid: [<void[]>(new Array(action.payload))],
			});
		}

		default: {
			return state;
		}
	}
}

function transform(sourceType: string, targetType: string, items: TrayItem[], args: number[], collectionIndex: number): void[]|TrayItem[]  {
	let transformFn = (x: any) => x;
	if (sourceType == "tray" && targetType == "tile") {
		transformFn = (trayItem:TrayItem) => new Tile(args[0],args[1],1,1,trayItem.componentName,collectionIndex);
	}
	return items.map(transformFn);
}

Array.prototype.injectArray = function( idx, arr ) {
    return this.slice( 0, idx ).concat( arr ).concat( this.slice( idx ) );
};

Array.prototype.atIndexPath = function(path) {
	let segment = this;
	for (let pathComponent of path) {
		segment = segment[pathComponent];
	}
	return segment;
}