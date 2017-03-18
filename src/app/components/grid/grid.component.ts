import { Component, Input, trigger, state, style, transition, animate } from '@angular/core';
import { Subject } from 'rxjs';

import { Point } from '../../models/geom.model';
import { GridService } from '../../services/grid.service';


@Component({
	selector: 'grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css'],
	animations: [
		trigger('display', [
			state('false', style({
				paddingLeft: '15px',
				paddingRight: '15px',
				paddingTop: '15px',
				paddingBottom: '15px',
				marginLeft: '0px',
				marginRight: '0px',
				marginTop: '0px',
				marginBottom: '0px',
				borderRadius: '0px',
				border: '3px #56494e solid',
				backgroundColor: '#56494e',
			})),
			state('true', style({
				paddingLeft: '0px',
				paddingRight: '0px',
				paddingTop: '0px',
				paddingBottom: '0px',
				marginLeft: '15px',
				marginRight: '15px',
				marginTop: '15px',
				marginBottom: '15px',
				borderRadius: '15px',
				border: '3px #a29c9b dashed',
				backgroundColor: '#56494e',
			})),
			transition('false => true', animate('300ms ease-in-out')),
			transition('true => false', animate('300ms ease-in-out'))
		]),
	]
})
export class GridComponent {

	@Input() clickStream: Subject<[MouseEvent,number[]]>;
	@Input() hoverStream: Subject<[MouseEvent,number[]]>;
	@Input() cellSize: Point;
	@Input() shouldDisplay: boolean;
	@Input() items: void[];

	constructor (private gridService: GridService) { }

	onMouseUp(e: MouseEvent) {
		const linearIndex = this.indexOf(e);
		this.clickStream.next([e,[linearIndex%this.gridService.cols,Math.floor(linearIndex/this.gridService.cols)]]);
	}

	onMouseDown(e: MouseEvent) {
		const linearIndex = this.indexOf(e);
		this.hoverStream.next([e,[linearIndex%this.gridService.cols,Math.floor(linearIndex/this.gridService.cols)]]);
	}

	onMouseOver(e: MouseEvent) {
		const linearIndex = this.indexOf(e);
		this.hoverStream.next([e,[linearIndex%this.gridService.cols,Math.floor(linearIndex/this.gridService.cols)]]);
	}

	addItemsAtIndex<T>(items: T[], index: number[]): void{}

	indexOf(e: MouseEvent) {
		return parseInt(e.target.getAttribute('data-index'));
	}
}
