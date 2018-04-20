import { Component, Inject, OnInit } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

export enum SnackBarType {
  error,
  success
}

@Component({
  selector: 'error-snack-bar',
  templateUrl: './error-snack-bar.component.html',
  styleUrls: ['./error-snack-bar.component.scss']
})
export class ErrorSnackBarComponent implements OnInit {

  message: string;
  type: SnackBarType;

  errorType = SnackBarType.error;
  successType = SnackBarType.success;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {message, type}) {
    if (data) {
      this.message = data.message;
      this.type = data.type;
    }
  }

  ngOnInit() {}

}
