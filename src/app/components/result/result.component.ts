import { Component, EventEmitter, Input, Output } from '@angular/core';

import { YoutubeVideo } from '../../models/youtube-video.model';


@Component({
  selector: 'result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
	@Input() video: YoutubeVideo;
}
