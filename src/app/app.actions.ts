import { Action } from '@ngrx/store';

import { YoutubeSearchResults } from './models/youtube-search-results.model';
import { TrayItem } from './models/tray-item.model';
import { SurfaceLayout } from './models/surface-layout.model';

export const ActionTypes = {
  SEARCH:                       'Search',
  SEARCH_COMPLETE:              'Search Complete',
  PLACE_TRAY_ITEM:              'Place Tray Item',
  PLACE_TRAY_ITEM_COMPLETE:     'Place Tray Item Complete',
  RESIZE_SURFACE_ITEM:          'Resize Surface Item',
  RESIZE_SURFACE_ITEM_COMPLETE: 'Resize Surface Item Complete',
};

export class SearchAction implements Action {
  type = ActionTypes.SEARCH;

  constructor(public payload: string) { }
}

export class SearchCompleteAction implements Action {
  type = ActionTypes.SEARCH_COMPLETE;

  constructor(public payload: YoutubeSearchResults) { }
}

export class PlaceTrayItemAction implements Action {
  type = ActionTypes.PLACE_TRAY_ITEM;

  constructor(public payload: TrayItem) { }
}

export class PlaceTrayItemCompleteAction implements Action {
  type = ActionTypes.PLACE_TRAY_ITEM_COMPLETE;

  constructor(public payload: SurfaceLayout) { }
}

export class ResizeSurfaceItemAction implements Action {
  type = ActionTypes.RESIZE_SURFACE_ITEM;

  constructor() { }
}

export class ResizeSurfaceItemCompleteAction implements Action {
  type = ActionTypes.RESIZE_SURFACE_ITEM_COMPLETE;

  constructor(public payload: SurfaceLayout) { }
}

export type Actions
  = SearchAction
  | SearchCompleteAction
  | PlaceTrayItemAction
  | PlaceTrayItemCompleteAction
  | ResizeSurfaceItemAction
  | ResizeSurfaceItemCompleteAction