import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SiteDashboardComponent } from './site-dashboard/site-dashboard.component';
import { DashBoardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { ChartsComponent } from './charts/charts.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagesModule } from '../pages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
//import { ModalComponent } from './modal/modal.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgSelectModule,
    PagesModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [
    DashBoardComponent,
    SiteDashboardComponent,
    ChartsComponent
    //ModalComponent
  ]
})
export class DashboardModule { }
