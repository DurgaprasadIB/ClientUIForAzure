import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { JioLoginRoutingModule } from './jiologin-module.routing';
import { JioLoginComponent } from './jio-login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from '../pages/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    JioLoginRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
     // positionClass: 'inline'
      //preventDuplicates: true,
    }),
    SharedModule
  ],
  declarations: [JioLoginComponent,LoginComponent]
})
export class JioLoginModule { }
