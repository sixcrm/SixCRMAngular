import {Component, OnInit, EventEmitter} from '@angular/core';
import {Input, Output} from '@angular/core/src/metadata/directives';

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
