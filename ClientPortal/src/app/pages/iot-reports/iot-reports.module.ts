import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IotReportsRoutingModule } from './iot-reports-routing.module';
import { SharedModule } from '../shared/shared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
//import {TranslateModule} from '@ngx-translate/core';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { IotReportsComponent} from './iot-reports.component';


import { OwlDateTimeModule, OwlNativeDateTimeModule ,DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
//import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
//import { MY_CUSTOM_FORMATS } from '../GlobalServices/atpl.service'

// const MY_CUSTOM_FORMATS = {

//   // if(sessionStorage.getItem("DateFormat") != null)
//   // {
//   parseInput: sessionStorage["DateFormat"].toString() + " hh:mm A", //'DD/MM/YYYY hh:mm A',
//   fullPickerInput: sessionStorage["DateFormat"].toString() + " hh:mm A",
//   datePickerInput: sessionStorage["DateFormat"].toString(),
//   timePickerInput: 'hh:mm A',
//   monthYearLabel: 'MMM YYYY',
//   dateA11yLabel: sessionStorage["DateFormat"].toString() + " hh:mm A",
//   monthYearA11yLabel: sessionStorage["DateFormat"].toString() + " hh:mm A"
//   //}
// };

@NgModule({
  imports: [
    CommonModule,
    IotReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxMaterialTimepickerModule.forRoot(),
    //TranslateModule.forRoot(),
    AngularSlickgridModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SharedModule
  ],
  declarations: [
    IotReportsComponent,
    ],
    providers: [
      // { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
      // { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
    ]
})
export class IotReportsModule { }
