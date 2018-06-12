import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'side-container',
  templateUrl: './side-container.component.html',
  styleUrls: ['./side-container.component.scss']
})
export class SideContainerComponent implements OnInit {

  @Input() example: any;
  @Input() response: any;

  constructor() { }

  ngOnInit() {
  }
}
