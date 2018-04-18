import { Injectable } from '@angular/core';
import {SnackBarType, ErrorSnackBarComponent} from '../components/error-snack-bar/error-snack-bar.component';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  showErrorSnack(message: string, duration: number) {
    const instance = this.snackBar.openFromComponent(ErrorSnackBarComponent, {duration: duration}).instance;
    instance.message = message;
    instance.type = SnackBarType.error;
  }

  showSuccessSnack(message: string, duration: number) {
    const instance = this.snackBar.openFromComponent(ErrorSnackBarComponent, {duration: duration}).instance;
    instance.message = message;
    instance.type = SnackBarType.success;
  }
}
