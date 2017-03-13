import { Point } from './geom.model';


export class Tile {
	origin: Point;
	relativeExtent: Point;
	componentName: string;
	collectionIndex: number;

	constructor(originX: number, originY: number, extentX: number, extentY: number, componentName: string, collectionIndex: number) {
		this.origin = new Point(originX,originY);
		this.relativeExtent = new Point(extentX,extentY);
		this.componentName = componentName;
		this.collectionIndex = collectionIndex;
	}
}