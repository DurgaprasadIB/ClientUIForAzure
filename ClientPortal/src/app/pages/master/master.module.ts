import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TrackerManagementComponent } from './tracker-management/tracker-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { MasterComponent } from './master.component';
import { RolemanagementComponent } from './rolemanagement/rolemanagement.component';
import { AngularSlickgridModule } from 'angular-slickgrid';
//import {TranslateModule} from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeviewModule } from 'ngx-treeview';
import { PagesModule } from '../pages.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule, DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { DeviceManagementComponent } from './device-management/device-management.component';
import { RulesManagementComponent } from './rules-management/rules-management.component';
import { AssignComponent } from './assign/assign.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { EditdeviceComponent } from './editdevice/editdevice.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { SubClientComponent } from './sub-client/sub-client.component';
import { HelpdocComponent } from './helpdoc/helpdoc.component';
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
    CommonModule, FormsModule,
    PagesModule,
    MasterRoutingModule,
    AngularSlickgridModule.forRoot(),
    //AngularSlickgridModule.forRoot({
    //   enableAutoResize: true,
    //   autoResize: {
    //  // containerId: 'grid-container',
    //  //containerId: 'grid1',
    //  // minWidth:1500.91,
    //   sidePadding: 15
    //   }
    // }),
    //TranslateModule.forRoot(),
    // FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule, 
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    TreeviewModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,

  ],
  declarations: [
    TrackerManagementComponent,
    UserManagementComponent,
    MasterComponent,
    RolemanagementComponent,
    DeviceManagementComponent,
    RulesManagementComponent,
    AssignComponent,
    UserprofileComponent,
    EditdeviceComponent,
    MaintenanceComponent,
    SubClientComponent,
    HelpdocComponent,
  ],
  entryComponents: [
  ],
  exports: [

    ReactiveFormsModule

  ],
  providers: [
    // { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    // { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
  ]
})
export class MasterModule { }
