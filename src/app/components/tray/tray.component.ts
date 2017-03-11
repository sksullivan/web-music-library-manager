import { Subject } from 'rxjs';
import { Component, Input } from '@angular/core';

import { TrayItem } from '../../models/tray-item.model';


@Component({
  selector: 'tray',
  templateUrl: './tray.component.html',
  styleUrls: ['./tray.component.css']
})
export class TrayComponent {
	@Input() items: [TrayItem];
	@Input() clickStream: Subject<[MouseEvent,number[]]>;

	onMouseDown(e: MouseEvent) {
		this.clickStream.next([e,[this.indexOf(e)]])
	}

	indexOf(e: MouseEvent) {
		return parseInt(e.target.getAttribute('data-index'));
	}
}
