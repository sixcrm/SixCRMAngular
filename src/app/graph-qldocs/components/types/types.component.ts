import { Component, OnInit, Input } from '@angular/core';
import {Type} from '../../models/type.model';

@Component({
  selector: 'types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {

  @Input() types: Type[];

  constructor() { }

  ngOnInit() {
  }

}
