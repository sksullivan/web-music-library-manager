import { Component, EventEmitter, Input, Output } from '@angular/core';

import { YoutubeSearchResults } from '../../models/youtube-search-results.model';


@Component({
  selector: 'results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.css']
})
export class ResultsListComponent {
	@Input() results: YoutubeSearchResults;
	@Input() loading: boolean;
}
