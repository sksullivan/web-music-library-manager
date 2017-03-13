import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Song } from '../../../../models/song.model';


@Component({
  selector: 'result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
	@Input() song: Song;
}
