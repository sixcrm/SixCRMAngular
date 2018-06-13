import {Component, OnInit, Input} from '@angular/core';
import {Rebill} from '../../../../shared/models/rebill.model';

@Component({
  selector: 'info-table',
  templateUrl: './info-table.component.html',
  styleUrls: ['./info-table.component.scss']
})
export class InfoTableComponent implements OnInit {

  @Input() rebill: Rebill;
  @Input() columnStyle: boolean;

  constructor() { }

  ngOnInit() {
  }

  calculateCycle() {
    return 0;
  }

}
