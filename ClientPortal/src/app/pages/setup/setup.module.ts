import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ClientdetailsComponent } from './clientdetails/clientdetails.component';
import { SetupComponent } from './setup.component';
import { SetupRoutingModule } from './setup.routing.module';
import { AngularSlickgridModule } from 'angular-slickgrid';

import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeviewModule } from 'ngx-treeview';
import { TrackerWhiteListComponent } from './tracker-white-list/tracker-white-list.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule ,DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';


@NgModule({
  imports: [
    CommonModule,
    //BrowserModule,
    FormsModule,
    SetupRoutingModule,
    AngularSlickgridModule.forRoot(),
   // TranslateModule.forRoot(),
    SharedModule,
    NgSelectModule,
    TreeviewModule.forRoot(),
    //ClientdetailsComponent
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    
  ],
  declarations: [
    SetupComponent,
    ClientdetailsComponent,
    TrackerWhiteListComponent
  ],
  providers: [
    // { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    // { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
]
})
export class SetupModule { }

