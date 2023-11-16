import { Component, OnInit } from '@angular/core';

import { ReportService } from '../service/report.service';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ToastrService } from 'ngx-toastr';
import { ExportExcelService } from '../../GlobalServices/export-excel.service';
import { LoaderService } from 'src/app/services/loader.service';
import { TranslateService } from '@ngx-translate/core';

import * as apexChart from '../../../../js/apexChart.min.js';


declare var $: any;
import 'src/templateJsFiles/bower_components/jquery/dist/jquery.min.js';
import { debug } from 'util';

@Component({
  selector: 'app-iot-report',
  templateUrl: './iot-report.component.html',
  styleUrls: ['./iot-report.component.css']
})
export class IotReportComponent implements OnInit {

  excelShowHide: any = false;
  ResponseList: any = [];
  SupportListList: any = [];
  AlertsDetailsObj: any = new AlertsDetails();
  DeviceList: any;
  SensorList: any;
  maxDate: any = Date;
  dataset: any;

  reportFromDate: any = "";
  reporttoDate: any = "";
  reportDevice: any = "";

  dateRange: any;
  DateRangeList: any = [];
  selectedRange: any = "";

  divHeight: any = "";
  divHeight2: any = "";
  divHeight3: any = "";
  divHeight4: any = "";
  divHeight5: any = "";
  divHeight6: any = "";
  divHeight7: any = "";
  divHeight8: any = "";
  divHeight9: any = "";
  divHeight10: any = "";


  divexHeight: any = "";
  divexHeight2: any = "";
  divexHeight3: any = "";
  divexHeight4: any = "";
  divexHeight5: any = "";
  divexHeight6: any = "";
  divexHeight7: any = "";
  divexHeight8: any = "";
  divexHeight9: any = "";
  divexHeight10: any = "";

  snNames: any;
  snVals: any;
  isDates: boolean = false;
  isSensorData: boolean = false;

  isexChart1Ploted: boolean = false;
  isexChart2Ploted: boolean = false;
  isexChart3Ploted: boolean = false;
  isexChart4Ploted: boolean = false;
  isexChart5Ploted: boolean = false;
  isexChart6Ploted: boolean = false;
  isexChart7Ploted: boolean = false;
  isexChart8Ploted: boolean = false;
  isexChart9Ploted: boolean = false;
  isexChart10Ploted: boolean = false;

  isChart1Ploted: boolean = false;
  isChart2Ploted: boolean = false;
  isChart3Ploted: boolean = false;
  isChart4Ploted: boolean = false;
  isChart5Ploted: boolean = false;
  isChart6Ploted: boolean = false;
  isChart7Ploted: boolean = false;
  isChart8Ploted: boolean = false;
  isChart9Ploted: boolean = false;
  isChart10Ploted: boolean = false;


  chartTitle1: any = ""
  chartTitle2: any = ""
  chartTitle3: any = ""
  chartTitle4: any = ""
  chartTitle5: any = ""
  chartTitle6: any = ""
  chartTitle7: any = ""
  chartTitle8: any = ""
  chartTitle9: any = ""
  chartTitle10: any = ""

  exchartTitle1: any = ""
  exchartTitle2: any = ""
  exchartTitle3: any = ""
  exchartTitle4: any = ""
  exchartTitle5: any = ""
  exchartTitle6: any = ""
  exchartTitle7: any = ""
  exchartTitle8: any = ""
  exchartTitle9: any = ""
  exchartTitle10: any = ""

  TrendValues1: any
  TrendValues2: any
  TrendValues3: any
  TrendValues4: any
  TrendValues5: any
  TrendValues6: any
  TrendValues7: any
  TrendValues8: any
  TrendValues9: any
  TrendValues10: any


  processing = true;
  isGo: boolean = false;
  Exportdataset: any = [];
  ExportPDFdata: any = [];
  status = { text: 'processing...', class: 'alert alert-danger' };
  isShowFooter: boolean = false;
  DateFormat: string;

  period: any = "";
  deviceSelected: any;
  sensorSelectedList: any;

  coverageSelect: any;
  categorySelected: any;
  coverageList: any;
  categoryList: any;

  isAllsnsrSelected: boolean = false;
  isNotAllsnsrSelected: boolean = true;

  isAllDevSelected: boolean = false;
  isNotAllDevSelected: boolean = true;

  alertTypeData: any = [];

  disabeleRegSelectAll = false;
  disableRegUnSelectAll = true;

  disabeleSnsrSelectAll = false;
  disableSnsrRegUnSelectAll = true;

  exTrendValues1: any;
  exTrendValues2: any;
  exTrendValues3: any;
  exTrendValues4: any;
  exTrendValues5: any;
  exTrendValues6: any;
  exTrendValues7: any;
  exTrendValues8: any;
  exTrendValues9: any;
  exTrendValues10: any;

  chartNote: any = "";

  statusList: any;

  constructor(
    private _detailService: ReportService,
    private _commanService: IdeaBService,
    private toastr: ToastrService,
    private _exportExcel: ExportExcelService,
    private loaderService: LoaderService,
    private translate: TranslateService
  ) { }


  bgImage: any;

  ngOnInit() {


    sessionStorage.setItem('liveScreen', "iotReport");
    this.bgImage = sessionStorage.getItem('BGimage');
    this.loaderService.display(true);
    this.DateFormat = "(" + this._commanService.getDateFormat() + ")";
    //this.PleaseselectRegNo = this.translate.instant('PleaseselectRegNo')
    var currentDate = new Date();
    this.AlertsDetailsObj.fromDate = ""// new Date(new Date().setHours(0, 0, 0, 0));
    this.AlertsDetailsObj.toDate = ""//currentDate;
    this.maxDate = currentDate;
    debugger

    this.DeviceList = {}
    this.DeviceList = JSON.parse(sessionStorage.getItem("USER_DEVICES"));

    debugger
    this.SensorList = {}
    this.SensorList = JSON.parse(sessionStorage.getItem("USER_SENSORS"));
    this.SensorList = this.SensorList.filter(item => item.key !== "tms");

    this.isDates = false;

    debugger
    this.coverageList = []

    var cov: any
    cov = []
    cov.covId = "1"
    cov.coverageName = "Device Level"
    this.coverageList.push(cov);

    // sts = []
    // sts.status = "Warning"
    // this.statusList.push(sts);
    //

    this.categoryList = []
    var cat: any
    cat = []
    cat.catId = "1"
    cat.categoryName = "Sensor Data"
    this.categoryList.push(cat);

    cat = []
    cat.catId = "2"
    cat.categoryName = "Exceptions"
    this.categoryList.push(cat);

    this.isSensorData = true;
    this.loadDateRanges();
    this.loaderService.display(false);


  }

  loadDateRanges() {
    //Last 24 Hrs
    //Last 3 Days
    //Last 1 Week
    //Last 10 Days
    //Custom Dates

    this.DateRangeList = []

    var dtRange: any

    dtRange = []
    dtRange.dtId = "24"
    dtRange.dtName = "Last 24 Hrs"

    this.DateRangeList.push(dtRange);

    dtRange = []
    dtRange.dtId = "72"
    dtRange.dtName = "Last 3 Days"

    this.DateRangeList.push(dtRange);

    dtRange = []
    dtRange.dtId = "168"
    dtRange.dtName = "Last 1 Week"

    this.DateRangeList.push(dtRange);

    dtRange = []
    dtRange.dtId = "720"
    dtRange.dtName = "Last 30 Days"

    this.DateRangeList.push(dtRange);

    dtRange = []
    dtRange.dtId = "custom"
    dtRange.dtName = "Custom Dates"

    this.DateRangeList.push(dtRange);

  }

  checkDateRange(event: any) {

    this.selectedRange = event.dtId;

    if (event.dtId == "custom") {
      this.isDates = true;
    }
    else {
      this.isDates = false;
    }
  }

  ploatexChart() {
    debugger

    //DtTime,
    //Critical,
    //Warning,
    //Ok


    //Critical
    var critical: any = {};

    critical.name = 'Critical';
    critical.data = [];
    this.exTrendValues1.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];

      critical.data.push([
        STime, SVal
      ]);


