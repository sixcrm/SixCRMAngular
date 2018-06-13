import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';

@Component({
  selector: 'rebill-expanded-details',
  templateUrl: './rebill-expanded-details.component.html',
  styleUrls: ['./rebill-expanded-details.component.scss']
})
export class RebillExpandedDetailsComponent implements OnInit {

  @Input() rebill: Rebill;

  @Output() backButtonSelected: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
