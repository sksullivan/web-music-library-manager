import * as app from '../app.actions';
import { YoutubeSearchResults } from '../models/youtube-search-results.model';
import { YoutubeVideo } from '../models/youtube-video.model';
import { SurfaceLayout, Tile } from '../models/surface-layout.model';
import { TrayItem } from '../models/tray-item.model';

export interface State {
  searchQuery: string;
  searchResults: YoutubeSearchResults;
  loading: boolean;
  surfaceLayout: SurfaceLayout;
  trayItems: TrayItem[]
};

const initialState: State = {
  searchQuery: "",
  searchResults: new YoutubeSearchResults(),
  loading: false,
  surfaceLayout: new SurfaceLayout([
    new Tile(0,0,1,1),
    new Tile(1,1,2,2),
  ]),
  trayItems: [
    new TrayItem("search","","fa-search"),
    new TrayItem("playback","","fa-youtube-play"),
    new TrayItem("decks","","💿"),
  ],
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

    case app.ActionTypes.PLACE_TRAY_ITEM: {
      return Object.assign({}, state, {
        placingTrayItem: action.payload,
      });
    }

    case app.ActionTypes.PLACE_TRAY_ITEM_COMPLETE: {
      return Object.assign({}, state, {
        placingTrayItem: undefined,
        surfaceLayout: action.payload,
      });
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