import { Action } from '@ngrx/store';

import { YoutubeSearchResults } from './models/youtube-search-results.model';
import { TrayItem } from './models/tray-item.model';
import { CollectionModficationData } from './models/collection-modification-data.model';


export const ActionTypes = {
  SEARCH:                       'Search',
  SEARCH_COMPLETE:              'Search Complete',
  DRAG:                         'Drag',
  DRAG_COMPLETE:                'Drag Complete',
  RESIZE_SURFACE_ITEM:          'Resize Surface Item',
  RESIZE_SURFACE_ITEM_COMPLETE: 'Resize Surface Item Complete',
  NEW_LAYOUT:                   'New Layout',
};

export class SearchAction implements Action {
  type = ActionTypes.SEARCH;

  constructor(public payload: CollectionModficationData) { }
}

export class SearchCompleteAction implements Action {
  type = ActionTypes.SEARCH_COMPLETE;

  constructor(public payload: CollectionModficationData) { }
}

export class DragAction implements Action {
  type = ActionTypes.DRAG;

  constructor(public payload: CollectionModficationData) { }
}

export class DragCompleteAction implements Action {
  type = ActionTypes.DRAG_COMPLETE;

  constructor(public payload: CollectionModficationData) { }
}

export class ResizeSurfaceItemAction implements Action {
  type = ActionTypes.RESIZE_SURFACE_ITEM;

  constructor() { }
}

export class ResizeSurfaceItemCompleteAction implements Action {
  type = ActionTypes.RESIZE_SURFACE_ITEM_COMPLETE;

  constructor(public payload: any) { }
}

export class NewLayout implements Action {
  type = ActionTypes.NEW_LAYOUT;

  constructor(public payload: number) { }
}

export type Actions
  = SearchAction
  | SearchCompleteAction
  | DragAction
  | DragCompleteAction
  | ResizeSurfaceItemAction
  | ResizeSurfaceItemCompleteAction
  | NewLayout