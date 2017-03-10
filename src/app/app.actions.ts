import { Action } from '@ngrx/store';

import { YoutubeSearchResults } from './models/youtube-search-results.model';
import { TrayItem } from './models/tray-item.model';
import { SurfaceLayout } from './models/surface-layout.model';
import { DragSource, DragTarget } from './services/drag';


export const ActionTypes = {
  SEARCH:                       'Search',
  SEARCH_COMPLETE:              'Search Complete',
  DRAG:                         'Drag',
  DRAG_COMPLETE:                'Drag Complete',
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

export class DragAction implements Action {
  type = ActionTypes.DRAG;

  constructor(public payload: [string,number[]]) { }
}

export class DragCompleteAction implements Action {
  type = ActionTypes.DRAG_COMPLETE;

  constructor(public payload: [string,number[]]) { }
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
  | DragAction
  | DragCompleteAction
  | ResizeSurfaceItemAction
  | ResizeSurfaceItemCompleteAction