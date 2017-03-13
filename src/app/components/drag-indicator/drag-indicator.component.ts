import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { TrayItem } from '../../models/tray-item.model';
import { Song } from '../../models/song.model';


@Component({
  selector: 'drag-indicator',
  templateUrl: './drag-indicator.component.html',
  styleUrls: ['./drag-indicator.component.css']
})
export class DragIndicatorComponent {
	@Input() itemCount: number;
}
