import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {AccessKeysComponent} from './access-keys-index/access-keys.component';
import {SharedModule} from '../../shared/shared.module';
import {accessKeysRouting} from './access-keys.routing';
import { AccessKeysViewComponent } from './access-keys-view/access-keys-view.component';
import {AccessKeysAclGuard} from '../guards/access-keys-acl-guard.service';
import { AccessKeyAddNewComponent } from './access-keys-view/access-key-add-new/access-key-add-new.component';

@NgModule({
  imports : [
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule,
    accessKeysRouting
  ],
  declarations : [
    AccessKeysComponent,
    AccessKeysViewComponent,
    AccessKeyAddNewComponent
  ],
  providers: [AccessKeysAclGuard]
})
export class AccessKeysModule {
}
