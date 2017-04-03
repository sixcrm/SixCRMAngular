import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'result-item-details',
  templateUrl: './result-item-details.component.html',
  styleUrls: ['./result-item-details.component.scss']
})
export class ResultItemDetailsComponent implements OnInit {

  @Input() entityType: string;
  @Input() id: string;
  @Output() closeDetails: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  close(): void {
    this.closeDetails.emit(true);
  }

}
