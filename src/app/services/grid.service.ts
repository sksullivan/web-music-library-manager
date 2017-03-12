import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { Point } from '../models/geom.model';


@Injectable()
export class GridService {
	rows: number;
	cols = 6;
	cellWidth: number;
	cellHeight: number;
	cellPadding = 18;
	cellBorderWidth = 3;

	layoutInfoStream = new ReplaySubject<void>();

	constructor() {
		this.layout();
		this.layoutInfoStream.next();
	}

	layout() {
		const windowHeight = window.innerHeight;
		const windowWidth = window.innerWidth;
		this.rows = Math.ceil(windowHeight*this.cols/windowWidth);
		this.cellWidth = windowWidth/this.cols-2*this.cellPadding;
		this.cellHeight = windowHeight/this.rows-2*this.cellPadding;
	}
}