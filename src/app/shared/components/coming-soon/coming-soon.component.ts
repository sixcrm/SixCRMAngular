import { Component, OnInit, Input } from '@angular/core';
import {NavigationService} from '../../../navigation/navigation.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {

  @Input() inPage: boolean = false;

  comingSoonLogo = environment.branding ? environment.branding.comingSoonLogo : 'logo-blue.svg';

  constructor(public navigation: NavigationService) { }

  ngOnInit() {
  }

}
