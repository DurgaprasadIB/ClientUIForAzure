import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultpasswordRoutingModule } from './defaultpassword-routing.module';
import { SharedModule } from '../pages/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ChangepasswordComponent } from './changepassword/changepassword.component';

@NgModule({
  imports: [
    CommonModule,
    DefaultpasswordRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: [ChangepasswordComponent]
})
export class DefaultpasswordModule { }
