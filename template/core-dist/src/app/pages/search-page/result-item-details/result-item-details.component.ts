import {Component, OnInit, Input, EventEmitter} from '@angular/core';
import {Output} from '@angular/core/src/metadata/directives';

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
