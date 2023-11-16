import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackerManagementComponent } from './tracker-management/tracker-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { RolemanagementComponent } from './rolemanagement/rolemanagement.component';
import { DeviceManagementComponent } from './device-management/device-management.component';
import { RulesManagementComponent } from './rules-management/rules-management.component';
import { AssignComponent } from './assign/assign.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { EditdeviceComponent } from './editdevice/editdevice.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { SubClientComponent } from './sub-client/sub-client.component';
import { HelpdocComponent } from './helpdoc/helpdoc.component';

const routes: Routes = [
  {
    path: 'trackerManagement',
    component: TrackerManagementComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'deviceManagement',
    component: DeviceManagementComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'editdevice',
    component: EditdeviceComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  }, {
    path: 'maintenance',
    component: MaintenanceComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'rulemanagement',
    component: RulesManagementComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'userManagement',
    component: UserManagementComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'userProfile',
    component: UserprofileComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'rolemanagement',
    component: RolemanagementComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'assignTracker',
    component: AssignComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'subClients',
    component: SubClientComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: 'help',
    component: HelpdocComponent,
    data: {
      title: sessionStorage.getItem("Client_AppName"),
    }
  },
  {
    path: '',
    redirectTo: 'trackerManagement',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
