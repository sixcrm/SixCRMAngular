import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'processing-dialog',
  templateUrl: './processing-dialog.component.html',
  styleUrls: ['./processing-dialog.component.scss']
})
export class ProcessingDialogComponent implements OnInit {

  text: string = 'PAYMENT_PROCESSING';
  showGenericLoader: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
