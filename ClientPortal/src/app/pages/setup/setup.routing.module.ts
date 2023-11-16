import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientdetailsComponent } from './clientdetails/clientdetails.component';
import { TrackerWhiteListComponent } from './tracker-white-list/tracker-white-list.component';


const routes: Routes = [

  {
    path:'clientdetails',
    component:ClientdetailsComponent,
    data: {
      title: "Enterprise Clients",
      }
  },

  {
    path:'TrackerWhiteList',
    component:TrackerWhiteListComponent,
    data: {
      title: "Tracker WhiteList",
      }
  },

 
  {
    path:'',
    redirectTo:'clientdetails',
    pathMatch:'full'
  },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule {
    debugger;
 }
