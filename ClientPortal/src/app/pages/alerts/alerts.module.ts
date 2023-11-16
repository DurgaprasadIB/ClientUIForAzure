import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AlertsettingsComponent } from './alertsettings/alertsettings.component';
import { AlertsComponent } from './alerts.component';
import { AlertsRoutingModule } from './alerts-routing.module';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { PagesModule } from '../pages.module';
//import {TranslateModule} from '@ngx-translate/core';

import { AngularSlickgridModule } from 'angular-slickgrid';

@NgModule({
  imports: [
    CommonModule,
    AlertsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxMaterialTimepickerModule.forRoot(),
    //TranslateModule.forRoot(),
    AngularSlickgridModule.forRoot(),
    SharedModule,
    PagesModule
  ],
  declarations: [
    AlertsComponent,
    AlertsettingsComponent,
  //  ArraySortPipe,
  ],
  exports:[
    //ArraySortPipe
  ]
})
export class AlertsModule { }
