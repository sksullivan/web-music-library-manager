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
	grid: void[][];
	tray: TrayItem[][];
	tile: Tile[][];
	song: void[][];
	search: string[][];
	draggedItemData: CollectionModficationData[];
};

const initialState: State = {
	searchQuery: "",
	searchResults: new YoutubeSearchResults(),
	loading: false,

	grid: [[]],
	tray: [
		[
			new TrayItem("search","SearchComponent",["search","song"],"fa-search"),
			new TrayItem("playback","PlaybackComponent",[],"fa-youtube-play"),
			new TrayItem("decks","PlaybackComponent",[],"💿"),
			new TrayItem("list","ResultsListComponent",["song"],"fa-list"),
		],
	],
	tile: [[]],
	song: [],
	search: [[]],

	draggedItemData: [],
};

export {
	State,
	initialState,
}