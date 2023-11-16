import { Component, OnInit, Output, EventEmitter, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService, Toast } from 'ngx-toastr';
import { Subscription, Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { string } from '@amcharts/amcharts4/core';

@Component({
  selector: 'app-appheader',
  templateUrl: './appheader.component.html',
  styleUrls: ['./appheader.component.css']
})
export class AppheaderComponent implements OnInit {


  @ViewChild('modalProfile') modalProfile: ElementRef;

  @Output() valueChange = new EventEmitter();
  Counter = 0;
  DeviceIdList: any = [];
  private timer;
  private sub: Subscription;
  TimerForAlerts: any;
  getDeviceList: any = [];
  responseData: any = [];
  alertDetails = new AlertDetails();
  alertTotalCounts: Number = 0;
  bellalertTotalCounts: Number = 0;
  //prevAlertTotalCounts: Number = 0;
  pageLodedforAlertcount: any;

  loginBottomLogo: string;

  AppName: any = "";
  loginUserName: any = "";
  emailId: any = "";
  logoImage: any = "";
  uploadImage: any = "";
  userType: any = "";
  contactWebURL: any = "";

  constructor(
    private router: Router,
    private _http: HttpClient,
    private _commanService: IdeaBService,
    private _toaster: ToastrService,
    public translate: TranslateService,
    private zone: NgZone,
  ) {

  }
  isSuperAdmin: boolean = false;
  hasPdfTemplate: boolean = false;

  ngOnInit() {
    //alertCount
    if (sessionStorage.getItem("User_SuperAdmin").toLowerCase() == "superadmin") {
      this.isSuperAdmin = true;
    }

    let hasPdfTemplate = sessionStorage.getItem('ReportpdfTemplate');



    if (hasPdfTemplate == '1') {
      this.hasPdfTemplate = true;
    }
    else {
      this.hasPdfTemplate = false;
    }

    this.contactWebURL = this._commanService.contactWebURL
    this.userType = sessionStorage.getItem('USER_TYPE');
    debugger
    // this._toaster.success('Login ' + this.logoImage)
    if (this.logoImage == "" || this.logoImage == null || this.logoImage == undefined) {
      this.logoImage = sessionStorage.getItem('logoImage');

    }

    this.uploadImage = sessionStorage.getItem('client_UserImage');
    this.AppName = sessionStorage.getItem("Client_AppName");
    this.loginUserName = sessionStorage.getItem("USER_NAME");
    this.emailId = sessionStorage.getItem("LOGIN_USER_EMAIL_ID");


    this.loginBottomLogo = sessionStorage.getItem("bottomLogo");
    this.TimerForAlerts = this._commanService.ALERTTIMER; //For Alert Timer

    this.DeviceIdList = [];
    this.getDeviceList = JSON.parse(sessionStorage.getItem("USER_DEVICES"));

    for (let j = 0; j < this.getDeviceList.length; j++) {
      this.DeviceIdList.push(this.getDeviceList[j].sensorId)
    }

    this.pageLodedforAlertcount = true;

    this.GetAlertsData("");
    this.timer = Observable.timer(0, 30000);
    this.sub = this.timer.subscribe(N => this.GetAlertsData("timer"));

  }

  supportAlertData: any = [];
  alertData: any = [];
  prvAlertData: any = [];
  vehData: any = [];
  alertTypeData: any = [];
  alertobj = new AlertResponse();

  GetAlertsData(resetCountEvent) {
    this._commanService.GetAccessToken(sessionStorage.getItem('LOGIN_USER_EMAIL_ID'));
    const HTTPOPTIONS_ASSET = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + this._commanService.ReAssetToken })
    };

    var obj: any;
    obj = {};

    obj.loginId = sessionStorage.getItem("LOGINUSERID");
    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
    var alertLogin = sessionStorage.getItem('alertLogin');
    var SensorList: any = {}
    SensorList = JSON.parse(sessionStorage.getItem("USER_SENSORS"));

    this._http.post(this._commanService.BASE_URL_ASSET + "Live/GetLiveAlerts", obj, HTTPOPTIONS_ASSET).subscribe(result => {
      if (result != null) {
        this.responseData = result;

        this.alertData = [];

        var objAlert: any
        this.responseData.alerts.forEach(a => {
          objAlert = [];

          objAlert.deviceName = a.deviceName;
          objAlert.state = a.state;
          objAlert.details = a.details;



          var snr: any;
          snr = [];

          snr = SensorList.filter(g => g.shortCode == a.shortCode && g.key == a.sensor1)
          if (snr.length == 0) {

            objAlert.sensor1 = a.sensor1;

            objAlert.sensor = objAlert.sensor1;

            objAlert.colorCode = '#E01F26';//'red'

            this.alertData.push(objAlert);

          }
          else {

            objAlert.sensor1 = snr[0].keyName;


            objAlert.sensor = objAlert.sensor1;
            if (a.sensor2 != '') {
              snr = [];

              snr = SensorList.filter(g => g.shortCode == a.shortCode && g.key == a.sensor2)

              objAlert.sensor2 = snr[0].keyName;

              objAlert.sensor = objAlert.sensor1 + ', ' + objAlert.sensor2;
            }


            if (a.state == "critical") {
              objAlert.colorCode = '#E01F26';//'red'
            }
            else
              if (a.state == "warning") {
                objAlert.colorCode = '#E7C219' //'orange'
              } else
                if (a.state == "good") {
                  objAlert.colorCode = '#00A65A' //'green'
                }

            this.alertData.push(objAlert);
          }

        });

        this.alertTotalCounts = this.alertData.length;

        //check alertobject
        if (sessionStorage.getItem('userClick') == "false") {
          this.bellalertTotalCounts = this.alertTotalCounts;
        }
        var cmpCount: Number = 0;
        var showPopup: boolean = false;

        if (this.prvAlertData.length == 0) {
          this.prvAlertData = this.alertData
          showPopup = true;

          //this.bellalertTotalCounts = this.alertTotalCounts;

        }
        else {
          if (this.alertData.length == 0) {
            this.prvAlertData = this.alertData;
            //this.bellalertTotalCounts = this.alertTotalCounts;

          }
          else {
            this.alertData.forEach(ac => {

              var tempArr = this.prvAlertData.filter(pac => pac.deviceName == ac.deviceName &&
                pac.sensor1 == ac.sensor1 &&
                pac.state == ac.state);

              this.prvAlertData = this.alertData;
              //this.bellalertTotalCounts = this.alertTotalCounts;


              if (tempArr.length == 0) {

                showPopup = true;


                return false;

              }
            });
          }

        }
        if (resetCountEvent == "click") {
          this.bellalertTotalCounts = 0;
          this.userClick("true");
        }
        if (resetCountEvent == "timer") {
          this.showalertcount();
        }
        // if (alertLogin == "true") {
        //   this._toaster.clear();
        //   sessionStorage.removeItem("alertLogin");
        //   sessionStorage.setItem("alertLogin","false");
        //   this.showalertcount();
        //   this.bellalertTotalCounts = 0;
        //   this.userClick("true");
        //   var alertText: string = ""
        //   var idx: number = 0;
        //   this.alertData.forEach(a => {
        //     idx = idx + 1;
        //     alertText += '<b/>' + idx + '.</b> ' + a.deviceName + ' ' + a.state + ' ' + a.details + '<br/>'
        //   });


        //   if (alertText !== "") {
        //     this._toaster.warning(alertText, '', {
        //       timeOut: 5000,
        //       closeButton: true,
        //       enableHtml: true,
        //     });
        //   }
        // }
        // this.prevAlertTotalCounts = this.alertTotalCounts;

      }
      //this.bellalertTotalCounts = 0;
    }, error => {

    })

  }
  showalertcount() {
    var prevAlertTotalCounts = Number(sessionStorage.getItem('previousAlertCount'));
    if (prevAlertTotalCounts == 0 || prevAlertTotalCounts != this.alertTotalCounts) {
      sessionStorage.setItem('previousAlertCount', String(this.alertTotalCounts));
      //prevAlertTotalCounts = Number(this.alertTotalCounts);
      this.userClick("false");
      this.bellalertTotalCounts = this.alertTotalCounts;
    }
    // else {
    //   this.bellalertTotalCounts = 0;
    // }
  }

  userClick(userClick) {
    sessionStorage.removeItem('userClick');
    sessionStorage.setItem("userClick", userClick);
  }
  showAlertList() {
    this.GetAlertsData("click");
  }


  // openModal(id: string) {
  //   this.modalService.open(id);
  // }

  // closeModal(id: string) {
  //   this.modalService.close(id);
  // }



  profile() {
    this.router.navigateByUrl('/pages/master/userProfile')
  }

  LogOut() {

    if (this.sub) {
      this.sub.unsubscribe();
    }

    let logReq = {
      "userMailID": sessionStorage.getItem('LOGIN_USER_EMAIL_ID'),
      "module": "LogOut",
      "actionPerformed": "Logout from web portal"
    }

    this._commanService.logUpdate(logReq);

    sessionStorage.clear();
    // this.router.navigateByUrl('ATMA')
    this.router.navigateByUrl('IoT')
  }

}


export class AlertDetails {
  public tkn: string;
  public imei: string
}

export class AlertResponse {
  public Tracker: string
  public Alert: string
  public Tms: string

  public regNo: string
}
