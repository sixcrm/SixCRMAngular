import { NgModule } from '@angular/core';
import {
  MatInputModule, MatCardModule, MatIconModule, MatTabsModule, MatCheckboxModule,
  MatDialogModule, MatProgressBarModule, MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule,
  MatMenuModule, MatToolbarModule, MatListModule, MatSidenavModule, MatButtonModule, MatFormFieldModule,
  MatSlideToggleModule
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
    MatSlideToggleModule,
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
    MatSlideToggleModule,
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
