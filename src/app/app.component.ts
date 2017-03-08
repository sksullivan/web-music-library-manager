import { Component, Injectable } from '@angular/core';
import { Http } from "@angular/http";

import { VideoService } from './services/video.service';

import { Store } from '@ngrx/store';
import * as fromRoot from './reducers/search.reducer';
import * as app from './app.actions';
import { YoutubeSearchResults } from './models/youtube-search-results.model';

import '../assets/css/styles.css';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [VideoService]
})

@Injectable()
export class AppComponent {
	private searchResults: YoutubeSearchResults;
	private loading: boolean;
	private searchResultsSubscription: any;

	constructor(private videoService: VideoService, private store: Store<fromRoot.State>) {
		store.select('searchResults').subscribe((results: YoutubeSearchResults) => { this.searchResults = results });
		store.select('loading').subscribe((loading: boolean) => { this.loading = loading });
	}

	search(query: string) {
		this.store.dispatch(new app.SearchAction(query))
		this.videoService.fetchVideos(query).subscribe(searchResults => this.store.dispatch(new app.SearchCompleteAction(searchResults)));
	}
}
