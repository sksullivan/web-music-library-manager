import { Component, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/search.reducer';

import { TileBase } from '../tile-base.model';


@Component({
  selector: 'playback',
  templateUrl: './playback.component.html',
  styleUrls: ['./playback.component.css']
})
export class PlaybackComponent extends TileBase {
	constructor(protected store: Store<fromRoot.State>, protected collectionIndices: number[]) {
		super(store,collectionIndices);
	}
}
