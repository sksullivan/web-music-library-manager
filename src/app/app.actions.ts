import { Action } from '@ngrx/store';

import { YoutubeResult } from './models/youtube-result.model';

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

  constructor(public payload: [YoutubeResult]) { }
}

export type Actions
  = SearchAction