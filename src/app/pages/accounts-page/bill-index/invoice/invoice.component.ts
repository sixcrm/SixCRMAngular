import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Bill} from '../../../../shared/models/bill.model';
import {AuthenticationService} from '../../../../authentication/authentication.service';

@Component({
  selector: 'invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  @Input() bill: Bill;
  @Output() update: EventEmitter<Bill> = new EventEmitter();

  collapsed: boolean = true;

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
  }

}
