import { NgModule } from '@angular/core';
import {
  MatInputModule, MatCardModule, MatIconModule, MatTabsModule, MatCheckboxModule,
  MatSliderModule, MatDialogModule, MatProgressBarModule, MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule,
  MatMenuModule
} from '@angular/material';

@NgModule({
  imports: [
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSliderModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatMenuModule
  ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSliderModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatMenuModule
  ],
  declarations: []
})
export class MaterialSelectionModule { }
