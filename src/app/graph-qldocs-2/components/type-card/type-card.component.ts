import { Component, OnInit, Input } from '@angular/core';
import {Field} from '../../models/field.model';
import {Type} from '../../models/type.model';
import {Router} from "@angular/router";

@Component({
  selector: 'type-card',
  templateUrl: './type-card.component.html',
  styleUrls: ['./type-card.component.scss']
})
export class TypeCardComponent implements OnInit {

  @Input() type: Type;
  @Input() isType: boolean;

  constructor(
    private router: Router
  ) { }

  ngOnInit() { }

  navigateTo(): void {
    this.router.navigate(['documentation/graph2/type', this.type.name]);
  }

  navigateToType(arg: Field): void {
    let fieldName = arg.type.name || arg.type.ofType.name || arg.type.ofType.ofType.name;
    this.router.navigate(['documentation/graph2/type', fieldName]);
  }

  navigateToGraph() {
    this.router.navigate(['/documentation/graph2']);
  }

  showProperties() {
    if (this.type.fields) {
      return this.type.fields.length > 0
    }

    if (this.type.inputFields) {
      return this.type.inputFields.length > 0;
    }
  }
}
