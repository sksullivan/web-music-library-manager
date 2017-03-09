import { BehaviorSubject } from 'rxjs';

import { Component, Input } from '@angular/core';

import { TrayItem } from '../../models/tray-item.model';


@Component({
  selector: 'tray',
  templateUrl: './tray.component.html',
  styleUrls: ['./tray.component.css']
})
export class TrayComponent {
	@Input() items: [TrayItem];
	@Input() selectionStream: BehaviorSubject<string>;

	// valueChanged(newValue: string) {
	// 	this.valueStream.next(newValue);
	// }
}
