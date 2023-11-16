import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

import { login } from '../../component/appmenu/appmenu.component';
import { IdeaBService } from '../../GlobalServices/ideab.service';
@Component({
  selector: 'app-helpdoc',
  templateUrl: './helpdoc.component.html',
  styleUrls: ['./helpdoc.component.css']
})
export class HelpdocComponent implements OnInit {
  @Output('childData') isFeedback = new EventEmitter<boolean>();
  arrayList: any = [];
  subarrayList: any = [];
  divhide: boolean = false
  newlist: any = []
  mainmodule: any = []
  submodule: any = []
  menuList: Array<{ mainmodule: string, children: any }> = [];
  title: string;
  routerLinkPath: string;
  DisplayName: string;
  iconClass: string;
  UserName: string;
  loginObj = new login();
  loginUserName: string = "";
  public fileName;
  public isLoaded = false;
  ReadMore: boolean = true
  mySidebarwidth: any
  mySidebarmargin: any
  mainleftmargin: any
  mainleftwidth: any
  objwidth: any
  docurl: any
  //hiding info box
  visible: boolean = false

  constructor(private sanitizer: DomSanitizer, private _http: HttpClient,

    private _commanServices: IdeaBService,) { }

  ngOnInit() {

    debugger


    this.fileName = this.sanitizer.bypassSecurityTrustResourceUrl("https://adminiot.iotsolution.net/FTP_SensorCnt/IoTApplicationDocumention/Login/Login.pdf");
    this.arrayList = JSON.parse(localStorage.getItem("help"));
    this.subarrayList = []
    debugger
    this.subarrayList = this.arrayList

    this.openNav()
  }

  onItemSelected(item: any) {
    debugger

    this.subarrayList = this.arrayList.help[item].child;
  }
  
  selectChangeHandler(event: any) {
    debugger
    this.clickedFunction(event.target.value)
    console.log(event.target.value)
  }
  public clearUrl(url) {
    // return this.sanitizer.bypassSecurityTrustUrl(window.location.protocol + '//' + window.location.host + url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  clickedFunction(url: any) {
    debugger
    this.fileName = this.sanitizer.bypassSecurityTrustResourceUrl(url);

  }
  hidediv() {

    if (!this.ReadMore) {
      this.openNav();
    } else {
      this.closeNav();
    }
    this.ReadMore = !this.ReadMore; //not equal to condition
    this.visible = !this.visible


  }
  openNav() {

    this.mySidebarwidth = "252px"
    this.mySidebarmargin = "231px"
    this.mainleftmargin = "210px"
    this.mainleftwidth = "100%"
    this.objwidth = "970px"

  }

  closeNav() {

    this.mySidebarwidth = "0"
    this.mySidebarmargin = "0"
    this.mainleftmargin = "0"
    this.mainleftwidth = "130%"
    this.objwidth = "1230px"
  }
}