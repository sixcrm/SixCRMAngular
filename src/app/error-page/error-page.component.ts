import {Component, OnInit, Input} from '@angular/core';
import {NavigationService} from '../navigation/navigation.service';

@Component({
  selector: 'error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  @Input() showNavigation: boolean = true;

  constructor(public navigation: NavigationService) { }

  ngOnInit() {
  }

}
