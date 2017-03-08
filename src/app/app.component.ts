import { Component, Injectable } from '@angular/core';
import { Http } from "@angular/http";

import { VideoService } from './services/video.service';

import { Store } from '@ngrx/store';
import * as fromRoot from './reducers/search.reducer';
import * as app from './app.actions';

import '../assets/css/styles.css';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [VideoService]
})

@Injectable()
export class AppComponent {
	private searchResults = [1,2,3,4];

	constructor(private videoService: VideoService, private store: Store<fromRoot.State>) { }

	search(query: string) {
		this.store.dispatch(new app.SearchAction("hello world"));
		this.videoService.fetchVideos(query).subscribe(data => console.log(data));
	}
}
