import { Component, OnInit } from '@angular/core';
import { IdeaBService } from '../../GlobalServices/ideab.service';

@Component({
  selector: 'app-appfooter',
  templateUrl: './appfooter.component.html',
  styleUrls: ['./appfooter.component.css']
})
export class AppfooterComponent implements OnInit {

  constructor(
    private _commanService: IdeaBService,) { }

  contactNo: any = ""
  contactWebURL: any = ""
  supportMail: any = ""
  companyName: any = ""
  webVersion: any = ""
  thisYear: any = ""

  showFooter: boolean = true;
  loginBottomLogo: any = ""

  hasPdfTemplate: boolean = false;

  ngOnInit() {


    this.companyName = sessionStorage.getItem('companyName')
    this.contactWebURL = sessionStorage.getItem('contactWebURL')
    this.contactNo = sessionStorage.getItem('contactNum')
    this.supportMail = sessionStorage.getItem('supportMail')
    this.webVersion = sessionStorage.getItem('Web_Version');

    var _showFooter = sessionStorage.getItem('showFooter');

    if (_showFooter == '0') {
      this.showFooter = false;
    }
    
    this.loginBottomLogo = sessionStorage.getItem("bottomLogo");

    if (this.webVersion == null || this.webVersion == undefined || this.webVersion == '') {
      this.webVersion == '6.5'
    }

    this.thisYear = new Date().getFullYear();

    let hasPdfTemplate = sessionStorage.getItem('ReportpdfTemplate');



    if (hasPdfTemplate == '1') {
      this.hasPdfTemplate = true;
    }
    else {
      this.hasPdfTemplate = false;
    }
  }

}
