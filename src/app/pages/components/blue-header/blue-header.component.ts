import {Component, OnInit, Input} from '@angular/core';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'blue-header',
  templateUrl: './blue-header.component.html',
  styleUrls: ['./blue-header.component.scss']
})
export class BlueHeaderComponent implements OnInit {

  @Input() path: string[];
  @Input() titleValue: string;

  constructor(public navigationService: NavigationService) { }

  ngOnInit() { }

}
