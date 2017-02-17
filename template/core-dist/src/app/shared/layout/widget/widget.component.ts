import {Component, OnChanges, SimpleChanges, HostBinding} from '@angular/core';
import {Input} from '@angular/core/src/metadata/directives';
import {ColorService} from '../../services/color.service';

@Component({
  selector : 'core-widget',
  template : `
   <md-card class="flex-item widget" [ngStyle]="{'background-color': color, 'color': textColor}">
    <md-card-content class="layout-stretch-between layout-column">
      <p [ngStyle]="{'background-color': color, 'color': textColor}" class="description" *ngIf="description">{{description}}</p>
      <div class="layout-row">
        <md-icon style="width: 100%" class="widget-icon" *ngIf="icon">{{icon}}</md-icon>
        <p [ngStyle]="{'background-color': color, 'color': textColor}" class="counter">{{count}}</p>
      </div>
    </md-card-content>
  </md-card>
  `,
  styles : []
})
export class WidgetComponent {
  @HostBinding('class') get class() {
    return 'flex-item';
  }

  @Input() icon: string = null;
  @Input() count: number = 0;
  @Input() description: string = null;
  @Input() color: string = '#fff';
  @Input() textColor: string = '#000';

  constructor() {
  }
}
