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
				// boxShadow: 'inset 0px 0px 0px rgba(0,0,0,0.48)',
				border: '3px rgba(0,0,0,0) solid',
				backgroundColor: '#56494e',
			})),
			state('true', style({
				paddingLeft: '15px',
				paddingRight: '15px',
				paddingTop: '15px',
				paddingBottom: '15px',
				marginLeft: '0px',
				marginRight: '0px',
				marginTop: '0px',
				marginBottom: '0px',
				borderRadius: '15px',
				// boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.48)',
				border: '3px rgba(0,0,0,0) solid',
				backgroundColor: '#56494e',
			})),
			transition('false => true', animate('700ms ease-in-out')),
			transition('true => false', animate('700ms ease-in-out'))
		]),
	],
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
