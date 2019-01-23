import { NgModule } from '@angular/core';
import {
  MatInputModule, MatCardModule, MatIconModule, MatTabsModule, MatCheckboxModule,
  MatDialogModule, MatProgressBarModule, MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule,
  MatMenuModule, MatToolbarModule, MatListModule, MatButtonModule, MatFormFieldModule,
  MatSlideToggleModule, MatExpansionModule, MatAutocompleteModule, MatChipsModule, MatRadioModule, MAT_TABS_CONFIG
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
    MatExpansionModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatRadioModule
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
    MatExpansionModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatRadioModule
  ],
  declarations: [],
  providers: [
    { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '335ms' } }
  ]
})
export class MaterialSelectionModule { }
