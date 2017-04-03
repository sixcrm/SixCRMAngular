import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'result-item',
  templateUrl: './result-item.component.html',
  styleUrls: ['./result-item.component.scss']
})
export class ResultItemComponent implements OnInit {

  @Input() id: string;
  @Input() fields: any = {};
  @Input() entityType: string;
  @Input() queryString: string;

  @Output() showDetails: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  imageSrc(): string {
    return `/assets/images/result-item-${this.entityType}.svg`;
  }

  showDetailsClicked(): void {
    this.showDetails.emit({id: this.id, entityType: this.entityType});
  }
}
