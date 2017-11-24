import {Component, OnInit, Input} from '@angular/core';
import {Rebill} from '../../../../shared/models/rebill.model';
import {Schedule} from '../../../../shared/models/schedule.model';
import {TableMemoryTextOptions} from '../../../components/table-memory/table-memory.component';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../../authentication/authentication.service';

@Component({
  selector: 'state-machine-rebill',
  templateUrl: './state-machine-rebill.component.html',
  styleUrls: ['./state-machine-rebill.component.scss']
})
export class StateMachineRebillComponent implements OnInit {

  @Input() rebill: Rebill;

  textOptions: TableMemoryTextOptions = {
    title: 'Rebill Products',
    viewOptionText: 'View Product'
  };

  columnParams = [
    new ColumnParams('Product Name', (e: Schedule) => e.product.name),
    new ColumnParams('SKU', (e: Schedule) => e.product.sku)
  ];

  constructor(public authService: AuthenticationService, private router: Router) {}

  ngOnInit() {
  }

  getSchedules(): Schedule[] {
    return this.rebill.productSchedules.reduce((a, b) => a.concat(b.schedules), []);
  }

  viewProduct(schedule: Schedule) {
    this.router.navigate(['/products', schedule.product.id]);
  }
}
