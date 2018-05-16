import {Component, OnInit, Input} from '@angular/core';
import {NavigationService} from '../navigation/navigation.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  @Input() showNavigation: boolean = true;

  errorLogo = environment.branding ? environment.branding.errorLogo : 'sleepingHamster.svg';

  constructor(public navigation: NavigationService) { }

  ngOnInit() {
  }

}
