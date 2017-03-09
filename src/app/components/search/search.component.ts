import { BehaviorSubject } from 'rxjs';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VideoService } from '../../services/video.service';


@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
	private value: string;
	@Input() valueStream: BehaviorSubject<string>;

	valueChanged(newValue: string) {
		this.valueStream.next(newValue);
	}
}
