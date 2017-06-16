import {Component, OnInit, Input} from '@angular/core';
import {InputValue} from '../../models/input-value.model';
import {navigateToField} from '../../utils'
import {TypeRef} from '../../models/type-ref.model';

@Component({
  selector: 'doc-arguments',
  templateUrl: './arguments.component.html',
  styleUrls: ['./arguments.component.scss']
})
export class ArgumentsComponent implements OnInit {

  @Input() args: InputValue[];

  constructor() { }

  ngOnInit() { }

  nav(type: TypeRef): void {
    navigateToField(type);
  }
}
