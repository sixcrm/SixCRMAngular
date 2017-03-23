import { Component, OnInit } from '@angular/core';
import {Input} from '@angular/core/src/metadata/directives';

@Component({
  selector: 'result-item',
  templateUrl: './result-item.component.html',
  styleUrls: ['./result-item.component.scss']
})
export class ResultItemComponent implements OnInit {

  @Input() id: string;
  @Input() fields: any = {};
  @Input() entityType: string;
  @Input() queryString: string;

  constructor() { }

  ngOnInit() {
  }

  imageSrc(): string {
    return `/assets/images/result-item-${this.entityType}.svg`;
  }
}
