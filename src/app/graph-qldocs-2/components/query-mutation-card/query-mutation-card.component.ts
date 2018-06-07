import { Component, OnInit, Input } from '@angular/core';
import {Field} from '../../models/field.model';
import {navigateToField} from '../../utils'
import {environment} from '../../../../environments/environment';
import {Type} from '../../models/type.model';

@Component({
  selector: 'query-mutation-card',
  templateUrl: './query-mutation-card.component.html',
  styleUrls: ['./query-mutation-card.component.scss']
})
export class QueryMutationCardComponent implements OnInit {

  @Input() field: Field;
  @Input() type: Type;

  showQueryDetails: boolean = false;

  constructor() { }

  ngOnInit() { }
}
