import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'processing-dialog',
  templateUrl: './processing-dialog.component.html',
  styleUrls: ['./processing-dialog.component.scss']
})
export class ProcessingDialogComponent implements OnInit {

  text: string = 'PAYMENT_PROCESSING';
  showGenericLoader: boolean = environment.branding && environment.branding.showGenericLoader;

  constructor() { }

  ngOnInit() {
  }

}
