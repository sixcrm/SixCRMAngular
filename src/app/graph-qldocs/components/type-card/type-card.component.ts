import { Component, OnInit, Input } from '@angular/core';
import {Field} from '../../models/field.model';
import {Type} from '../../models/type.model';
import {Router} from "@angular/router";
import {environment} from '../../../../environments/environment';
import {NavigationService} from "../../../navigation/navigation.service";

@Component({
  selector: 'type-card',
  templateUrl: './type-card.component.html',
  styleUrls: ['./type-card.component.scss']
})
export class TypeCardComponent implements OnInit {

  @Input() type: Type;
  @Input() isType: boolean;

  constructor(
    private router: Router,
    public navigationService: NavigationService
  ) { }

  ngOnInit() { }

  navigateTo(): void {
    this.router.navigate(['documentation/graph/type', this.type.name]);
  }

  navigateToType(arg: Field): void {
    let fieldName = arg.type.name || arg.type.ofType.name || arg.type.ofType.ofType.name;
    this.router.navigate(['documentation/graph/type', fieldName]);
  }

  getShareLink(): string {
    return environment.auth0RedirectUrl + '/documentation/graph/type/' + this.type.name;
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
