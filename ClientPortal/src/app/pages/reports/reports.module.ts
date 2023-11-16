import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsRoutingModule } from './reports-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularSlickgridModule } from 'angular-slickgrid';
//import { TranslateModule } from '@ngx-translate/core';
import { AlertsDetailsComponent } from './alerts-details/alerts-details.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SharedModule } from '../shared/shared.module';


import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { IotReportComponent } from './iot-report/iot-report.component';
import { VideoFilesComponent } from './video-files/video-files.component';
import { ImageFilesComponent } from './image-files/image-files.component';
import { SaveAnalyticsComponent } from './save-analytics/save-analytics.component';
import { TabComponent } from './tab/tab.component';
import { TabModule } from 'angular-tabs-component';
import { LogComponent } from './log/log.component';
//import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';

const MY_CUSTOM_FORMATS = {

  // if(sessionStorage.getItem("DateFormat") != null)
  // {
  parseInput: 'YYYY/MM/DD hh:mm A',//sessionStorage["DateFormat"].toString() + " hh:mm A", //'DD/MM/YYYY hh:mm A',
  fullPickerInput: 'YYYY/MM/DD hh:mm A',//sessionStorage["DateFormat"].toString() + " hh:mm A",
  datePickerInput: 'YYYY/MM/DD hh:mm A',//sessionStorage["DateFormat"].toString(),
  timePickerInput: 'hh:mm A',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'YYYY/MM/DD hh:mm A',//sessionStorage["DateFormat"].toString() + " hh:mm A",
  monthYearA11yLabel: 'YYYY/MM/DD hh:mm A',//sessionStorage["DateFormat"].toString() + " hh:mm A"
  //}
};

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgSelectModule,
    AngularSlickgridModule.forRoot(),
    //TranslateModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TabModule
  ],
  declarations: [
    AlertsDetailsComponent,
    IotReportComponent,
    VideoFilesComponent,
    ImageFilesComponent,
    SaveAnalyticsComponent,
    TabComponent,
    LogComponent,
  ],
  providers: [
    DatePipe
     //{ provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    // { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
  ]
})
export class ReportsModule { }

/// inka ekadaina use chesava modal popup
//reports lo ide 1st time//vere modulesl
