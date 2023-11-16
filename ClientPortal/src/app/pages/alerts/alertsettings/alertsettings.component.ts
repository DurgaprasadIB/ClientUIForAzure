
import { Component, OnInit, ContentChild, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';
import { AlertsServicesService } from './services/alerts-services.service';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { Column, GridOption, Formatters, OnEventArgs, GridOdataService, CaseType, Statistic, AngularGridInstance } from 'angular-slickgrid';
import { LoaderService } from 'src/app/services/loader.service';

import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
declare var $: any;
import "../../../../../node_modules/jquery/dist/jquery.min.js";
import Swal from 'sweetalert2'


@Component({
    selector: 'app-alertsettings',
    templateUrl: './alertsettings.component.html',
    styleUrls: ['./alertsettings.component.css']
})
export class AlertsettingsComponent implements OnInit {

    modalHeader: string;

    @Output() userAction = new EventEmitter();
    @ViewChild('modalRoot') modalRootPopUp: ElementRef;

    deleteAlert: boolean;
    isSpinnerShow: boolean = false;
    responseData: any
    alertRespData: any
    smsCheck: boolean;
    emailCheck: boolean;
    notifCheck: boolean;

    constructor(private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private alertService: AlertsServicesService,
        private commanService: IdeaBService,
        private loaderService: LoaderService) {


    }

    alertsettingtype: any = "";

    ngOnInit() {

        this.alertsettingtype = "New Alert";
        this.smsCheck = false;
        this.loadAlertSettings();
    }

    loadAlertSettings() {
        this.alertService.AlertDetails().subscribe(data => {
            this.responseData = data;
            debugger
            var smsCheckCnt: number = 0;
            var emailCheckCnt: number = 0;
            var notifCheckCnt: number = 0;

            if (this.responseData.length > 0) {

                var alertData;
                var smsIcon = "";
                var emailIcon = "";
                var notifIcon = "";

                alertData = [];

                this.responseData.forEach(element => {
                    debugger
                    if (element.sms == "1") {
                        smsIcon = '<img src="./assets/Images/yes.png" height="20px" width="50px">';
                        smsCheckCnt += 1;
                    }
                    else {
                        smsIcon = '<img src="./assets/Images/no.png" height="20px" width="50px">';
                    }

                    if (element.email == "1") {
                        emailIcon = '<img src="./assets/Images/yes.png" height="20px" width="50px">';
                        emailCheckCnt += 1;
                    }
                    else {
                        emailIcon = '<img src="./assets/Images/no.png" height="20px" width="50px">';
                    }

                    if (element.notif == "1") {
                        notifIcon = '<img src="./assets/Images/yes.png" height="20px" width="50px">';
                        notifCheckCnt += 1;
                    }
                    else {
                        notifIcon = '<img src="./assets/Images/no.png" height="20px" width="50px">';
                    }


                    alertData.push([element.deviceName,
                        smsIcon,
                        emailIcon,
                        notifIcon,
                    element.deviceId,
                    element.sms,
                    element.email,
                    element.notif]);
                });


                this.bindAlertData(alertData);
            }
        });
    }

    bindAlertData(data: any) {
        $('#alertData').dataTable().fnDestroy();
        var table = $('#alertData').DataTable({
            paging: data.length > 0 ? true : false,
            info: data.length > 0 ? true : false,
        });
        table.clear().rows.add(data).draw();

        var that = this;

        $('#alertData tbody').on('click', 'td', function () {

            debugger
            var Index = this.cellIndex

            if (Index == "1" ||
                Index == "2" ||
                Index == "3") {
                var data = $(this).parent();
                var table = $('#alertData').DataTable();
                data = table.row(data).data();

                var obj;

                var sms: string = "";
                var email: string = "";
                var notif: string = "";

                var yesIcon: any
                var noIcon: any

                yesIcon = "";
                yesIcon = '<img src="./assets/Images/yes.png" height="20px" width="50px">';

                noIcon = "";
                noIcon = '<img src="./assets/Images/no.png" height="20px" width="50px">';

                obj = {};

                obj.deviceId = data[4]



                debugger

                if (Index == "1") {
                    sms = "1"
                    if (data[5] == "1") {
                        obj.sms = "0";
                    }
                    else {
                        obj.sms = "1";
                    }
                }
                else {
                    obj.sms = data[5];
                    sms = "0"
                }

                if (Index == "2") {
                    email = "1"
                    if (data[6] == "1") {
                        obj.email = "0";
                    }
                    else {
                        obj.email = "1";
                    }
                }
                else {
                    obj.email = data[6];
                    email = "0"
                }

                if (Index == "3") {
                    notif = "1"
                    if (data[7] == "1") {
                        obj.notif = "0";
                    }
                    else {
                        obj.notif = "1";
                    }
                }
                else {
                    notif = "0"
                    obj.notif = data[7];
                }

                that.updateAlert(obj)

                debugger
                that.alertRespData.forEach(element => {
                    if (element.deviceId == data[4]) {
                        if (sms == "1") {
                            if (data[5] == "1") {
                                element.smsIcon = noIcon;
                                element.sms = "0";
                            }
                            else {
                                element.smsIcon = yesIcon;
                                element.sms = "1";
                            }
                        }
                        else
                            if (email == "1") {
                                if (data[6] == "1") {
                                    element.emailIcon = noIcon;
                                    element.email = "0";
                                }
                                else {
                                    element.emailIcon = yesIcon;
                                    element.email = "1";
                                }
                            }
                            else
                                if (notif == "1") {
                                    if (data[7] == "1") {
                                        element.notifIcon = noIcon;
                                        element.notif = "0";
                                    }
                                    else {
                                        element.notifIcon = yesIcon;
                                        element.notif = "1";
                                    }
                                }
                    }
                });

            }

        });
    }

    checkSMS() {
        debugger

        var obj;

        obj = {};


        if (this.smsCheck) {
            this.smsCheck = false;
            obj.sms = "0";
        }
        else {
            this.smsCheck = true;
            obj.sms = "1";
        }

        this.loaderService.display(true)
        this.updateAlert(obj);
    }

    checkEmail() {
        debugger
        var obj;

        obj = {};

        if (this.emailCheck) {
            this.emailCheck = false;
            obj.email = "0";
        }
        else {
            this.emailCheck = true;
            obj.email = "1";
        }
        this.loaderService.display(true)
        this.updateAlert(obj);
    }

    checkNotif() {
        debugger
        var obj;

        obj = {};

        if (this.notifCheck) {
            this.notifCheck = false;
            obj.notif = "0";
        }
        else {
            this.notifCheck = true;
            obj.notif = "1";
        }
        this.loaderService.display(true)
        this.updateAlert(obj);
    }

    updateAlert(obj) {
        debugger

        this.alertService.updateAlert(obj).subscribe(data => {
            debugger
            this.loaderService.display(false)
            this.responseData = data;

            if (this.responseData.sts = "200") {
                this.loadAlertSettings();
            }
        });

    }
}