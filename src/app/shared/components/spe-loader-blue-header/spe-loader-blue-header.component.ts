import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'spe-loader-blue-header',
  templateUrl: './spe-loader-blue-header.component.html',
  styleUrls: ['./spe-loader-blue-header.component.scss']
})
export class SpeLoaderBlueHeaderComponent implements OnInit {

  @Input() images: boolean;

  constructor() { }

  ngOnInit() {
  }

}
