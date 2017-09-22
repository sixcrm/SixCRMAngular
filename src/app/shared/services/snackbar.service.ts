import { Injectable } from '@angular/core';
import {MdSnackBar} from '@angular/material';
import {SnackBarType, ErrorSnackBarComponent} from '../components/error-snack-bar/error-snack-bar.component';

@Injectable()
export class SnackbarService {

  constructor(private snackBar: MdSnackBar) { }

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
