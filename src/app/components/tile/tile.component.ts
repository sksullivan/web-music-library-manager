import { Component, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ReflectiveInjector, Injector, ValueProvider } from '@angular/core';
import { Subject } from 'rxjs';

import { Tile } from '../../models/tile.model';
import { PlaybackComponent } from '../tiles/playback/playback.component';
import { SearchComponent } from '../tiles/search/search.component';
import { ResultsListComponent } from '../tiles/search/results-list/results-list.component';
import { CollectionIndices } from '../../models/collection-indices.model';


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
		ResultsListComponent: ResultsListComponent,
	};

	renderComponent() {
		if (this.componentRef) {
			this.componentRef.instance.collectionIndex = this.model.collectionIndices;
		}
	}

	ngAfterContentInit() {
		console.log("Injecting new widget...");
		console.log(this.model.componentName);
		console.log(typeof {})
		const childComponent = this.children[this.model.componentName];
		const componentFactory = this.compiler.resolveComponentFactory(childComponent);
		const collectionIndicesProvider = <ValueProvider>{};
		collectionIndicesProvider.provide = Array;
		collectionIndicesProvider.useValue = this.model.collectionIndices;
		const resolvedProviders = ReflectiveInjector.resolve([collectionIndicesProvider]);
		const injector =  ReflectiveInjector.fromResolvedProviders(resolvedProviders, this.injector);
		this.componentRef = this.target.createComponent(componentFactory,undefined,injector);
		this.renderComponent();
	}

	ngOnChanges(changes: Object) {
		this.renderComponent();
	}
}
