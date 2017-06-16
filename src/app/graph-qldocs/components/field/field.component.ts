import { Component, OnInit, Input } from '@angular/core';
import {Field} from '../../models/field.model';
import {navigateToField} from '../../utils'

@Component({
  selector: 'doc-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  @Input() field: Field;

  constructor() { }

  ngOnInit() { }

  nav(): void {
    navigateToField(this.field.type);
  }
}
