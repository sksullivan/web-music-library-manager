import { Action } from '@ngrx/store';

import { YoutubeSearchResults } from './models/youtube-search-results.model';

export const ActionTypes = {
  SEARCH:           'Search',
  SEARCH_COMPLETE:  'Search Complete',
};

export class SearchAction implements Action {
  type = ActionTypes.SEARCH;

  constructor(public payload: string) { }
}

export class SearchCompleteAction implements Action {
  type = ActionTypes.SEARCH_COMPLETE;

  constructor(public payload: YoutubeSearchResults) { }
}

export type Actions
  = SearchAction
  | SearchCompleteAction