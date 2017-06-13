import { Component, OnInit, Input } from '@angular/core';
import {Type} from '../../models/type.model';

@Component({
  selector: 'queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss']
})
export class QueriesComponent implements OnInit {

  @Input() queryType: Type;
  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

}
