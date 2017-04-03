import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../navigation.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  templateUrl : './default.layout.component.html',
  styleUrls : ['./default.layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  showSidenav: boolean;
  showTopProgress: boolean = false;
  isHovering: boolean = false;
  showOnHover: boolean = false;

  constructor(public _navigation: NavigationService, private progressBarService: ProgressBarService) {
  }

  ngOnInit() {
    this._navigation.showSidenav.subscribe(showSidenav => {
      if(!showSidenav) {
        this.showSidenav = showSidenav;
      } else {
        this.showSidenav = showSidenav;
      }
    });

    this.progressBarService.showTopProgressBar$.subscribe((show: boolean) => this.showTopProgress = show);
  }

  private sidenavToggle(visible: boolean) {
    this._navigation.toggleSidenav(visible);
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
