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

  constructor(public navigation: NavigationService, public progressBarService: ProgressBarService) { }

  ngOnInit() {
    this.navigation.showSidenav.subscribe(showSidenav => this.showSidenav = showSidenav);
  }

  hover(value: boolean): void {
    this.isHovering = value;

    setTimeout(() => {
      this.showOnHover = !!(!this.showSidenav && this.isHovering);
    }, 50)
  }

}
