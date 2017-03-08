import { Component, EventEmitter, Input, Output } from '@angular/core';

import { YoutubeVideo } from '../../models/youtube-video.model';


@Component({
  selector: 'results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.css']
})
export class ResultsListComponent {
	@Input() results: [YoutubeVideo];
}
