import { Component, OnInit, Input } from '@angular/core';
import {Field} from '../../models/field.model';
import {navigateToField} from '../../utils'
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'doc-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  @Input() field: Field;
  @Input() enableLink: boolean = false;

  constructor() { }

  ngOnInit() { }

  nav(): void {
    navigateToField(this.field.type);
  }

  getShareLink(): string {
    return environment.auth0RedirectUrl + '/documentation/graph#' + this.field.name;
  }
}
