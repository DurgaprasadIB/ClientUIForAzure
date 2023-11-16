import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Rolemanagement } from '../models/rolemanagement';
import { RolemanagementService } from './service/rolemanagement.service';
import { ToastrService } from 'ngx-toastr';
import { TreeviewItem, TreeviewConfig, TreeviewComponent } from 'ngx-treeview';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { LoaderService } from 'src/app/services/loader.service';
import Swal from 'sweetalert2'
declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rolemanagement',
  templateUrl: './rolemanagement.component.html',
  styleUrls: ['./rolemanagement.component.css']
})

export class RolemanagementComponent implements OnInit {

  rolemanagementobj = new Rolemanagement();
  role_id: string = "";
  Description: string;
  ResponseList: any;
  isPermissionShow: boolean = false;
  devMainScheduler: boolean = false;
  devMainCareTaker: boolean = false;
  responselist: any = [];
  objRoleAcess: any = new RoleAccess();
  isDeleteShow: boolean = false;
  devCtrl: boolean = false;
  devReport: boolean = false;
  responseSupportList: any = [];
  //permissions strat
  roleName: string;
  roleTag: string;
  description: string;
  resultedMenu: any = [];
  childresultedMenu: any = [];
  menuItem: TreeviewItem;
  childmenuItem: TreeviewItem;
  items: TreeviewItem[];
  SelectedFeatureIds: any = [];
  itemArray: any = [];
  defaultFeatureId: any;
  dropDownSourceList: any = [];
  filterDropDownSourceList: any = [];
  defaultDrpList: any = [];
  selectedDefaultDrp = new SelectedDefaultDrp();
  isbuttonshow: boolean = false;
  desiableDiv: boolean = false;
  roleType: string;
  treeView: TreeviewComponent;
  permission: any = ""
  role1: any = "";
  appendRole: any = "";
  swalSuccessMessage: any = ""
  swalPermissionMessage: any = ""
  roleNotSaved: any = "";
  RoleNotDeleted: any = "";
  roleMenusAreNotAvailable: any = ""
  isShowFooter: boolean = false;
  isSchedule: boolean = false;
  showUserManagement: boolean = false;
  showroleManagement: boolean = false;
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 250
  });

  @ViewChild('modalRoot') modalRootPopUp: any;
  @ViewChild('modalPermissions') modelpermission: any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private roleService: RolemanagementService,
    private cmnService: IdeaBService,
    private loaderService: LoaderService,
    private translate: TranslateService) {

  }

  bgImage: any;

  ngOnInit() {

    sessionStorage.setItem('liveScreen', "role");
    this.bgImage = sessionStorage.getItem('BGimage');
    this.showroleManagement = true;
    debugger
    this.role1 = this.translate.instant('New Role');
    this.permission = this.translate.instant("RolePermissions");
    this.appendRole = this.translate.instant("AppendRole");
    //this.swalSuccessMessage = this.translate.instant('SwalMessageCreated');
    //this.swalPermissionMessage = this.translate.instant('SwalMessagePermission');
    this.roleNotSaved = this.translate.instant('RoleNotSaved');
    this.RoleNotDeleted = this.translate.instant('RoleNotDeleted');
    this.roleMenusAreNotAvailable = this.translate.instant('roleMenusAreNotAvailable');
    this.slPermissions = this.translate.instant('UsmselectPermission');
    this.homePage = this.translate.instant('UsmselectHome');
    this.roledDeleteMsg = this.translate.instant('RoledeleteRoleMsg');

    this.desiableDiv = true;
    this.responselist = [];
    this.responseSupportList = [];
    this.loaderService.display(true);
    this.prepareGrid();

    var devMaitain: any
    devMaitain = sessionStorage.getItem('devMaintenance');
    //devMaintenance
    if (devMaitain == '1') {
      this.isSchedule = true;
    }
    else
      if (devMaitain == '2') {
        this.isSchedule = false;
      }
  }

  prepareGrid() {

    this.responseSupportList = [];
    this.responselist = [];
    this.isShowFooter = false;
    this.roleService.getRoles("").subscribe(data => {
      debugger
      this.responselist = data;
      this.responseSupportList = data;
      if (this.responseSupportList.length > 0) {
        this.isShowFooter = true;
      }
      this.tableRefreshData();
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
      this.tableRefreshData();
      //this.toastr.warning(error.error.Message);
    })
  }

  goUser() {
    this.router.navigateByUrl('/pages/master/userManagement')
  }

  tableRefreshData() {
    debugger
    var table1 = $('#rolesTable').DataTable();
    var pageNo = table1.page.info().page;
    var pagelen = table1.page.info().pages;
    var pageSize = table1.page.len();
    var order = table1.order();
    var search = table1.search();
    debugger

    $('#rolesTable').DataTable().clear().destroy();

    setTimeout(() => {

      var table = $('#rolesTable').DataTable({
        "order": [], "sort": [],
        'columnDefs': [{
          'targets': [3], /* column index */
          'orderable': false, /* true or false */
        }],
        searching: this.isShowFooter,
        paging: this.isShowFooter,
        info: this.isShowFooter,
        "pageLength": pageSize,
      });

      table.order([order[0][0], order[0][1]]).search(search).draw();

      try {
        if (pagelen > pageNo) {
          $('#rolesTable').dataTable().fnPageChange(pageNo);
        }
      } catch (e) {
        e = null;
      }

      jQuery('.dataTable').wrap('<div style="overflow-y:auto;" />');
    });

  }

  dataset = [];

  onCloseModal() { }

  clearPermissionBox() { }

  clearSerachBox() { }

  saveRolelist: any = [];

  OpenModal(status: string) {
    // debugger
    this.responselist = [];
    if (status == 'Create') {
      this.role_id = "";
      this.isPermissionShow = false;
      this.isDeleteShow = false;
      this.isbuttonshow = true;
      this.rolemanagementobj = new Rolemanagement();
      this.roleType = this.translate.instant('UsmNewRole');
    }
    else {
      this.isDeleteShow = true;
      this.isbuttonshow = true;
      this.loaderService.display(true);
      this.roleType = this.translate.instant('Edit Role');
      this.role_id = status;
      this.roleService.getRoles(status).subscribe(data => {
        this.responselist = data;
        if (this.role_id != "") {
          try {
            this.rolemanagementobj = this.responselist;
            this.rolemanagementobj.roleName = this.responselist[0].roleName;
            this.rolemanagementobj.roleTag = this.responselist[0].roleTag;
            this.rolemanagementobj.description = this.responselist[0].description;
          } catch (e) {
            this.toastr.warning(e);
          }
        }

        this.loaderService.display(false);
        this.isPermissionShow = true;
        this.modalRootPopUp.show();
      }, error => {

        this.modalRootPopUp.show();
      });
    }

  }

  saveNewRole(obj) {
    debugger
    this.ResponseList = [];
    if (obj.roleName == "" || obj.roleName == undefined) {
      this.toastr.warning(this.role1);
      return false;
    }
    else if (obj.roleName.match(/^[0-9 ]+$/g) || obj.roleName.match(/^[ ]+$/g)) {
      this.rolemanagementobj.roleName = "";
      this.toastr.warning(this.translate.instant("RoleManageRoleName") + " " + this.translate.instant("NumericSpacesValidation"));
      return false;
    }
    else if (!this.cmnService.AcceptFirstChar_REGX.test(obj.roleName.trim())) {
      this.toastr.warning(this.translate.instant('roleFirstLetter'));
      return false;
    }
    else if (obj.roleName.startsWith(" ")) {
      this.toastr.warning(this.translate.instant("RoleManageRoleName") + " " + this.translate.instant("SpacesValidation"));
      return false;
    }

    if (obj.roleTag == "" || obj.roleTag == undefined) {
      this.toastr.warning("Please enter role tag");
      return false;
    }
    else if (obj.roleTag.startsWith(" ")) {
      this.toastr.warning("Role tag " + this.translate.instant("SpacesValidation"));
      return false;
    }
    //
    else if (!this.cmnService.nameLengthCheck(obj.roleName)) {
      //this.toastr.warning(this.appendRole + " " + this.cmnService.nameLengthCheckText);
      this.toastr.warning(this.translate.instant("roleNameLength"));
      return false;
    }
    else if (!this.descriptionValidation(obj)) {
      return false
    }
    else {

      if (obj.description === undefined) {
        obj.description = "";
      }

      if (this.role_id != "") {
        obj.roleID = this.role_id;
        obj.savemode = "Modify";
      }
      else {
        obj.roleID = "";
        obj.savemode = "Create";
      }
      debugger


      this.loaderService.display(true);
      this.roleService.InsertRole(obj).subscribe(result => {
        this.loaderService.display(false);
        this.ResponseList = result;
        debugger
        if (this.ResponseList.sts == "400") {
          this.toastr.warning(this.ResponseList.msg);
        }
        else if (this.ResponseList.sts == "200") {

          this.isPermissionShow = true;
          this.isDeleteShow = true;
          this.role_id = this.ResponseList.roleId;
          this.roleName = this.responselist.roleName;
          this.roleTag = this.responselist.roleTag;

          this.description = this.responselist.description;

          if (obj.savemode == "Create") {
            Swal(this.translate.instant('SwalMessageCreated'), this.translate.instant('SwalMessagePermission'), 'success');
            this.OpenPermissions();
          }
          else {
            this.toastr.success(this.ResponseList.msg);
          }

          this.prepareGrid();
          this.modalRootPopUp.hide();

          this.formatLogUpdate(obj.savemode == "Create" ? "created" : "updated");

        }
        this.loaderService.display(false);
        // }, error => {
        //   this.toastr.warning(this.roleNotSaved);
        //   this.loaderService.display(false);
      });
    }

    // if (!this.cmnService.nameLengthCheck(obj.roleName)) {
    //   //this.toastr.warning(this.appendRole + " " + this.cmnService.nameLengthCheckText);
    //   this.toastr.warning(this.translate.instant("roleNameLength"));
    //   return false;
    // }
    // else {

    // }
    //}
    // else {
    //   this.toastr.warning(this.role1);
    // }
  }


  descriptionValidation(obj): any {
    //debugger
    if (obj.description != "" && obj.description != undefined) {
      if (obj.description.match(/^[0-9 ]+$/g) || obj.description.match(/^[ ]+$/g)) {
        this.rolemanagementobj.description = "";
        this.toastr.warning(this.translate.instant("RoleDescription") + " " + this.translate.instant("NumericSpacesValidation"));
        return false;
      }
      else if (!this.cmnService.AcceptFirstChar_REGX.test(obj.description.trim())) {
        this.toastr.warning(this.translate.instant('roleDescFirstLetter'));
        return false;
      }
      else if (obj.description.startsWith(" ")) {
        this.toastr.warning(this.translate.instant("RoleDescription") + " " + this.translate.instant("SpacesValidation"));
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  }

  deleteRole: any = "";
  roledDeleteMsg: any = "";
  DeleteRole() {

    this.ResponseList = [];
    if (this.role_id != " ") {

      // Swal({
      //   title: this.translate.instant("TrAreYouSure"),
      //   text: 'All user will be unassigned from this role, Do you want to proceed',// this.translate.instant(this.roledDeleteMsg),
      //   type: 'warning',
      //   showCancelButton: true,
      //   confirmButtonColor: '#3085d6',
      //   cancelButtonColor: '#d33',
      //   cancelButtonText: this.translate.instant('Cancel'),
      //   confirmButtonText: this.translate.instant('SwalYes')
      // }).then((roledDeleteMsg) => {
      //if (roledDeleteMsg.value) {
      this.loaderService.display(false);
      this.roleService.deleteRoleDetails(this.role_id).subscribe(result => {
        this.ResponseList = result;
        if (this.ResponseList.sts == "200") {
          this.toastr.success(this.ResponseList.msg);
          this.modalRootPopUp.hide();
          this.prepareGrid();

          this.formatLogUpdate("deleted");
        }
        else {
          this.toastr.warning(this.ResponseList.msg);
        }
        this.loaderService.display(false);
      }, error => {
        this.toastr.warning(this.RoleNotDeleted);
        this.loaderService.display(false);
      });
      //   }
      // });
    }
    else {
      return false;
    }

  }


  formatLogUpdate(action: string) {
    let logReq = {
      "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
      "module": "User Management",
      "actionPerformed": "Role has been " + action + ". Role info - Role Name: " + this.rolemanagementobj.roleName +
        ", Role Tag: " + this.rolemanagementobj.roleTag +
        ", Description: " + this.rolemanagementobj.description
    }

    this.cmnService.logUpdate(logReq);
  }
  OpenPermissions() {
    debugger
    this.permission = this.translate.instant('Permissions');
    this.resultedMenu = [];
    this.childresultedMenu = [];
    this.items = [];
    this.SelectedFeatureIds = [];
    this.itemArray = [];
    this.defaultFeatureId = "";
    this.dropDownSourceList = [];
    this.filterDropDownSourceList = [];
    this.defaultDrpList = [];
    this.selectedDefaultDrp = new SelectedDefaultDrp();

    this.isbuttonshow = false;

    this.loaderService.display(true);
    this.itemArray = [];
    this.roleService.getRoleFeature(this.role_id).subscribe(result => {
      this.itemArray = result;
      debugger
      this.childresultedMenu = [];
      this.itemArray.siteFeatures.forEach(element => {

        try {

          /*creating childrens*/
          // element.forEach(child => {
          try {
            this.childmenuItem = new TreeviewItem({
              text: element.text, value: element.value, checked: element.Checked
            })
            this.childresultedMenu.push(this.childmenuItem);

            this.selectedDefaultDrp = {
              id: '',
              name: '',
              disabled: false
            };
            if (element.Checked) {
              this.selectedDefaultDrp.disabled = false;
            }
            else {
              this.selectedDefaultDrp.disabled = true;
            }
            this.selectedDefaultDrp.id = element.value;
            this.selectedDefaultDrp.name = element.text;
            this.dropDownSourceList.push(this.selectedDefaultDrp);
          } catch (e) {
            // alert(e);
          }
          // })
          /*creating TreeviewItem*/
          // this.menuItem = new TreeviewItem({
          //   text: element.text, value: element.value, children: this.childresultedMenu
          // });
          /*adding TreeviewItem to array*/
          this.resultedMenu.push(this.childresultedMenu);
        } catch (e) {
          e = null;
        }
      });
      this.defaultFeatureId = this.itemArray.defaultPage;
      this.items = this.childresultedMenu;// this.resultedMenu;
      this.devCtrl = this.itemArray.control == '1' ? true : false;
      this.devReport = this.itemArray.createReport == '1' ? true : false;

      this.devMainScheduler = false;
      this.devMainCareTaker = false;

      if (this.itemArray.maitenance == '1') {
        this.devMainScheduler = true;
      }
      else
        if (this.itemArray.maitenance == '2') {
          this.devMainCareTaker = true;
        }
      debugger
      this.defaultDrpList = this.dropDownSourceList;
      this.modelpermission.show();
      this.loaderService.display(false);
    }, error => {
      this.toastr.warning(this.roleMenusAreNotAvailable);
      this.loaderService.display(false);
    });
  }

  slPermissions: any;
  homePage: any

  savePermissions() {
    //debugger
    this.isbuttonshow = false;
    if (this.SelectedFeatureIds === undefined || this.SelectedFeatureIds.length == 0) {
      this.toastr.warning(this.slPermissions);
    }
    else if (this.defaultFeatureId === undefined || this.defaultFeatureId == null || this.defaultFeatureId == "") {
      this.toastr.warning(this.homePage);
    }
    else {
      var fetureids: string = "";
      this.SelectedFeatureIds.forEach(element => {
        fetureids += element + ",";
      });

      this.objRoleAcess.roleID = this.role_id;
      this.objRoleAcess.featureIDs = fetureids;
      this.objRoleAcess.defaultFeatureId = this.defaultFeatureId;
      this.objRoleAcess.control = this.devCtrl == true ? '1' : '0';
      this.objRoleAcess.createReport = this.devReport == true ? '1' : '0';


      var maitenance: any = ""

      maitenance = '0'

      if (this.devMainScheduler) {
        maitenance = '1'
      }
      else
        if (this.devMainCareTaker) {
          maitenance = '2'
        }
      this.objRoleAcess.maitenance = maitenance

      this.loaderService.display(true);
      this.ResponseList = [];
      this.roleService.createRoleFeature(this.objRoleAcess).subscribe(result => {
        debugger
        this.ResponseList = result;
        if (this.ResponseList.sts == "200") {
          this.toastr.success('Permissions Updated Successfully');
          this.modelpermission.hide();
          this.modalRootPopUp.hide();
          this.prepareGrid();
        }
        else {
          this.toastr.warning(this.ResponseList.msg);
        }

        this.loaderService.display(false);
      },
        error => {
          this.toastr.success(this.ResponseList.msg);
          this.loaderService.display(false);
        });
    }
  }

  checkMain(chk: any) {
    this.devMainScheduler = false;
    this.devMainCareTaker = false;
    if (chk == 'ct') {
      this.devMainCareTaker = true;
    }
    if (chk == 'ms') {
      this.devMainScheduler = true;
    }
  }
  showCreateReport:boolean = false;
  onSelectedChange(event) {
    debugger
    this.showCreateReport = false;
    this.SelectedFeatureIds = event;
    if(this.SelectedFeatureIds.includes('2e4f4847-aded-4e07-96db-c0134f105cf0')){
      this.showCreateReport = true
    }
    this.filterDropdownListData(this.SelectedFeatureIds)
  }

  filterDropdownListData(dropobj: any) {
    debugger
    this.defaultDrpList = [];
    this.filterDropDownSourceList = [];
    this.dropDownSourceList.forEach(element => {
      dropobj.forEach(ele => {
        if (ele == element.id) {
          element.disabled = false;
          this.filterDropDownSourceList.push(element);
        }
      });
    });

    this.defaultDrpList = this.filterDropDownSourceList;
    var isSelected = false;
    this.defaultDrpList.forEach(element => {
      if (this.defaultFeatureId == element.id) {
        isSelected = true;
      }
    });
    if (!isSelected) {
      this.defaultFeatureId = null;
    }
  }

  spacesCheckedForRoleName(event, name) {
    // debugger
    // if (event.target.value.match(/^[0-9 ]+$/g) || event.target.value.match(/^[ ]+$/g)) {
    //   this.rolemanagementobj.roleName = "";
    //   this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
    //   return false;
    // }
    // else if (event.target.value.startsWith("0") || event.target.value.startsWith("1") ||
    //   event.target.value.startsWith("2") || event.target.value.startsWith("3") ||
    //   event.target.value.startsWith("4") || event.target.value.startsWith("5") ||
    //   event.target.value.startsWith("6") || event.target.value.startsWith("7") ||
    //   event.target.value.startsWith("8") || event.target.value.startsWith("9")) {
    //   this.rolemanagementobj.roleName = "";
    //   this.toastr.warning(this.translate.instant('RoleTitles'));
    //   return false;
    // }
    // else {
    //   return true;
    // }
  }

  pasteWithRole(event, name) {
    if (!this.cmnService.pasteEvent(event, name)) {
      return false;
    }
  }

  pasteWithDescription(event, name) {
    //debugger
    if (event.match(/^[0-9 ]+$/g) || event.match(/^[ ]+$/g)) {
      this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
      return false;
    }
    else if (event.startsWith(" ")) {
      this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("SpacesValidation"));
      return false;
    }
    else if (event.length > 1000) {
      this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("ExceedValidation"));
      return false;
    }
    else if (event.match(/^[a-zA-Z0-9 ]+$/)) {
      return true;
    }
    else {
      this.toastr.warning(this.translate.instant("specialCharacters"));
      return false;
    }
  }

  spacesCheckedForDescription(event, name) {
    // if (event.target.value.match(/^[0-9 ]+$/g) || event.target.value.match(/^[ ]+$/g)) {
    //   this.rolemanagementobj.description = "";
    //   this.toastr.warning(this.translate.instant(name) + " " + this.translate.instant("NumericSpacesValidation"));
    //   return false;
    // }
  }
}
export class SelectedDefaultDrp {
  public id: string;
  public name: string;
  public disabled: boolean
}

export class RoleAccess {
  public roleID: string;
  public clientID: string;
  public loginUserID: string;
  public featureIDs: string;
  public defaultFeatureId: string;
  public control: string;
  public createReport: string;
}