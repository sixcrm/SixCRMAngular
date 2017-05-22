import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {Currency} from '../../../shared/utils/currency/currency';

@Component({
  selector: 'result-item-table',
  templateUrl: './result-item-table.component.html',
  styleUrls: ['./result-item-table.component.scss']
})
export class ResultItemTableComponent implements OnInit {

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

  showDetailsClicked(): void {
    this.showDetails.emit({id: this.id, entityType: this.entityType});
  }

  imageSrc(): string {
    return `/assets/images/result-item-${this.entityType}.svg`;
  }

  formatCurrency(value): string {
    return new Currency(value).usd();
  }
}
