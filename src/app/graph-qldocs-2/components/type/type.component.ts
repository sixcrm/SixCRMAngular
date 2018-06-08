import { Component, OnInit, Input } from '@angular/core';
import {Type} from '../../models/type.model';
import {environment} from '../../../../environments/environment';
import {Field} from "../../models/field.model";

@Component({
  selector: 'doc-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit {

  @Input() type: Type;
  @Input() field: Field;
  @Input() isQuery: boolean;
  @Input() isMutation: boolean;
  @Input() isAll: boolean;
  @Input() isType: boolean;

  show: boolean = true;

  constructor() { }

  ngOnInit() { }

}
