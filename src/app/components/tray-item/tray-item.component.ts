import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { TrayItem } from '../../models/tray-item.model';


@Component({
  selector: 'tray-item',
  templateUrl: './tray-item.component.html',
  styleUrls: ['./tray-item.component.css']
})
export class TrayItemComponent {
	@Input() item: TrayItem;
	@Input() selectionStream: Subject<TrayItem>;

	onClick() {
		this.selectionStream.next(this.item);
	}
}
