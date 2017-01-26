import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'c-levels',
  template: `
    <md-card>
      <md-card-title>Menu Levels</md-card-title>
      <md-card-content>Menu Level {{level}}</md-card-content>
    </md-card>
  `,
  styles: []
})
export class LevelsComponent implements OnInit {
  private level: number;
  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      this.level = +params['level']; // (+) converts string 'level' to a number
    });
  }

}
