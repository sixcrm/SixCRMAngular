import {Component} from '@angular/core';
import {AccessKey} from '../shared/models/access-key.model';
import {MatDialogRef} from '@angular/material';

@Component({
  selector : 'access-key-details-dialog',
  template : `
  <div class="access-key-details-container">
    <mat-input-container>
      <input [disabled]="!editMode" [readonly]="!editMode" matInput placeholder="{{ 'ACCOUNT_KEYS_HEADER_NAME' | translate}}" [(ngModel)]="accessKey.name" type="text">
    </mat-input-container>
    
    <div class="flex-custom" *ngIf="!editMode">
      <mat-input-container>
        <input #accessKeyInput readonly matInput placeholder="{{ 'ACCOUNT_KEYS_HEADER_ACCESS' | translate}}" [(ngModel)]="accessKey.accessKey" type="text">
      </mat-input-container>
      <mat-icon ngxClipboard [cbContent]="accessKey.accessKey" (click)="selectInput(accessKeyInput)">content_copy</mat-icon>
    </div>
    
    <div *ngIf="!editMode">
      <div class="flex-custom" >
        <mat-input-container>
          <input #secretKeyInput readonly matInput placeholder="{{ 'ACCOUNT_KEYS_HEADER_SECRET' | translate}}" [(ngModel)]="showSecret ? accessKey.secretKey : accessKey.secretKeyMasked" type="text">
        </mat-input-container>
        <mat-icon ngxClipboard [cbContent]="accessKey.secretKey" (click)="selectInput(secretKeyInput)">content_copy</mat-icon>
      </div>
      <div class="show-more" (click)="toggleShowSecret()">{{showSecret ? 'hide' : 'show'}}</div>
    </div>
    
    <md-textarea [disabled]="!editMode" [readonly]="!editMode" placeholder="{{ 'ACCOUNT_KEYS_HEADER_NOTES' | translate}}" [(ngModel)]="accessKey.notes" type="text"></md-textarea>
  
    <div class="access-key-details-actions">
      <div (click)="cancel()">{{(editMode ? 'ACCOUNT_KEYS_CANCEL' : 'ACCOUNT_KEYS_CLOSE') | translate}}</div>
      <div *ngIf="editMode" (click)="update(accessKey)">{{ 'ACCOUNT_KEYS_UPDATE' | translate}}</div>
    </div>
  </div>
  `,
  styles : [`
    .access-key-details-container { font-family: Roboto, sans-serif; font-size: 14px; min-width: 450px; display: flex; flex-direction: column; padding: 10px;}
    md-input-container {margin: 10px 0 0; width: 100%;}
    md-textarea {margin: 10px 0 0}
    .show-more { font-size: 12px; text-align: right; color: #5B9BE1; cursor: pointer}
    .access-key-details-actions { display: flex; padding: 15px 0; font-size: 12px; }
    .access-key-details-actions > div { cursor: pointer; }
    .access-key-details-actions > div:first-of-type { margin-left: auto; }
    .access-key-details-actions > div:nth-of-type(2) { margin-left: 10px; }
    .access-key-details-actions > div:last-of-type { color: #5B9BE1; }
    .flex-custom { align-items: center; }
     md-icon { margin-left: 15px; height: 18px; width: 18px; font-size: 18px; color: rgba(0,0,0,0.8); cursor: pointer; }
  `]
})
export class AccessKeyDetailsDialogComponent {

  accessKey: AccessKey;
  showSecret: boolean = false;
  editMode: boolean;

  constructor(public dialogRef: MatDialogRef<AccessKeyDetailsDialogComponent>) {}

  ngOnInit() { }

  toggleShowSecret() {
    this.showSecret = !this.showSecret;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  update(accessKey: AccessKey) {
    this.dialogRef.close(accessKey);
  }

  selectInput(input): void {
    input.select();
  }

}
