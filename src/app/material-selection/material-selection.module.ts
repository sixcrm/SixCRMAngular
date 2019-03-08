import { NgModule } from '@angular/core';
import {
  MatInputModule, MatCardModule, MatIconModule, MatTabsModule, MatCheckboxModule,
  MatDialogModule, MatProgressBarModule, MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule,
  MatMenuModule, MatToolbarModule, MatListModule, MatButtonModule, MatFormFieldModule,
  MatSlideToggleModule, MatExpansionModule, MatAutocompleteModule, MatChipsModule, MatRadioModule, MAT_TABS_CONFIG
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';

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
    MatRadioModule,
    DragDropModule
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
    MatRadioModule,
    DragDropModule
  ],
  declarations: [],
  providers: [
    { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '335ms' } }
  ]
})
export class MaterialSelectionModule { }
