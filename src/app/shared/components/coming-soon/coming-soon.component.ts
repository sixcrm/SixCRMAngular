import { Component, OnInit } from '@angular/core';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {

  constructor(public navigation: NavigationService) { }

  ngOnInit() {
  }

}
