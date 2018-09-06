import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'email-template-preview-modal',
  templateUrl: './email-template-preview-modal.component.html',
  styleUrls: ['./email-template-preview-modal.component.scss']
})
export class EmailTemplatePreviewModalComponent implements OnInit {

  @Input() body: string;

  constructor() { }

  ngOnInit() {
  }

}
