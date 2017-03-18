import { YoutubeSearchResults } from '../models/youtube-search-results.model';
import { YoutubeVideo } from '../models/youtube-video.model';
import { Point } from '../models/geom.model';
import { Tile } from '../models/tile.model';
import { TrayItem } from '../models/tray-item.model';
import { CollectionModficationData } from '../models/collection-modification-data.model';


interface State {
	searchQuery: string;
	searchResults: YoutubeSearchResults;
	loading: boolean;
	grid: { [id: string]: void[] };
	tray: { [id: string]: TrayItem[] };
	tile: { [id: string]: Tile[] };
	song: { [id: string]: void[] };
	search: { [id: string]: string[] };
	draggedItemData: CollectionModficationData[];
};

const initialState: State = {
	searchQuery: "",
	searchResults: new YoutubeSearchResults(),
	loading: false,

	grid: { "base": [] },
	tray: {
		"base": [
			new TrayItem("search","SearchComponent",["search","song"],"fa-search"),
			new TrayItem("playback","PlaybackComponent",[],"fa-youtube-play"),
			new TrayItem("decks","PlaybackComponent",[],"💿"),
			new TrayItem("list","ResultsListComponent",["song"],"fa-list"),
		],
	},
	tile: { "base": [] },
	song: {},
	search: {},

	draggedItemData: [],
};

const selectors = {
	isDraggingTile: (state: State) => {
		return state.draggedItemData.length > 0
			&& state.draggedItemData[0].transformArguments !== undefined
			&& state.draggedItemData[0].transformArguments.length > 0
			&& state.draggedItemData[0].transformArguments[0] == "move"
	},
	isResizingTile: (state: State) => {
		return state.draggedItemData.length > 0
			&& state.draggedItemData[0].transformArguments !== undefined
			&& state.draggedItemData[0].transformArguments.length > 0
			&& state.draggedItemData[0].transformArguments[0] == "resize"
	},
	isDraggingGridItem: (state: State) => {
		return state.draggedItemData.length > 0
			&& (state.draggedItemData[0].collectionKey == "tray"
			|| state.draggedItemData[0].collectionKey == "tile");
	},
	firstDraggedItem: (state: State) => state[state.draggedItemData[0].collectionKey][state.draggedItemData[0].collectionIndex][state.draggedItemData[0].path],
}

export {
	State,
	initialState,
	selectors
}