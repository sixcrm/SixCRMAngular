import {Component, OnInit, Input} from '@angular/core';
import {Field} from '../../models/field.model';
import {Type} from '../../models/type.model';
import {Router} from "@angular/router";
import {InputValue} from '../../models/input-value.model';
import {environment} from '../../../../environments/environment';
import {NavigationService} from "../../../navigation/navigation.service";

@Component({
  selector: 'query-mutation-card',
  templateUrl: './query-mutation-card.component.html',
  styleUrls: ['./query-mutation-card.component.scss']
})
export class QueryMutationCardComponent implements OnInit {

  @Input() field: Field;
  @Input() type: Type;
  @Input() isQuery: boolean;
  @Input() isMutation: boolean;

  constructor(
    private router: Router,
    public navigationService: NavigationService
  ) { }

  ngOnInit() { }

  navigateTo(): void {
    this.router.navigate(['documentation/graph/', this.type.name.toLowerCase(), this.field.name]);
  }

  navigateToType(arg: InputValue): void {
    let fieldName = arg.type.name || arg.type.ofType.name || arg.type.ofType.ofType.name;
    this.router.navigate(['documentation/graph/type', fieldName]);
  }

  navigateToFieldType(): void {
    let fieldName = this.field.type.name || this.field.type.ofType.name || this.field.type.ofType.ofType.name;
    this.router.navigate(['documentation/graph/type', fieldName]);
  }

  getShareLink(): string {
    return environment.auth0RedirectUrl + '/documentation/graph/' + this.type.name.toLowerCase() + '/' + this.field.name;
  }
}
