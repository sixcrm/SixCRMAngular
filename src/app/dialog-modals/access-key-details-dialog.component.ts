import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {AccessKey} from '../shared/models/access-key.model';

@Component({
  selector : 'access-key-details-dialog',
  template : `
  <div class="access-key-details-container">
    <md-input-container>
      <input [disabled]="!editMode" md-input placeholder="Name" [(ngModel)]="accessKey.name" type="text">
    </md-input-container>
    
    <md-input-container *ngIf="!editMode">
      <input disabled md-input placeholder="Access Key" [(ngModel)]="accessKey.accessKey" type="text">
    </md-input-container>
    
    <div *ngIf="!editMode">
      <md-input-container *ngIf="!editMode">
        <input disabled md-input placeholder="Secret Key" [(ngModel)]="showSecret ? accessKey.secretKey : accessKey.secretKeyMasked" type="text">
      </md-input-container>
      <div class="show-more" (click)="toggleShowSecret()">{{showSecret ? 'hide' : 'show'}}</div>
    </div>
    
    <md-textarea [disabled]="!editMode" placeholder="Notes" [(ngModel)]="accessKey.notes" type="text"></md-textarea>
  
    <div class="access-key-details-actions">
      <div (click)="cancel()">{{editMode ? 'CANCEL' : 'CLOSE'}}</div>
      <div *ngIf="editMode" (click)="update(accessKey)">UPDATE</div>
    </div>
  </div>
  `,
  styles : [`
    .access-key-details-container { font-family: Roboto, sans-serif; font-size: 14px; min-width: 450px; display: flex; flex-direction: column; padding: 10px;}
    md-input-container {margin: 10px 0 0}
    md-textarea {margin: 10px 0 0}
    .show-more { font-size: 12px; text-align: right; color: #5B9BE1; cursor: pointer}
    .access-key-details-actions {
      display: flex; padding: 15px 0; font-size: 12px;
    }
    .access-key-details-actions > div {
      cursor: pointer;
    }
    .access-key-details-actions > div:first-of-type {
      margin-left: auto;
    }
    .access-key-details-actions > div:nth-of-type(2) {
      margin-left: 10px;
    }
    .access-key-details-actions > div:last-of-type {
      color: #5B9BE1
    }
  `]
})
export class AccessKeyDetailsDialogComponent {

  accessKey: AccessKey;
  showSecret: boolean = false;
  editMode: boolean;

  constructor(public dialogRef: MdDialogRef<AccessKeyDetailsDialogComponent>) {}

  ngOnInit() {
  }

  toggleShowSecret() {
    this.showSecret = !this.showSecret;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  update(accessKey: AccessKey) {
    this.dialogRef.close(accessKey);
  }

}
