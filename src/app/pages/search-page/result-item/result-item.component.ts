import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {Currency} from '../../../shared/utils/currency/currency';

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

  title: string = '';

  constructor() { }

  ngOnInit() {
    if (this.fields.name) {
      this.title = this.fields.name;
    } else if (this.fields.firstname && this.fields.lastname) {
      this.title = this.fields.firstname + ' ' + this.fields.lastname;
    } else if (this.entityType === 'transaction') {
      this.title = 'Transaction: ' + this.fields.alias;
    }
  }

  imageSrc(): string {
    return `/assets/images/result-item-${this.entityType}.svg`;
  }

  showDetailsClicked(): void {
    this.showDetails.emit({id: this.id, entityType: this.entityType});
  }

  formatCurrency(value): string {
    return new Currency(value).usd();
  }
}
