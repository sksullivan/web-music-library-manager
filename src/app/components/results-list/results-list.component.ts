import { Component, EventEmitter, Input, Output } from '@angular/core';

//import { ResultModel } from '../result/result.model.ts'


@Component({
  selector: 'results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.css']
})
export class ResultsListComponent {
	@Input() results: [any];
}
