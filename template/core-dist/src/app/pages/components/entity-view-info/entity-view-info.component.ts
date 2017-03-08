import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'entity-view-info',
  templateUrl: './entity-view-info.component.html',
  styleUrls: ['./entity-view-info.component.scss']
})
export class EntityViewInfoComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  data: any[];

  show: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  toggle(): void {
    this.show = !this.show;
  }

}
