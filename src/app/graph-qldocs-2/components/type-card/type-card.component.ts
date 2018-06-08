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

  @Input() field: Field;
  @Input() enableLink: boolean = false;
  @Input() type: Type;
  @Input() isType: boolean;

  constructor(
    private router: Router
  ) { }

  ngOnInit() { }

  navigateTo(): void {
    this.router.navigate(['documentation/graph2', this.type.name.toLowerCase(), this.field.name]);
  }
}
