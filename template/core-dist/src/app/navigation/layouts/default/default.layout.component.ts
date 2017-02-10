import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../navigation.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  templateUrl : './default.layout.component.html',
  styleUrls : ['./default.layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  private showSidenav: boolean;
  private showTopProgress: boolean = false;

  constructor(private _navigation: NavigationService, private progressBarService: ProgressBarService) {
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

}
