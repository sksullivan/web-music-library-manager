import { Component, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ReflectiveInjector, Injector } from '@angular/core';
import { Subject } from 'rxjs';

import { Tile } from '../../models/tile.model';
import { PlaybackComponent } from '../tiles/playback/playback.component';
import { SearchComponent } from '../tiles/search/search.component';


@Component({
  selector: 'tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css'],
})
export class TileComponent {
	@Input() model: Tile;

	@ViewChild('target',{ read: ViewContainerRef }) target: ViewContainerRef;
	private componentRef: ComponentRef<any>;

	constructor(private compiler: ComponentFactoryResolver, private injector: Injector) { }

	private children = {
		PlaybackComponent: PlaybackComponent,
		SearchComponent: SearchComponent,
	};

	renderComponent() {
		if (this.componentRef) {
			this.componentRef.instance.collectionIndex = this.model.collectionIndex;
		}
	}

	ngAfterContentInit() {
		console.log("Injecting new widget...");
		console.log(this.model.componentName);
		const childComponent = this.children[this.model.componentName];
		const componentFactory = this.compiler.resolveComponentFactory(childComponent);
		const resolvedProviders = ReflectiveInjector.resolve([{ provide: Number, useValue: this.model.collectionIndex }]);
		const injector =  ReflectiveInjector.fromResolvedProviders(resolvedProviders, this.injector);
		this.componentRef = this.target.createComponent(componentFactory,undefined,injector);
		this.renderComponent();
	}

	ngOnChanges(changes: Object) {
		this.renderComponent();
	}
}