      // critical.data.push(element[1])
    });
    debugger
    //Warning
    var warning: any = {};

    warning.name = 'Warning';
    warning.data = [];
    this.exTrendValues1.forEach(element => {
      var STime = +element[0];
      var SVal = +element[2];

      warning.data.push([
        STime, SVal
      ]);
    });
    debugger
    //OK
    var OK: any = {};

    OK.name = 'OK';
    OK.data = [];

    this.exTrendValues1.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger


    var options = {
      chart: {
        id: "repChart",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      colors: ['#E01F26', '#E7C219', '#00A65A'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      title: {
        text: this.exchartTitle1,
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            debugger
            return val
          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#exChart1"),
      options
    );

    chart.render();
  }

  ploatexChart2() {
    debugger

    //DtTime,
    //Critical,
    //Warning,
    //Ok


    //Critical
    var critical: any = {};

    critical.name = 'Critical';
    critical.data = [];
    this.exTrendValues2.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];

      critical.data.push([
        STime, SVal
      ]);


      // critical.data.push(element[1])
    });
    debugger
    //Warning
    var warning: any = {};

    warning.name = 'Warning';
    warning.data = [];
    this.exTrendValues2.forEach(element => {
      var STime = +element[0];
      var SVal = +element[2];

      warning.data.push([
        STime, SVal
      ]);
    });
    debugger
    //OK
    var OK: any = {};

    OK.name = 'OK';
    OK.data = [];

    this.exTrendValues2.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger


    var options = {
      chart: {
        id: "repChart2",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      colors: ['#E01F26', '#E7C219', '#00A65A'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      title: {
        text: this.exchartTitle2,
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            debugger
            return val
          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#exChart2"),
      options
    );

    chart.render();
  }


  ploatexChart3() {
    debugger

    //DtTime,
    //Critical,
    //Warning,
    //Ok


    //Critical
    var critical: any = {};

    critical.name = 'Critical';
    critical.data = [];
    this.exTrendValues3.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];

      critical.data.push([
        STime, SVal
      ]);


      // critical.data.push(element[1])
    });
    debugger
    //Warning
    var warning: any = {};

    warning.name = 'Warning';
    warning.data = [];
    this.exTrendValues3.forEach(element => {
      var STime = +element[0];
      var SVal = +element[2];

      warning.data.push([
        STime, SVal
      ]);
    });
    debugger
    //OK
    var OK: any = {};

    OK.name = 'OK';
    OK.data = [];

    this.exTrendValues3.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger


    var options = {
      chart: {
        id: "repChart3",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      colors: ['#E01F26', '#E7C219', '#00A65A'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      title: {
        text: this.exchartTitle3,
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            debugger
            return val
          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#exChart3"),
      options
    );

    chart.render();
  }


  ploatexChart4() {
    debugger

    //DtTime,
    //Critical,
    //Warning,
    //Ok


    //Critical
    var critical: any = {};

    critical.name = 'Critical';
    critical.data = [];
    this.exTrendValues4.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];

      critical.data.push([
        STime, SVal
      ]);


      // critical.data.push(element[1])
    });
    debugger
    //Warning
    var warning: any = {};

    warning.name = 'Warning';
    warning.data = [];
    this.exTrendValues4.forEach(element => {
      var STime = +element[0];
      var SVal = +element[2];

      warning.data.push([
        STime, SVal
      ]);
    });
    debugger
    //OK
    var OK: any = {};

    OK.name = 'OK';
    OK.data = [];

    this.exTrendValues4.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger


    var options = {
      chart: {
        id: "repChart4",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      colors: ['#E01F26', '#E7C219', '#00A65A'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      title: {
        text: this.exchartTitle4,
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            debugger
            return val
          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#exChart4"),
      options
    );

    chart.render();
  }

  ploatexChart5() {
    debugger

    //DtTime,
    //Critical,
    //Warning,
    //Ok


    //Critical
    var critical: any = {};

    critical.name = 'Critical';
    critical.data = [];
    this.exTrendValues5.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];

      critical.data.push([
        STime, SVal
      ]);


      // critical.data.push(element[1])
    });
    debugger
    //Warning
    var warning: any = {};

    warning.name = 'Warning';
    warning.data = [];
    this.exTrendValues5.forEach(element => {
      var STime = +element[0];
      var SVal = +element[2];

      warning.data.push([
        STime, SVal
      ]);
    });
    debugger
    //OK
    var OK: any = {};

    OK.name = 'OK';
    OK.data = [];

    this.exTrendValues5.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger


    var options = {
      chart: {
        id: "repChart5",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      colors: ['#E01F26', '#E7C219', '#00A65A'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      title: {
        text: this.exchartTitle5,
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            debugger
            return val
          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#exChart5"),
      options
    );

    chart.render();
  }

  ploatexChart6() {
    debugger

    //DtTime,
    //Critical,
    //Warning,
    //Ok


    //Critical
    var critical: any = {};

    critical.name = 'Critical';
    critical.data = [];
    this.exTrendValues6.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];

      critical.data.push([
        STime, SVal
      ]);


      // critical.data.push(element[1])
    });
    debugger
    //Warning
    var warning: any = {};

    warning.name = 'Warning';
    warning.data = [];
    this.exTrendValues6.forEach(element => {
      var STime = +element[0];
      var SVal = +element[2];

      warning.data.push([
        STime, SVal
      ]);
    });
    debugger
    //OK
    var OK: any = {};

    OK.name = 'OK';
    OK.data = [];

    this.exTrendValues6.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger


    var options = {
      chart: {
        id: "repChart6",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      colors: ['#E01F26', '#E7C219', '#00A65A'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      title: {
        text: this.exchartTitle6,
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            debugger
            return val
          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#exChart6"),
      options
    );

    chart.render();
  }

  ploatexChart7() {
    debugger

    //DtTime,
    //Critical,
    //Warning,
    //Ok


    //Critical
    var critical: any = {};

    critical.name = 'Critical';
    critical.data = [];
    this.exTrendValues7.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];

      critical.data.push([
        STime, SVal
      ]);


      // critical.data.push(element[1])
    });
    debugger
    //Warning
    var warning: any = {};

    warning.name = 'Warning';
    warning.data = [];
    this.exTrendValues7.forEach(element => {
      var STime = +element[0];
      var SVal = +element[2];

      warning.data.push([
        STime, SVal
      ]);
    });
    debugger
    //OK
    var OK: any = {};

    OK.name = 'OK';
    OK.data = [];

    this.exTrendValues7.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger


    var options = {
      chart: {
        id: "repChart7",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      colors: ['#E01F26', '#E7C219', '#00A65A'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      title: {
        text: this.exchartTitle7,
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            debugger
            return val
          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#exChart7"),
      options
    );

    chart.render();
  }

  ploatexChart8() {
    debugger

    //DtTime,
    //Critical,
    //Warning,
    //Ok


    //Critical
    var critical: any = {};

    critical.name = 'Critical';
    critical.data = [];
    this.exTrendValues8.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];

      critical.data.push([
        STime, SVal
      ]);


      // critical.data.push(element[1])
    });
    debugger
    //Warning
    var warning: any = {};

    warning.name = 'Warning';
    warning.data = [];
    this.exTrendValues8.forEach(element => {
      var STime = +element[0];
      var SVal = +element[2];

      warning.data.push([
        STime, SVal
      ]);
    });
    debugger
    //OK
    var OK: any = {};

    OK.name = 'OK';
    OK.data = [];

    this.exTrendValues8.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger


    var options = {
      chart: {
        id: "repChart8",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      colors: ['#E01F26', '#E7C219', '#00A65A'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      title: {
        text: this.exchartTitle8,
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            debugger
            return val
          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#exChart8"),
      options
    );

    chart.render();
  }

  ploatexChart9() {
    debugger

    //DtTime,
    //Critical,
    //Warning,
    //Ok


    //Critical
    var critical: any = {};

    critical.name = 'Critical';
    critical.data = [];
    this.exTrendValues9.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];

      critical.data.push([
        STime, SVal
      ]);


      // critical.data.push(element[1])
    });
    debugger
    //Warning
    var warning: any = {};

    warning.name = 'Warning';
    warning.data = [];
    this.exTrendValues9.forEach(element => {
      var STime = +element[0];
      var SVal = +element[2];

      warning.data.push([
        STime, SVal
      ]);
    });
    debugger
    //OK
    var OK: any = {};

    OK.name = 'OK';
    OK.data = [];

    this.exTrendValues9.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger


    var options = {
      chart: {
        id: "repChart9",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      colors: ['#E01F26', '#E7C219', '#00A65A'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      title: {
        text: this.exchartTitle9,
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            debugger
            return val
          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#exChart9"),
      options
    );

    chart.render();
  }

  ploatexChart10() {
    debugger

    //DtTime,
    //Critical,
    //Warning,
    //Ok


    //Critical
    var critical: any = {};

    critical.name = 'Critical';
    critical.data = [];
    this.exTrendValues10.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];

      critical.data.push([
        STime, SVal
      ]);


      // critical.data.push(element[1])
    });
    debugger
    //Warning
    var warning: any = {};

    warning.name = 'Warning';
    warning.data = [];
    this.exTrendValues10.forEach(element => {
      var STime = +element[0];
      var SVal = +element[2];

      warning.data.push([
        STime, SVal
      ]);
    });
    debugger
    //OK
    var OK: any = {};

    OK.name = 'OK';
    OK.data = [];

    this.exTrendValues10.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger


    var options = {
      chart: {
        id: "repChart10",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      colors: ['#E01F26', '#E7C219', '#00A65A'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A']
      },
      title: {
        text: this.exchartTitle10,
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            debugger
            return val
          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#exChart10"),
      options
    );

    chart.render();
  }


  loadDefaultAlerts() {
    var obj: any

    obj = {}
    obj.SensorId = []

    this.SensorList.forEach(element => {
      obj.SensorId.push(element.key)
    });

    obj.status = []

    obj.page = "Top"

    this.statusList.forEach(element => {
      obj.status.push(element.status)
    });

    this.period = "Latest 50 Alert Details"
    this.loadReport(obj);
  }

  loadReport(obj: any) {

    debugger

    obj.reportType = "chart";
    obj.clientLogo = sessionStorage.getItem('logoImage');
    obj.userName = sessionStorage.getItem("USER_NAME");
    obj.userEmailId =sessionStorage.getItem("LOGIN_USER_EMAIL_ID");

    this.loaderService.display(true);
    if (obj.type != "ExceptionData") {
      this.isSensorData = true;
      this._detailService.GetDeviceData(obj).subscribe(result => {
        this.loaderService.display(false);
        debugger
        this.dataset = [];
        this.Exportdataset = [];
        this.ExportPDFdata = [];
        this.ResponseList = []

        this.ResponseList = result;


        this.TrendValues1 = [];
        this.TrendValues2 = [];
        this.TrendValues3 = [];
        this.TrendValues4 = [];
        this.TrendValues5 = [];
        this.TrendValues6 = [];
        this.TrendValues7 = [];
        this.TrendValues8 = [];
        this.TrendValues9 = [];
        this.TrendValues10 = [];

        if (this.ResponseList.snsrData.length >= 1) {
          this.chartTitle1 = this.ResponseList.snsrData[0].snsr + "|" + this.ResponseList.snsrData[0].snsr;
          this.ResponseList.snsrData[0].vals.forEach(e => {
            var STime = +e.time;
            var SVal = +e.value;

            this.TrendValues1.push([
              STime,
              SVal
            ])
          });

          this.divHeight = "266"

          if (!this.isChart1Ploted) {
            this.ploatSensorChart1();
            this.isChart1Ploted = true;
          }
          else {
            apexChart.exec('sensrChart1', "updateSeries", [
              {
                name: this.chartTitle1.split('|')[0],
                data: this.TrendValues1
              }
            ]);
            apexChart.exec('sensrChart1', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.chartTitle1.split('|')[1]//'Price'
              }
            });
          }
        }
        else {
          this.divHeight = "0";

          apexChart.exec('sensrChart1', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        debugger
        if (this.ResponseList.snsrData.length >= 2) {
          this.divHeight2 = "266";
          this.chartTitle2 = this.ResponseList.snsrData[1].snsr + "|" + this.ResponseList.snsrData[1].snsr;
          this.ResponseList.snsrData[1].vals.forEach(e => {

            var STime = +e.time;
            var SVal = +e.value;

            this.TrendValues2.push([
              STime,
              SVal
            ])
          });

          if (!this.isChart2Ploted) {
            this.ploatSensorChart2();
            this.isChart2Ploted = true;
          }
          else {


            apexChart.exec('sensrChart2', "updateSeries", [

              {
                name: this.chartTitle2.split('|')[0],
                data: this.TrendValues2
              }

            ]);
            apexChart.exec('sensrChart2', "updateOptions", {
              chart: {
                height: 250,

                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.chartTitle2.split('|')[1]//'Price'
              }
            });
          }

        }
        else {
          this.divHeight2 = "0";

          apexChart.exec('sensrChart2', "updateOptions", {
            chart: {
              height: 0,

              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        debugger
        if (this.ResponseList.snsrData.length >= 3) {

          this.chartTitle3 = this.ResponseList.snsrData[2].snsr + "|" + this.ResponseList.snsrData[2].snsr;
          this.ResponseList.snsrData[2].vals.forEach(e => {

            var STime = +e.time;
            var SVal = +e.value;

            this.TrendValues3.push([
              STime,
              SVal
            ])
          });
          this.divHeight3 = "266";

          if (!this.isChart3Ploted) {
            this.ploatSensorChart3();
            this.isChart3Ploted = true;
          }
          else {
            apexChart.exec('sensrChart3', "updateSeries", [

              {
                name: this.chartTitle3.split('|')[0],
                data: this.TrendValues3
              }

            ]);
            apexChart.exec('sensrChart3', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.chartTitle3.split('|')[1]//'Price'
              },

            });
          }
        }
        else {
          this.divHeight3 = "0";

          apexChart.exec('sensrChart3', "updateOptions", {
            chart: {
              height: 0,

              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        if (this.ResponseList.snsrData.length >= 4) {
          this.divHeight4 = "266";

          this.chartTitle4 = this.ResponseList.snsrData[3].snsr + "|" + this.ResponseList.snsrData[3].snsr;
          this.ResponseList.snsrData[3].vals.forEach(e => {

            var STime = +e.time;
            var SVal = +e.value;

            this.TrendValues4.push([
              STime,
              SVal
            ])
          });

          if (!this.isChart4Ploted) {
            this.ploatSensorChart4();
            this.isChart4Ploted = true;
          }
          else {

            apexChart.exec('sensrChart4', "updateSeries", [

              {
                name: this.chartTitle4.split('|')[0],
                data: this.TrendValues4
              }

            ]);
            apexChart.exec('sensrChart4', "updateOptions", {
              title: {
                text: this.chartTitle4.split('|')[1]//'Price'
              },
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },

            });
          }
        }
        else {

          apexChart.exec('sensrChart4', "updateOptions", {
            chart: {
              height: 0,

              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
          this.divHeight4 = "0";
        }

        if (this.ResponseList.snsrData.length >= 5) {
          this.divHeight5 = "266";
          this.chartTitle5 = this.ResponseList.snsrData[4].snsr + "|" + this.ResponseList.snsrData[4].snsr;
          this.ResponseList.snsrData[4].vals.forEach(e => {
            var STime = +e.time;
            var SVal = +e.value;

            this.TrendValues5.push([
              STime,
              SVal
            ])
          });

          if (!this.isChart5Ploted) {
            this.ploatSensorChart5();
            this.isChart5Ploted = true;
          }
          else {
            apexChart.exec('sensrChart5', "updateSeries", [
              {
                name: this.chartTitle5.split('|')[0],
                data: this.TrendValues5
              }
            ]);
            apexChart.exec('sensrChart5', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.chartTitle5.split('|')[1]//'Price'
              }
            });
          }

        }
        else {
          this.divHeight5 = "0";
          apexChart.exec('sensrChart5', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        if (this.ResponseList.snsrData.length >= 6) {
          this.divHeight6 = "266";
          this.chartTitle6 = this.ResponseList.snsrData[5].snsr + "|" + this.ResponseList.snsrData[5].snsr;
          this.ResponseList.snsrData[5].vals.forEach(e => {
            var STime = +e.time;
            var SVal = +e.value;
            this.TrendValues6.push([
              STime,
              SVal
            ])
          });

          if (!this.isChart6Ploted) {
            this.ploatSensorChart6();
            this.isChart6Ploted = true;
          }
          else {
            apexChart.exec('sensrChart6', "updateSeries", [
              {
                name: this.chartTitle6.split('|')[0],
                data: this.TrendValues6
              }
            ]);
            apexChart.exec('sensrChart6', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.chartTitle6.split('|')[1]//'Price'
              }
            });
          }

        }
        else {
          this.divHeight6 = "0";
          apexChart.exec('sensrChart6', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        debugger
        if (this.ResponseList.snsrData.length >= 7) {
          this.divHeight7 = "266";
          this.chartTitle7 = this.ResponseList.snsrData[6].snsr + "|" + this.ResponseList.snsrData[6].snsr;
          this.ResponseList.snsrData[6].vals.forEach(e => {
            var STime = +e.time;
            var SVal = +e.value;
            this.TrendValues7.push([
              STime,
              SVal
            ])
          });

          if (!this.isChart7Ploted) {
            this.ploatSensorChart7();
            this.isChart7Ploted = true;
          }
          else {
            apexChart.exec('sensrChart7', "updateSeries", [
              {
                name: this.chartTitle7.split('|')[0],
                data: this.TrendValues7
              }
            ]);
            apexChart.exec('sensrChart7', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.chartTitle7.split('|')[1]//'Price'
              }
            });
          }

        }
        else {
          this.divHeight7 = "0";
          apexChart.exec('sensrChart7', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        if (this.ResponseList.snsrData.length >= 8) {
          this.divHeight8 = "266";
          this.chartTitle8 = this.ResponseList.snsrData[7].snsr + "|" + this.ResponseList.snsrData[7].snsr;
          this.ResponseList.snsrData[7].vals.forEach(e => {
            var STime = +e.time;
            var SVal = +e.value;
            this.TrendValues8.push([
              STime,
              SVal
            ])
          });

          if (!this.isChart8Ploted) {
            this.ploatSensorChart8();
            this.isChart8Ploted = true;
          }
          else {
            apexChart.exec('sensrChart8', "updateSeries", [
              {
                name: this.chartTitle8.split('|')[0],
                data: this.TrendValues8
              }
            ]);
            apexChart.exec('sensrChart8', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.chartTitle8.split('|')[1]//'Price'
              }
            });
          }

        }
        else {
          this.divHeight8 = "0";
          apexChart.exec('sensrChart8', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        if (this.ResponseList.snsrData.length >= 9) {
          this.divHeight9 = "266";
          this.chartTitle9 = this.ResponseList.snsrData[8].snsr + "|" + this.ResponseList.snsrData[8].snsr;
          this.ResponseList.snsrData[8].vals.forEach(e => {
            var STime = +e.time;
            var SVal = +e.value;
            this.TrendValues9.push([
              STime,
              SVal
            ])
          });

          if (!this.isChart9Ploted) {
            this.ploatSensorChart9();
            this.isChart9Ploted = true;
          }
          else {
            apexChart.exec('sensrChart9', "updateSeries", [
              {
                name: this.chartTitle9.split('|')[0],
                data: this.TrendValues9
              }
            ]);
            apexChart.exec('sensrChart9', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.chartTitle9.split('|')[1]//'Price'
              }
            });
          }

        }
        else {
          this.divHeight9 = "0";
          apexChart.exec('sensrChart9', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        if (this.ResponseList.snsrData.length >= 10) {

          this.divHeight10 = "266";
          this.chartTitle10 = this.ResponseList.snsrData[9].snsr + "|" + this.ResponseList.snsrData[9].snsr;
          this.ResponseList.snsrData[9].vals.forEach(e => {
            var STime = +e.time;
            var SVal = +e.value;
            this.TrendValues10.push([
              STime,
              SVal
            ])
          });

          if (!this.isChart10Ploted) {
            this.ploatSensorChart10();
            this.isChart10Ploted = true;
          }
          else {
            apexChart.exec('sensrChart10', "updateSeries", [
              {
                name: this.chartTitle10.split('|')[0],
                data: this.TrendValues10
              }
            ]);
            apexChart.exec('sensrChart10', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.chartTitle10.split('|')[1]//'Price'
              }
            });
          }

        }
        else {
          this.divHeight10 = "0";
          apexChart.exec('sensrChart10', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        this.reportFromDate = this.ResponseList.fromDate;
        this.reporttoDate = this.ResponseList.toDate;



        debugger


        // this.isShowFooter = true;

      });
    }
    else {
      this._detailService.GetExcData(obj).subscribe(result => {
        this.loaderService.display(false);
        debugger
        this.dataset = [];
        this.Exportdataset = [];
        this.ExportPDFdata = [];
        this.ResponseList = [];

        this.exTrendValues1 = [];
        this.exTrendValues2 = [];
        this.exTrendValues3 = [];
        this.exTrendValues4 = [];
        this.exTrendValues5 = [];
        this.exTrendValues6 = [];
        this.exTrendValues7 = [];
        this.exTrendValues8 = [];
        this.exTrendValues9 = [];
        this.exTrendValues10 = [];

        this.ResponseList = result;

        if (this.ResponseList.length >= 1) {


          this.divexHeight = "266";

          this.exchartTitle1 = this.ResponseList[0].snsrName;

          this.ResponseList[0].Duration.forEach(e => {
            var DtTime = +e.date;
            var Critical = +e.critical;
            var Warning = +e.warning;
            var Ok = +e.ok;

            this.exTrendValues1.push([
              DtTime,
              Critical,
              Warning,
              Ok
            ])
          });

          debugger


          if (!this.isexChart1Ploted) {
            this.ploatexChart();

            this.isexChart1Ploted = true;
          }
          else {

            //Critical
            var critical: any = {};

            critical.name = 'Critical';
            critical.data = [];
            this.exTrendValues1.forEach(element => {

              var STime = +element[0];
              var SVal = +element[1];

              critical.data.push([
                STime, SVal
              ]);


            });
            debugger
            //Warning
            var warning: any = {};

            warning.name = 'Warning';
            warning.data = [];
            this.exTrendValues1.forEach(element => {
              var STime = +element[0];
              var SVal = +element[2];

              warning.data.push([
                STime, SVal
              ]);
            });
            debugger
            //OK
            var OK: any = {};

            OK.name = 'OK';
            OK.data = [];

            this.exTrendValues1.forEach(element => {

              var STime = +element[0];
              var SVal = +element[3];


              OK.data.push([
                STime, SVal
              ]);

            });
            debugger



            apexChart.exec('repChart', "updateSeries", [
              critical, warning, OK
            ]);


            apexChart.exec('repChart', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.exchartTitle1
              },
            });
          }
        }
        else {
          this.divexHeight = "0";

          apexChart.exec('repChart', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });

        }


        if (this.ResponseList.length >= 2) {

          this.divexHeight2 = "266";

          this.exchartTitle2 = this.ResponseList[1].snsrName;

          this.ResponseList[1].Duration.forEach(e => {
            var DtTime = +e.date;
            var Critical = +e.critical;
            var Warning = +e.warning;
            var Ok = +e.ok;

            this.exTrendValues2.push([
              DtTime,
              Critical,
              Warning,
              Ok
            ])
          });

          debugger


          if (!this.isexChart2Ploted) {
            this.ploatexChart2();

            this.isexChart2Ploted = true;
          }
          else {

            //Critical
            var critical: any = {};

            critical.name = 'Critical';
            critical.data = [];
            this.exTrendValues2.forEach(element => {

              var STime = +element[0];
              var SVal = +element[1];

              critical.data.push([
                STime, SVal
              ]);
            });
            debugger
            //Warning
            var warning: any = {};

            warning.name = 'Warning';
            warning.data = [];
            this.exTrendValues2.forEach(element => {
              var STime = +element[0];
              var SVal = +element[2];

              warning.data.push([
                STime, SVal
              ]);
            });
            debugger
            //OK
            var OK: any = {};

            OK.name = 'OK';
            OK.data = [];

            this.exTrendValues2.forEach(element => {

              var STime = +element[0];
              var SVal = +element[3];


              OK.data.push([
                STime, SVal
              ]);

            });
            debugger



            apexChart.exec('repChart2', "updateSeries", [
              critical, warning, OK
            ]);

            apexChart.exec('repChart2', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.exchartTitle2
              },
            });

          }
        }
        else {
          this.divexHeight2 = "0";

          apexChart.exec('repChart2', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        if (this.ResponseList.length >= 3) {

          this.divexHeight3 = "266";
          this.exchartTitle3 = this.ResponseList[2].snsrName;

          this.ResponseList[2].Duration.forEach(e => {
            var DtTime = +e.date;
            var Critical = +e.critical;
            var Warning = +e.warning;
            var Ok = +e.ok;

            this.exTrendValues3.push([
              DtTime,
              Critical,
              Warning,
              Ok
            ])
          });

          debugger


          if (!this.isexChart3Ploted) {
            this.ploatexChart3();

            this.isexChart3Ploted = true;
          }
          else {

            //Critical
            var critical: any = {};

            critical.name = 'Critical';
            critical.data = [];
            this.exTrendValues3.forEach(element => {

              var STime = +element[0];
              var SVal = +element[1];

              critical.data.push([
                STime, SVal
              ]);
            });
            debugger
            //Warning
            var warning: any = {};

            warning.name = 'Warning';
            warning.data = [];
            this.exTrendValues3.forEach(element => {
              var STime = +element[0];
              var SVal = +element[2];

              warning.data.push([
                STime, SVal
              ]);
            });
            debugger
            //OK
            var OK: any = {};

            OK.name = 'OK';
            OK.data = [];

            this.exTrendValues3.forEach(element => {

              var STime = +element[0];
              var SVal = +element[3];


              OK.data.push([
                STime, SVal
              ]);

            });
            debugger



            apexChart.exec('repChart3', "updateSeries", [
              critical, warning, OK
            ]);

            apexChart.exec('repChart3', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.exchartTitle3
              },
            });
          }
        }
        else {
          this.divexHeight3 = "0";

          apexChart.exec('repChart3', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        if (this.ResponseList.length >= 4) {

          this.divexHeight4 = "266";
          this.exchartTitle4 = this.ResponseList[3].snsrName;


          this.ResponseList[3].Duration.forEach(e => {
            var DtTime = +e.date;
            var Critical = +e.critical;
            var Warning = +e.warning;
            var Ok = +e.ok;

            this.exTrendValues4.push([
              DtTime,
              Critical,
              Warning,
              Ok
            ])
          });

          debugger


          if (!this.isexChart4Ploted) {
            this.ploatexChart4();

            this.isexChart4Ploted = true;
          }
          else {

            //Critical
            var critical: any = {};

            critical.name = 'Critical';
            critical.data = [];
            this.exTrendValues4.forEach(element => {

              var STime = +element[0];
              var SVal = +element[1];

              critical.data.push([
                STime, SVal
              ]);
            });
            debugger
            //Warning
            var warning: any = {};

            warning.name = 'Warning';
            warning.data = [];
            this.exTrendValues4.forEach(element => {
              var STime = +element[0];
              var SVal = +element[2];

              warning.data.push([
                STime, SVal
              ]);
            });
            debugger
            //OK
            var OK: any = {};

            OK.name = 'OK';
            OK.data = [];

            this.exTrendValues4.forEach(element => {

              var STime = +element[0];
              var SVal = +element[3];


              OK.data.push([
                STime, SVal
              ]);

            });
            debugger



            apexChart.exec('repChart4', "updateSeries", [
              critical, warning, OK
            ]);

            apexChart.exec('repChart4', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.exchartTitle4
              },
            });
          }
        }
        else {
          this.divexHeight4 = "0";

          apexChart.exec('repChart4', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        if (this.ResponseList.length >= 5) {

          this.divexHeight5 = "266";

          this.exchartTitle5 = this.ResponseList[4].snsrName;


          this.ResponseList[4].Duration.forEach(e => {
            var DtTime = +e.date;
            var Critical = +e.critical;
            var Warning = +e.warning;
            var Ok = +e.ok;

            this.exTrendValues5.push([
              DtTime,
              Critical,
              Warning,
              Ok
            ])
          });

          debugger


          if (!this.isexChart5Ploted) {
            this.ploatexChart5();

            this.isexChart5Ploted = true;
          }
          else {

            //Critical
            var critical: any = {};

            critical.name = 'Critical';
            critical.data = [];
            this.exTrendValues5.forEach(element => {

              var STime = +element[0];
              var SVal = +element[1];

              critical.data.push([
                STime, SVal
              ]);
            });
            debugger
            //Warning
            var warning: any = {};

            warning.name = 'Warning';
            warning.data = [];
            this.exTrendValues5.forEach(element => {
              var STime = +element[0];
              var SVal = +element[2];

              warning.data.push([
                STime, SVal
              ]);
            });
            debugger
            //OK
            var OK: any = {};

            OK.name = 'OK';
            OK.data = [];

            this.exTrendValues5.forEach(element => {

              var STime = +element[0];
              var SVal = +element[3];


              OK.data.push([
                STime, SVal
              ]);

            });
            debugger



            apexChart.exec('repChart5', "updateSeries", [
              critical, warning, OK
            ]);

            apexChart.exec('repChart5', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.exchartTitle5
              },
            });
          }
        }
        else {
          this.divexHeight5 = "0";

          apexChart.exec('repChart5', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        if (this.ResponseList.length >= 6) {

          this.divexHeight6 = "266";
          this.exchartTitle6 = this.ResponseList[5].snsrName;

          this.ResponseList[5].Duration.forEach(e => {
            var DtTime = +e.date;
            var Critical = +e.critical;
            var Warning = +e.warning;
            var Ok = +e.ok;

            this.exTrendValues6.push([
              DtTime,
              Critical,
              Warning,
              Ok
            ])
          });

          debugger


          if (!this.isexChart6Ploted) {
            this.ploatexChart6();

            this.isexChart6Ploted = true;
          }
          else {

            //Critical
            var critical: any = {};

            critical.name = 'Critical';
            critical.data = [];
            this.exTrendValues6.forEach(element => {

              var STime = +element[0];
              var SVal = +element[1];

              critical.data.push([
                STime, SVal
              ]);
            });
            debugger
            //Warning
            var warning: any = {};

            warning.name = 'Warning';
            warning.data = [];
            this.exTrendValues6.forEach(element => {
              var STime = +element[0];
              var SVal = +element[2];

              warning.data.push([
                STime, SVal
              ]);
            });
            debugger
            //OK
            var OK: any = {};

            OK.name = 'OK';
            OK.data = [];

            this.exTrendValues6.forEach(element => {

              var STime = +element[0];
              var SVal = +element[3];


              OK.data.push([
                STime, SVal
              ]);

            });
            debugger



            apexChart.exec('repChart6', "updateSeries", [
              critical, warning, OK
            ]);

            apexChart.exec('repChart6', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.exchartTitle6
              },
            });
          }
        }
        else {
          this.divexHeight6 = "0";

          apexChart.exec('repChart6', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        if (this.ResponseList.length >= 7) {

          this.divexHeight7 = "266";

          this.exchartTitle7 = this.ResponseList[6].snsrName;

          this.ResponseList[6].Duration.forEach(e => {
            var DtTime = +e.date;
            var Critical = +e.critical;
            var Warning = +e.warning;
            var Ok = +e.ok;

            this.exTrendValues7.push([
              DtTime,
              Critical,
              Warning,
              Ok
            ])
          });

          debugger


          if (!this.isexChart7Ploted) {
            this.ploatexChart7();

            this.isexChart7Ploted = true;
          }
          else {

            //Critical
            var critical: any = {};

            critical.name = 'Critical';
            critical.data = [];
            this.exTrendValues7.forEach(element => {

              var STime = +element[0];
              var SVal = +element[1];

              critical.data.push([
                STime, SVal
              ]);
            });
            debugger
            //Warning
            var warning: any = {};

            warning.name = 'Warning';
            warning.data = [];
            this.exTrendValues7.forEach(element => {
              var STime = +element[0];
              var SVal = +element[2];

              warning.data.push([
                STime, SVal
              ]);
            });
            debugger
            //OK
            var OK: any = {};

            OK.name = 'OK';
            OK.data = [];

            this.exTrendValues7.forEach(element => {

              var STime = +element[0];
              var SVal = +element[3];


              OK.data.push([
                STime, SVal
              ]);

            });
            debugger



            apexChart.exec('repChart7', "updateSeries", [
              critical, warning, OK
            ]);

            apexChart.exec('repChart7', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.exchartTitle7
              },
            });
          }
        }
        else {
          this.divexHeight7 = "0";

          apexChart.exec('repChart7', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        if (this.ResponseList.length >= 8) {

          this.divexHeight8 = "266";
          this.exchartTitle8 = this.ResponseList[7].snsrName;

          this.ResponseList[7].Duration.forEach(e => {
            var DtTime = +e.date;
            var Critical = +e.critical;
            var Warning = +e.warning;
            var Ok = +e.ok;

            this.exTrendValues8.push([
              DtTime,
              Critical,
              Warning,
              Ok
            ])
          });

          debugger


          if (!this.isexChart8Ploted) {
            this.ploatexChart8();

            this.isexChart8Ploted = true;
          }
          else {

            //Critical
            var critical: any = {};

            critical.name = 'Critical';
            critical.data = [];
            this.exTrendValues8.forEach(element => {

              var STime = +element[0];
              var SVal = +element[1];

              critical.data.push([
                STime, SVal
              ]);
            });
            debugger
            //Warning
            var warning: any = {};

            warning.name = 'Warning';
            warning.data = [];
            this.exTrendValues8.forEach(element => {
              var STime = +element[0];
              var SVal = +element[2];

              warning.data.push([
                STime, SVal
              ]);
            });
            debugger
            //OK
            var OK: any = {};

            OK.name = 'OK';
            OK.data = [];

            this.exTrendValues8.forEach(element => {

              var STime = +element[0];
              var SVal = +element[3];


              OK.data.push([
                STime, SVal
              ]);

            });
            debugger



            apexChart.exec('repChart8', "updateSeries", [
              critical, warning, OK
            ]);

            apexChart.exec('repChart8', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.exchartTitle8
              },
            });
          }
        }
        else {
          this.divexHeight8 = "0";

          apexChart.exec('repChart8', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }

        if (this.ResponseList.length >= 9) {

          this.divexHeight9 = "266";
          this.exchartTitle9 = this.ResponseList[8].snsrName;

          this.ResponseList[8].Duration.forEach(e => {
            var DtTime = +e.date;
            var Critical = +e.critical;
            var Warning = +e.warning;
            var Ok = +e.ok;

            this.exTrendValues9.push([
              DtTime,
              Critical,
              Warning,
              Ok
            ])
          });

          debugger


          if (!this.isexChart9Ploted) {
            this.ploatexChart9();

            this.isexChart9Ploted = true;
          }
          else {

            //Critical
            var critical: any = {};

            critical.name = 'Critical';
            critical.data = [];
            this.exTrendValues9.forEach(element => {

              var STime = +element[0];
              var SVal = +element[1];

              critical.data.push([
                STime, SVal
              ]);
            });
            debugger
            //Warning
            var warning: any = {};

            warning.name = 'Warning';
            warning.data = [];
            this.exTrendValues9.forEach(element => {
              var STime = +element[0];
              var SVal = +element[2];

              warning.data.push([
                STime, SVal
              ]);
            });
            debugger
            //OK
            var OK: any = {};

            OK.name = 'OK';
            OK.data = [];

            this.exTrendValues9.forEach(element => {

              var STime = +element[0];
              var SVal = +element[3];


              OK.data.push([
                STime, SVal
              ]);

            });
            debugger



            apexChart.exec('repChart9', "updateSeries", [
              critical, warning, OK
            ]);

            apexChart.exec('repChart9', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.exchartTitle9
              }
            });
          }
        }
        else {
          this.divexHeight9 = "0";

          apexChart.exec('repChart9', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },

          });
        }


        if (this.ResponseList.length >= 10) {

          this.divexHeight10 = "266";
          this.exchartTitle10 = this.ResponseList[9].snsrName;

          this.ResponseList[9].Duration.forEach(e => {
            var DtTime = +e.date;
            var Critical = +e.critical;
            var Warning = +e.warning;
            var Ok = +e.ok;

            this.exTrendValues10.push([
              DtTime,
              Critical,
              Warning,
              Ok
            ])
          });

          debugger


          if (!this.isexChart10Ploted) {
            this.ploatexChart10();

            this.isexChart10Ploted = true;
          }
          else {

            //Critical
            var critical: any = {};

            critical.name = 'Critical';
            critical.data = [];
            this.exTrendValues10.forEach(element => {

              var STime = +element[0];
              var SVal = +element[1];

              critical.data.push([
                STime, SVal
              ]);
            });
            debugger
            //Warning
            var warning: any = {};

            warning.name = 'Warning';
            warning.data = [];
            this.exTrendValues10.forEach(element => {
              var STime = +element[0];
              var SVal = +element[2];

              warning.data.push([
                STime, SVal
              ]);
            });
            debugger
            //OK
            var OK: any = {};

            OK.name = 'OK';
            OK.data = [];

            this.exTrendValues10.forEach(element => {

              var STime = +element[0];
              var SVal = +element[3];


              OK.data.push([
                STime, SVal
              ]);

            });
            debugger



            apexChart.exec('repChart10', "updateSeries", [
              critical, warning, OK
            ]);

            apexChart.exec('repChart10', "updateOptions", {
              chart: {
                height: 250,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                  },
                },
              },
              title: {
                text: this.exchartTitle10
              }
            });
          }
        }
        else {
          this.divexHeight10 = "0";

          apexChart.exec('repChart10', "updateOptions", {
            chart: {
              height: 0,
              toolbar: {
                show: false,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                },
              },
            },
          });
        }



      });
    }

  }

  BindTableData(ds: any) {
    debugger;

    var data = [];
    this.snNames = [];
    this.snVals = [];
    var i: number = 0;

    ds.live.forEach(element => {

      // debugger;
      if (i == 0) {

        this.snNames = element.snsr;


        i += 1;
      }
    });

    debugger

    this.reportDevice = this.ResponseList[0].snsrVal[0];

    // this.reportFromDate = this.reportFromDate.split(' ')[0];

    var pdfHeader: any
    pdfHeader = {}
    this.ExportPDFdata = []

    var pdfHdrLst: any
    pdfHdrLst = []

    pdfHeader = {}
    pdfHeader.text = 'Date Time (IST)';
    pdfHeader.style = 'tableHeader';

    pdfHdrLst.push(pdfHeader)

    for (let index = 2; index < this.snNames.length; index++) {
      pdfHeader = {}
      pdfHeader.text = this.snNames[index];
      pdfHeader.style = 'tableHeader';

      pdfHdrLst.push(pdfHeader)
    }

    // this.snNames.forEach(element => {


    // });

    this.ExportPDFdata.push(pdfHdrLst);


    this.snVals = [];
    this.snVals = ds.live;

    var pdfData: any
    pdfData = []



    this.snVals.forEach(element => {

      var pdfClmData: any
      pdfClmData = []

      for (let index = 1; index < element.snsrVal.length; index++) {
        pdfData = {}
        pdfData.text = element.snsrVal[index];
        pdfClmData.push(pdfData)
      }

      // element.snsrVal.forEach(elementAt => {

      // });

      this.ExportPDFdata.push(pdfClmData);
    });
    debugger

    if (ds.live.length > 0) {

      this.excelShowHide = true;
      this.isShowFooter = true;
    } else {

      this.excelShowHide = false;
      this.isShowFooter = false;
    }


    $('#newSnrTable').DataTable().destroy();

    var table1 = $('#newSnrTable').DataTable();
    var pageNo = table1.page.info().page;
    var pagelen = table1.page.info().pages;
    var pageSize = table1.page.len();
    var order = table1.order();
    // debugger


    var table = $('#newSnrTable').DataTable({
      "order": [], "sort": [],
      'columnDefs': [{
        'targets': [1, 2], /* column index */
        'orderable': false, /* true or false */
      }],
      searching: this.isShowFooter,
      paging: this.isShowFooter,
      info: this.isShowFooter,
      "pageLength": pageSize,
    });

    table.clear().rows.add(this.snVals).order([order[0][0], order[0][1]]).draw();

    try {
      if (pagelen > pageNo) {
        $('#newSnrTable').dataTable().fnPageChange(pageNo);
      }
    } catch (e) {
      e = null;
    }


    jQuery('.dataTable').wrap('<div style="height:55vh;overflow-y:auto;" />');


    // this.loaderService.display(false);
  }

  ploatSensorChart1() {

    this.TrendValues1
    var options = {
      chart: {
        id: "sensrChart1",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: this.chartTitle1.split('|')[0],
        data: this.TrendValues1
      }],
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {

        labels: {
          style: {
            fontFamily: 'helvetica',
          },
          formatter: function (val) {

            var v: any = 0;

            v += val;
            return Math.round(v);
          },

        },
      },
      title: {
        text: this.chartTitle1.split('|')[1]//'Price'
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            fontFamily: 'helvetica',
          }
        },
      },

      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {


            return val

          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#trendChart1"),
      options
    );

    chart.render();
  }
  ploatSensorChart2() {

    var options = {
      chart: {
        id: "sensrChart2",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: this.chartTitle2.split('|')[0],
        data: this.TrendValues2
      }],
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: 'helvetica',
          },
          formatter: function (val) {


            var v: any = 0;

            v += val;
            return Math.round(v);

          },

        },

      },
      title: {
        text: this.chartTitle2.split('|')[1]//'Price'
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            fontFamily: 'helvetica',
          }
        },
      },

      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {


            return val

          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#trendChart2"),
      options
    );
    debugger
    chart.render();
  }
  ploatSensorChart3() {

    var options = {
      chart: {
        id: "sensrChart3",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: this.chartTitle3.split('|')[0],
        data: this.TrendValues3
      }],
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: 'helvetica',
          },
          formatter: function (val) {
            var v: any = 0;

            v += val;
            return Math.round(v);
          },

        },

      },
      title: {
        text: this.chartTitle3.split('|')[1]//'Price'
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            fontFamily: 'helvetica',
          }
        },
      },

      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {


            return val

          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#trendChart3"),
      options
    );
    debugger
    chart.render();
  }
  ploatSensorChart4() {
    debugger
    var options = {
      chart: {
        id: "sensrChart4",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: this.chartTitle4.split('|')[0],
        data: this.TrendValues4
      }],
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: 'helvetica',
          },
          formatter: function (val) {
            var v: any = 0;

            v += val;
            return Math.round(v);

          },

        },

      }, title: {
        text: this.chartTitle4.split('|')[1]//'Price'
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            fontFamily: 'helvetica',
          }
        },
      },

      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {


            return val

          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#trendChart4"),
      options
    );

    chart.render();
  }
  ploatSensorChart5() {
    debugger
    var options = {
      chart: {
        id: "sensrChart5",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: this.chartTitle5.split('|')[0],
        data: this.TrendValues5
      }],
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: 'helvetica',
          },
          formatter: function (val) {
            var v: any = 0;

            v += val;
            return Math.round(v);

          },

        },

      },
      title: {
        text: this.chartTitle5.split('|')[1]//'Price'
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            fontFamily: 'helvetica',
          }
        },
      },

      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {


            return val

          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#trendChart5"),
      options
    );

    chart.render();
  }
  ploatSensorChart6() {
    debugger
    var options = {
      chart: {
        id: "sensrChart6",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: this.chartTitle6.split('|')[0],
        data: this.TrendValues6
      }],
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: 'helvetica',
          },
          formatter: function (val) {

            var v: any = 0;

            v += val;
            return Math.round(v);

          },

        },

      },
      title: {
        text: this.chartTitle6.split('|')[1]//'Price'
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            fontFamily: 'helvetica',
          }
        },
      },

      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {


            return val

          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#trendChart6"),
      options
    );

    chart.render();
  }
  ploatSensorChart7() {
    debugger
    var options = {
      chart: {
        id: "sensrChart7",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: this.chartTitle7.split('|')[0],
        data: this.TrendValues7
      }],
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: 'helvetica',
          },
          formatter: function (val) {

            var v: any = 0;

            v += val;
            return Math.round(v);

          },

        },

      },
      title: {
        text: this.chartTitle7.split('|')[1]//'Price'
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            fontFamily: 'helvetica',
          }
        },
      },

      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {


            return val

          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#trendChart7"),
      options
    );

    chart.render();
  }
  ploatSensorChart8() {
    debugger
    var options = {
      chart: {
        id: "sensrChart8",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: this.chartTitle8.split('|')[0],
        data: this.TrendValues8
      }],
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: 'helvetica',
          },
          formatter: function (val) {

            var v: any = 0;

            v += val;
            return Math.round(v);
          },

        },

      },
      title: {
        text: this.chartTitle8.split('|')[1]//'Price'
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            fontFamily: 'helvetica',
          }
        },
      },

      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {


            return val

          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#trendChart8"),
      options
    );

    chart.render();
  }
  ploatSensorChart9() {
    debugger
    var options = {
      chart: {
        id: "sensrChart9",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: this.chartTitle9.split('|')[0],
        data: this.TrendValues9
      }],
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: '',
          },
          formatter: function (val) {
            var v: any = 0;

            v += val;
            return Math.round(v);
          },

        },

      },
      title: {
        text: this.chartTitle9.split('|')[1]//'Price'
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            fontFamily: 'helvetica',
          }
        },
      },

      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {


            return val

          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#trendChart9"),
      options
    );

    chart.render();
  }

  ploatSensorChart10() {
    debugger
    var options = {
      chart: {
        id: "sensrChart10",
        type: 'area',
        stacked: false,
        height: 250,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: false,
          },
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: this.chartTitle10.split('|')[0],
        data: this.TrendValues10
      }],
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: 'helvetica',
          },
          formatter: function (val) {

            var v: any = 0;

            v += val;
            return Math.round(v);
          },

        },

      },
      title: {
        text: this.chartTitle10.split('|')[1]
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            fontFamily: 'helvetica',
          }
        },
      },

      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {


            return val

          }
        }
      }
    }

    var chart = new apexChart(
      document.querySelector("#trendChart10"),
      options
    );

    chart.render();
  }

  devClear() {
    debugger

    this.isNotAllDevSelected = true;
    this.isAllDevSelected = false;
  }

  snsrClear() {
    debugger

    this.isNotAllsnsrSelected = true;
    this.isAllsnsrSelected = false;
  }


  onsnsrSelectAll(isForm: boolean, AlertsDetailsObj) {

    debugger
    this.disabeleSnsrSelectAll = true;
    this.disableSnsrRegUnSelectAll = false;
    this.sensorSelectedList = this.SensorList.map(x => x.key);


  }

  SendReportMail(reportType: any) {
    var obj: any

    obj = {}

    debugger

    obj.DeviceId = this.deviceSelected
    obj.SensorId = this.sensorSelectedList

    obj.clientLogo = sessionStorage.getItem('logoImage');
    obj.userName = sessionStorage.getItem("USER_NAME");
    obj.userEmailId =sessionStorage.getItem("LOGIN_USER_EMAIL_ID");
    
    if (obj.SensorId == undefined || obj.SensorId.length == 0) {

      obj.SensorId = []

      this.SensorList.forEach(element => {
        obj.SensorId.push(element.key)
      });
    }



    if (this.selectedRange == "custom") {
      obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.AlertsDetailsObj.fromDate);
      obj.toDate = this._detailService.dateToYYYYMMDDHHMM(this.AlertsDetailsObj.toDate);

      this.period = obj.frDate + ' To ' + obj.tDate
    }
    else {
      obj.frDate = this.selectedRange;

      var hr = ""// obj.frDate;

      if (obj.frDate == "72") {
        hr = "Last 3 Days";
      }
      else
        if (obj.frDate == "168") {
          hr = "Last 1 Week";
        }
        else
          if (obj.frDate == "720") {
            hr = "Last 30 Days";
          }

      this.period = "For " + hr;//+ " Hrs"
    }


    obj.page = "All"
    obj.reportType = reportType;//"Email"


    if (this.categorySelected == "1") {
      this.isSensorData = true;
      obj.type = "SensorData";


      this._detailService.GetDeviceData(obj).subscribe(result => {
        var resp: any = []

        resp = result;

        if (reportType == "pdf") {
          // window.location.href = resp.msg;
          window.open(resp.msg, '_blank')
        }
        else {
          this.toastr.success("Report has been sent to registered Email");
        }

      });

    }
    else {
      this.isSensorData = false;
      obj.type = "ExceptionData";

      this._detailService.GetExcData(obj).subscribe(result => {
        var resp: any = []

        resp = result;

        debugger;
        if (reportType == "pdf") {
          // window.location.href = resp.msg;
          window.open(resp.msg, '_blank');

        }
        else {
          this.toastr.success("Report has been sent to your registered email id");
        }
      });
    }



  }
  //GetReportDetails(isForm: boolean, AlertsDetailsObj) {
  GetReportDetails() {
    debugger
    var obj: any

    obj = {}

    if (this.categorySelected == "1") {
      this.isSensorData = true;
      obj.type = "SensorData"
    }
    else {
      this.isSensorData = false;
      obj.type = "ExceptionData"
    }

    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
    obj.DeviceId = this.deviceSelected
    obj.SensorId = this.sensorSelectedList

    if (obj.SensorId == undefined || obj.SensorId.length == 0) {

      obj.SensorId = []

      this.SensorList.forEach(element => {
        obj.SensorId.push(element.key)
      });
    }



    if (this.selectedRange == "custom") {
      obj.frDate = this._detailService.dateToYYYYMMDDHHMM(this.AlertsDetailsObj.fromDate);
      obj.toDate = this._detailService.dateToYYYYMMDDHHMM(this.AlertsDetailsObj.toDate);

      this.period = obj.frDate + ' To ' + obj.tDate
    }
    else {
      obj.frDate = this.selectedRange;

      var hr = ""// obj.frDate;

      if (obj.frDate == "72") {
        hr = "Last 3 Days";
      }
      else
        if (obj.frDate == "168") {
          hr = "Last 1 Week";
        }
        else
          if (obj.frDate == "720") {
            hr = "Last 30 Days";
          }

      this.period = "For " + hr;//+ " Hrs"
    }


    obj.page = "All"

    this.loadReport(obj);
  }

  ResetData(AlertsDetailsObj: any) {
    if (this.reqReport) {
      this.reqReport.unsubscribe();
    }
    this.disabeleRegSelectAll = false;
    this.disableRegUnSelectAll = true;

    this.isGo = false;
    this.excelShowHide = false;
    this.isShowFooter = false;
    this.dataset = [];
    this.deviceSelected = null;
    this.sensorSelectedList = null;

    $('#alertRpTable').dataTable().fnDestroy();

    AlertsDetailsObj.vehicleSelect = [];
    var currentDate = new Date();

    this.AlertsDetailsObj.fromDate = ""
    //this.AlertsDetailsObj.fromDate = new Date(new Date().setHours(0, 0, 0, 0));
    this.AlertsDetailsObj.toDate = ""// currentDate;
    this.maxDate = currentDate;


    this.loadDefaultAlerts();

  }

  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }


  exportPDF() {
    // const url= window.URL.createObjectURL();


    window.location.href = "http://54.179.134.139/FTP_Sensorcnt/pdf/Dev1_SensorData.pdf";
    //window.open(window.location.href);

  }

  // exportPDF() {

  //   var columnCnt: any

  //   columnCnt = []

  //   debugger

  //   this.ExportPDFdata[0].forEach(element => {
  //     columnCnt.push('*');
  //   });


  //   debugger
  //   var title: any = ""

  //   if (this.categorySelected == "1") {
  //     title = "Sensor Data"
  //   }
  //   else {
  //     title = "Exception Data"
  //   }
  //   debugger
  //   var docDefinition = {
  //     pageMargins: [40, 80, 40, 40],
  //     header: {
  //       text: "GR IoT",
  //       margin: 18,
  //       // columns: [
  //       //   {
  //       //     // usually you would use a dataUri instead of the name for client-side printing
  //       //     // sampleImage.jpg however works inside playground so you can play with it
  //       //     image: 'assets/Images/IoTlogo.png',
  //       //     //image: 'https://iotadmin.iotsolution.net/FTP_Sensorcnt/griot/download.jpg',
  //       //     //image: 'http://54.179.134.139/FTP_Sensorcnt/griot/download.jpg',
  //       //     width: 100
  //       //   }
  //       // ]
  //     },
  //     content: [
  //       {
  //         text: title + ' Report',
  //         style: 'header'
  //       },
  //       {
  //         text: "Site Name: -",
  //         style: 'siteStyle'
  //       },
  //       {
  //         text: "Device Name: " + this.reportDevice,
  //         style: 'deviceStyle'
  //       },
  //       {
  //         text: "From Date: " + this.reportFromDate,
  //         style: 'siteStyle'
  //       },
  //       {
  //         text: "To Ddate: " + this.reporttoDate,
  //         style: 'deviceStyle'
  //       },
  //       {
  //         table: {
  //           // headers are automatically repeated if the table spans over multiple pages
  //           // you can declare how many rows should be treated as headers
  //           headerRows: 1,
  //           widths: columnCnt,// ['*', '*', '*', '*','*','*'],
  //           body: this.ExportPDFdata
  //         }
  //       }
  //     ],
  //     styles: {
  //       header: {
  //         fontSize: 18,
  //         bold: true,
  //         alignment: 'center'
  //       },
  //       tableHeader: {
  //         bold: true,
  //         fontSize: 12
  //       },
  //       header2: {
  //         fontSize: 14
  //       },
  //       siteStyle: {
  //         alignment: 'left',
  //         fontSize: 12,
  //       },
  //       deviceStyle: {
  //         alignment: 'right',
  //         fontSize: 12,
  //         margin: [50, -15, 0, 10]
  //       }
  //     }
  //   }


  //   pdfMake.createPdf(docDefinition).download();

  // }

  exportExcel() {

    var fileName = this.translate.instant('AlertDetails');
    var headerText = [this.translate.instant('AlertDetails')];
    var columnKeys = [
      { key: 'DeviceName', width: 20 },
      { key: 'Sensor', width: 30 },
      { key: 'Alert', width: 50 },
      { key: 'AlertTime', width: 40 }
    ];
    var columnHeaders = ["Device Name", "Sensor", "Alert", "Alert Time"]
    this._exportExcel.exportExcelFile(fileName, headerText, columnKeys, columnHeaders, this.Exportdataset, '', '')
  }



  onDeSelectAll() {
    this.disabeleRegSelectAll = false;
    this.disableRegUnSelectAll = true;
    this.deviceSelected = [];
    this.dataset = [];
    this.excelShowHide = false;
    this.isShowFooter = false;
  }

  onsnsrDeSelectAll() {
    this.disabeleSnsrSelectAll = false;
    this.disableSnsrRegUnSelectAll = true;
    this.sensorSelectedList = [];
    this.dataset = [];
    this.excelShowHide = false;
    this.isShowFooter = false;
  }

  atData = new assetData();

  reqReport: any;



  ngOnDestroy() {
    if (this.reqReport) {
      this.reqReport.unsubscribe();
    }
  }
}


export class AlertsDetails // ReportsModal
{
  public imei: any;
  public assetNo: string;
  public deviceNo: any;
  public ddDevice: any;
  public fromDate: any;
  public toDate: any;
  public dtTo: Date;
  public dtFrom: Date;
  deviceSelect: any;
}

export class assetData {

  public imei: any;
  public timeZone: string;

}
