import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { IdeaBService } from '../../GlobalServices/ideab.service';

declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
import { PagesComponent } from '../../pages.component';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-appmenu',
  templateUrl: './appmenu.component.html',
  styleUrls: ['./appmenu.component.css'],
  outputs: ['childData : isFeedback'],
})
export class AppmenuComponent implements OnInit {
  @Output('childData') isFeedback = new EventEmitter<boolean>();
  arrayList: any = [];
  title: string;
  routerLinkPath: string;
  DisplayName: string;
  iconClass: string;
  UserName: string;
  loginObj = new login();
  loginUserName: string = "";

  constructor(
    private _http: HttpClient,
    private _toaster: ToastrService,
    private _commanServices: IdeaBService,
    private headerToken: PagesComponent,
    public translate: TranslateService) { }

  ngOnInit() {
    this._commanServices.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanServices.ReAssetToken })

    };

    this.loginUserName = sessionStorage.getItem("USER_NAME");
    this.loginObj.userID = sessionStorage.getItem("LOGINUSERID")//this._commanServices.LOGINUSERID;
    this._http.post(this._commanServices.BASE_URL_ASSET + 'Master/GetMenus', this.loginObj, HTTPOPTIONS_ASSET).subscribe(result => {
      this.arrayList = result;

      localStorage.setItem("help", JSON.stringify(this.arrayList));

    }, error => {
      //this._toaster.warning(error.error.error)
    });


    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      trees.tree();
    });
  }


}

export class login {
  public userID: string;
}