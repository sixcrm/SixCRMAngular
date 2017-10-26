import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {NavigationService} from '../../navigation.service';
import {HttpWrapperService} from '../../../shared/services/http-wrapper.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MdSidenav} from '@angular/material';

@Component({
  templateUrl : './default.layout.component.html',
  styleUrls : ['./default.layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav: MdSidenav;

  showSidenav: boolean;

  isHovering: boolean = false;
  showOnHover: boolean = false;

  alertTopOffsetCurrent: number = 0;

  constructor(public navigation: NavigationService, public http: HttpWrapperService, public authService: AuthenticationService) { }

  ngOnInit() {
    this.navigation.showSidenav.subscribe(showSidenav => this.showSidenav = showSidenav);
  }

  ngAfterViewInit() {
    this.sidenav.onCloseStart.filter(() => this.navigation.mediumScreenAndDown).subscribe(() => {
      this.navigation.toggleSidenav(false);
    });

    document.getElementsByClassName('md-sidenav-content')[0].addEventListener('scroll', (event) => {
      const scrollTop = event.srcElement.scrollTop;
      this.alertTopOffsetCurrent = scrollTop < 70 ? 0 : scrollTop - 70;
    })
  }

  hover(value: boolean): void {
    this.isHovering = value;

    setTimeout(() => {
      this.showOnHover = !!(!this.showSidenav && this.isHovering);
    }, 50)
  }

}
