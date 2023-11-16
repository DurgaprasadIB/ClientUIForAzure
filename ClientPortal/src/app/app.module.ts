import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';

import { UiSwitchModule } from 'ngx-toggle-switch';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from './pages/shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultpasswordModule } from './defaultpassword/defaultpassword.module';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieModule } from 'ngx-cookie';
import { LoaderService } from './services/loader.service';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

//import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';

//import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
//import {TranslateHttpLoader} from '@ngx-translate/http-loader';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorHandler } from '@angular/core';
import { CustomErrorHandlerService } from './pages/GlobalServices/CustomErrorHandlerService';
import { UserIdleModule } from 'angular-user-idle';
// import { ChartModule } from 'angular-highcharts';
export function createTranslateLoader(http: HttpClient) {
return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const MY_CUSTOM_FORMATS = {
  parseInput: 'DD/MM/YYYY hh:mm A',
  fullPickerInput: 'DD/MM/YYYY hh:mm A',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'hh:mm A',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'DD/MM/YYYY hh:mm A',
  monthYearA11yLabel: 'DD/MM/YYYY hh:mm A'
};

@NgModule({
  declarations: [
    AppComponent  
  ],
  imports: [
    UiSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    NgSelectModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PagesModule,
    DefaultpasswordModule,
    SharedModule,
    //NgxDualListboxModule.forRoot(),
    CommonModule,
    // ChartModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      // positionClass: 'inline'
      //preventDuplicates: true,
    }),
    // Optionally you can set time for `idle`, `timeout` and `ping` in seconds.
        // Default values: `idle` is 600 (10 minutes), `timeout` is 1800 (30 minutes) 
        // and `ping` is 120 (2 minutes).
    UserIdleModule.forRoot({idle: 7200, timeout: 2, ping: 1}),
    CookieModule.forRoot(
      {
        secure: false,
        httpOnly: false
      }
    ),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      }
    })
  ],

  providers: [
    
    AuthGuard, AuthService,LoaderService ,
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandlerService
    },
    //{
      // provide: OWL_DATE_TIME_LOCALE, useValue: 'en-In'
     // provide: OWL_DATE_TIME_LOCALE, useValue: 'en-Us'
   // },


  //  { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
  //  { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  bootstrap: [AppComponent]
})
export class AppModule { }
