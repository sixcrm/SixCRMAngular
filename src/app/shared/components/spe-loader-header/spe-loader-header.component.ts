import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'spe-loader-header',
  templateUrl: './spe-loader-header.component.html',
  styleUrls: ['./spe-loader-header.component.scss']
})
export class SpeLoaderHeaderComponent implements OnInit {

  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

}
