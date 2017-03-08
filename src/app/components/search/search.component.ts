import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VideoService } from '../../services/video.service';


@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
	private query: string;
	@Output() onSearch = new EventEmitter<string>()

	search() {
		this.onSearch.emit(this.query)
	}
}
