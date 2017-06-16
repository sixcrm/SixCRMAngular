import {Component, OnInit, Input} from '@angular/core';
import {InputValue} from '../../models/input-value.model';
import {navigateToField} from '../../utils';
import {TypeRef} from '../../models/type-ref.model';

@Component({
  selector: 'doc-input-fields',
  templateUrl: './input-fields.component.html',
  styleUrls: ['./input-fields.component.scss']
})
export class InputFieldsComponent implements OnInit {

  @Input() inputFields: InputValue[] = [];

  constructor() { }

  ngOnInit() { }

  nav(type: TypeRef): void {
    navigateToField(type);
  }

}
