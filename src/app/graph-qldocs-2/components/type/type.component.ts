import { Component, OnInit, Input } from '@angular/core';
import {Type} from '../../models/type.model';
import {Field} from "../../models/field.model";

@Component({
  selector: 'doc-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit {

  @Input() type: Type;
  @Input() otherTypes: Type;
  @Input() field: Field;
  @Input() isQuery: boolean;
  @Input() isMutation: boolean;
  @Input() isAll: boolean;
  @Input() isType: boolean;

  constructor() { }

  ngOnInit() { }

}
