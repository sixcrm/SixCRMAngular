import {Component, Input} from '@angular/core';

@Component({
  selector : 'core-widget',
  templateUrl : './widget.component.html',
  styleUrls : ['./widget.component.scss']
})
export class WidgetComponent {

  @Input() count: number = 0;
  @Input() description: string = null;
  @Input() color: string = '#fff';

  constructor() {
  }
}
