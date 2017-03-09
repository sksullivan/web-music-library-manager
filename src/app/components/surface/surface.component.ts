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
		})),
		transition('false => true', animate('100ms ease')),
		transition('true => false', animate('100ms ease'))
		])
   ],
})
export class SurfaceComponent {
	private NUM_COLS = 6;
	private CELL_PADDING = 15;

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
