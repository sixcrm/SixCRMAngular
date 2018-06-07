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

  isQueryOrMutation() {
    return this.type.name === 'Query' || this.type.name ==='Mutation';
  }

}
