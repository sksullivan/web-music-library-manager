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

	@Input() clickStream: Subject<[MouseEvent,number,string]>;
	@Input() shouldReportMouseUps = true;
	@Input() draggedCollectionIndex: number;
	@Input() items: Tile[];
	@Input() proposedTile: Tile;

	constructor(private gridService:GridService) { }

	onMouseUp(e: MouseEvent, type: string) {
		console.log("should we report this mouseup?")
		console.log(this.shouldReportMouseUps)
		if (this.shouldReportMouseUps) {
			//this.clickStream.next([e,this.indexOf(e),type]);
		}
	}

	onMouseDown(e: MouseEvent, type: string) {
		this.clickStream.next([e,this.indexOf(e),type]);
	}

	addItemsAtIndex<T>(items: T[], index: number[]): void { }

	indexOf(e: MouseEvent) {
		return parseInt(e.target.getAttribute('data-index'));
	}
}
