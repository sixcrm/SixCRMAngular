import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {}

}
