import { Component, EventEmitter, Input, Output, trigger, state, style, transition, animate } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { SurfaceLayout, Tile } from '../../models/surface-layout.model';


@Component({
	selector: 'surface',
	templateUrl: './surface.component.html',
	styleUrls: ['./surface.component.css'],
	animations: [
		trigger('displayCells', [
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
				borderRadius: '35px',
				border: '3px #a29c9b dashed',
				backgroundColor: '#56494e',
			})),
			transition('false => true', animate('300ms ease-in-out')),
			transition('true => false', animate('300ms ease-in-out'))
		]),
		trigger('displayCellHelperIcons', [
			state('false', style({
				opacity: '0.0',
			})),
			state('true', style({
				opacity: '1.0',
			})),
			transition('false => true', animate('300ms ease-in-out')),
			transition('true => false', animate('300ms ease-in-out'))
		]),
	]
})
export class SurfaceComponent {
	private NUM_COLS = 6;
	private CELL_PADDING = 18;

	@Input() surfaceDisplayStream: Subject<boolean>;
	@Input() surfaceLayout: SurfaceLayout;

	private shouldDisplay: boolean;
	private cells = <any[]>[];
	private tiles = <Tile[]>[];

	private cellWidth: number;
	private cellHeight: number;

	constructor() { }

	ngOnInit() {
		this.surfaceDisplayStream.subscribe(shouldDisplay => {
			this.shouldDisplay = shouldDisplay;
		});

		this.setupDisplayCells();
	}

	setupDisplayCells() {
		const surfaceHeight = window.innerHeight;
		const surfaceWidth = window.innerWidth;

		const scaleHeight = Math.ceil(surfaceHeight*this.NUM_COLS/surfaceWidth);
		const scaleWidth = this.NUM_COLS;

		this.cellWidth = surfaceWidth/scaleWidth-2*this.CELL_PADDING;
		this.cellHeight = surfaceHeight/scaleHeight-2*this.CELL_PADDING;
		this.cells = new Array(scaleWidth*scaleHeight);

		console.log("drawing "+this.cells.length+" cells ("+this.cellWidth+","+this.cellHeight+")");
		console.log(scaleWidth+" x "+scaleHeight);
	}

	onClick() {
		this.surfaceDisplayStream.next(false);
	}
}
