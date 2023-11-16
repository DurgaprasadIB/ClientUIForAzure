import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { AppheaderComponent } from './component/appheader/appheader.component';
import { AppfooterComponent } from './component/appfooter/appfooter.component';
import { AppmenuComponent } from './component/appmenu/appmenu.component';
import { AppsettingsComponent } from './component/appsettings/appsettings.component';
import { SharedModule } from './shared/shared.module';
import { UserIdleModule } from 'angular-user-idle';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { ArraySortPipe, ArrayFilterPipe } from './master/assign/array.pipes';
// import { DateFormatCustomPipePipePipe } from '../directives/date-format-custom-pipe-pipe.pipe';

//import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
//import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';

// export const MY_CUSTOM_FORMATS = {
//   parseInput: 'DD/MM/YYYY hh:mm A',
//   fullPickerInput: 'DD/MM/YYYY hh:mm A',
//   datePickerInput: 'DD/MM/YYYY',
//   timePickerInput: 'hh:mm A',
//   monthYearLabel: 'MMM YYYY',
//   dateA11yLabel: 'DD/MM/YYYY hh:mm A',
//   monthYearA11yLabel: 'DD/MM/YYYY hh:mm A'
// };

@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    //UserIdleModule.forRoot({idle: 3, timeout: 3, ping: 120})
  ],
  declarations: [
    PagesComponent,
    AppheaderComponent,
    AppfooterComponent,
    AppmenuComponent,
    AppsettingsComponent,
    ArraySortPipe,
    ArrayFilterPipe,
    // DateFormatCustomPipePipePipe
  ],
  exports: [
    PagesComponent,
    AppheaderComponent,
    AppfooterComponent,
    AppmenuComponent,
    AppsettingsComponent,
    ArraySortPipe,
    ArrayFilterPipe
  ],
  providers:[  
    
    //{ provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    //{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
   //{provide: OWL_DATE_TIME_LOCALE, useValue: 'en-In'}
  ]
})
export class PagesModule { }
