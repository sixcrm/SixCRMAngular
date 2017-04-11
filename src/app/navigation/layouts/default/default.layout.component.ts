import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../navigation.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  templateUrl : './default.layout.component.html',
  styleUrls : ['./default.layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  showSidenav: boolean;

  isHovering: boolean = false;
  showOnHover: boolean = false;

  constructor(public _navigation: NavigationService, public progressBarService: ProgressBarService) {
  }

  ngOnInit() {
    this._navigation.showSidenav.subscribe(showSidenav => this.showSidenav = showSidenav);
  }

  hover(value: boolean): void {
    this.isHovering = value;

    setTimeout(() => {
      if (!this.showSidenav && this.isHovering) {
        this.showOnHover = true;
      } else {
        this.showOnHover = false
      }
    }, 50)
  }

}
