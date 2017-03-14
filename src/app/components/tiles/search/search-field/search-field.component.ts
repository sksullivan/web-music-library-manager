import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css']
})
export class SearchFieldComponent {
	@Input() searchStream: BehaviorSubject<string>;
	@Input() search: string;

	valueChanged(newValue: string) {
		console.log("new search")
		this.searchStream.next(newValue);
	}
}
