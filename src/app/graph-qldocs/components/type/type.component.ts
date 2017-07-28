import { Component, OnInit, Input } from '@angular/core';
import {Type} from '../../models/type.model';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'doc-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit {

  @Input() type: Type;

  show: boolean = true;

  constructor() { }

  ngOnInit() { }

  toggleShow(): void {
    this.show = !this.show;
  }

  getShareLink(): string {
    return environment.auth0RedirectUrl + '/documentation/graph#' + this.type.name;
  }

}
