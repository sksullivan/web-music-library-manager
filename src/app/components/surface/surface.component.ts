import { Component, Input, trigger, state, style, transition, animate } from '@angular/core';
import { Subject } from 'rxjs';

import { GridService } from '../../services/grid.service';

import { Point } from '../../models/geom.model';
import { Tile } from '../../models/tile.model';


@Component({
	selector: 'surface',
	templateUrl: './surface.component.html',
	styleUrls: ['./surface.component.css'],
})
export class SurfaceComponent {

	@Input() clickStream: Subject<[MouseEvent,number]>;
	@Input() cellSize: Point;
	@Input() items: Tile[];

	constructor(private gridService:GridService) { }

	onMouseUp(e: MouseEvent) {
		this.clickStream.next([e,this.indexOf(e)]);
	}

	onMouseDown(e: MouseEvent) {
		this.clickStream.next([e,this.indexOf(e)]);
	}

	addItemsAtIndex<T>(items: T[], index: number[]): void { }

	indexOf(e: MouseEvent) {
		return parseInt(e.target.getAttribute('data-index'));
	}
}
