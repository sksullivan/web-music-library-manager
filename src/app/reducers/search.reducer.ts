import * as app from '../app.actions';
import { YoutubeSearchResults } from '../models/youtube-search-results.model';
import { YoutubeVideo } from '../models/youtube-video.model';

export interface State {
  searchQuery: string;
  searchResults: YoutubeSearchResults;
  loading: boolean;
};

const initialState: State = {
  searchQuery: "",
  searchResults: new YoutubeSearchResults(),
  loading: false
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

    default: {
      return state;
    }
  }
}