import { NgModule } from '@angular/core';
import {
  MatInputModule, MatCardModule, MatIconModule, MatTabsModule, MatCheckboxModule,
  MatSliderModule, MatDialogModule, MatProgressBarModule, MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule,
  MatMenuModule, MatToolbarModule, MatListModule, MatSidenavModule, MatButtonModule, MatFormFieldModule
} from '@angular/material';

@NgModule({
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
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
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule
  ],
  exports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
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
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule
  ],
  declarations: []
})
export class MaterialSelectionModule { }
