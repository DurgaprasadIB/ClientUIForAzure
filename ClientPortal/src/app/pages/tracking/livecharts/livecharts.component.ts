import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceInsights } from '../live-view/live-view.component';
import { ReportService } from '../../reports/service/report.service';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import * as apexChart from '../../../../js/apexChart.min.js';

@Component({
  selector: 'app-livecharts',
  templateUrl: './livecharts.component.html',
  styleUrls: ['./livecharts.component.css']
})
export class LivechartsComponent implements OnInit {

  constructor(private router: Router,
    private _detailService: ReportService,
    private _commanService: IdeaBService, ) { }

  sessionData: any = [];
  sessionDeviceList: any = [];
  sessionDeviceTypeList: any = [];

  SensorList: any;
  DeviceList: any;

  deviceInsightsobj = new DeviceInsights();

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

  UoM1: any = "";
  UoM2: any = "";
  UoM3: any = "";
  UoM4: any = "";
  UoM5: any = "";
  UoM6: any = "";
  UoM7: any = "";
  UoM8: any = "";
  UoM9: any = "";
  UoM10: any = "";

  // isexChart1Ploted: boolean = false;
  // isexChart2Ploted: boolean = false;
  // isexChart3Ploted: boolean = false;
  // isexChart4Ploted: boolean = false;
  // isexChart5Ploted: boolean = false;
  // isexChart6Ploted: boolean = false;
  // isexChart7Ploted: boolean = false;
  // isexChart8Ploted: boolean = false;
  // isexChart9Ploted: boolean = false;
  // isexChart10Ploted: boolean = false;

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

  exTrendValuesRw1: any;
  exTrendValuesRw2: any;
  exTrendValuesRw3: any;
  exTrendValuesRw4: any;
  exTrendValuesRw5: any;
  exTrendValuesRw6: any;
  exTrendValuesRw7: any;
  exTrendValuesRw8: any;
  exTrendValuesRw9: any;
  exTrendValuesRw10: any;


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

  clientFeatures:any;
  hasSurv:boolean;

  ResponseList: any = [];

  dataset: any[] = [];
  bgImage: any;
  ngOnInit() {


    this.hasSurv = false;
    
    this.clientFeatures = {};
    this.clientFeatures = JSON.parse(sessionStorage.getItem('Client_Feature'));

    this.clientFeatures.forEach(fe => {
      if (fe.featureId.toUpperCase() == '830FB9BE-C04F-477E-AE5E-4CB76EDB7D12') {
        this.hasSurv = true;
      }
     
    });


    sessionStorage.setItem('liveScreen', "liveChart");
    this.bgImage = sessionStorage.getItem('BGimage');
    this.loadSensorTypes()
    this.GetReportDetails();
  }

  changeView(path: any) {
    sessionStorage.setItem("USER_PREF", "");

    this._commanService.ActionType = path;

    if (path == "live") {

      this.router.navigateByUrl('/pages/tracking/LiveView')
    }
    //
    else
    if (path == "pin") {

      this.router.navigateByUrl('/pages/tracking/AnalyticsView')
    }
    else {
      this.router.navigateByUrl('/pages/reports/images')
    }

  }

  getVehicleSessionData() {

    this.sessionDeviceList = [];
    this.sessionData = [];
    this.sessionData = JSON.parse(sessionStorage.getItem("USER_DEVICES"));
    this.sessionData.forEach(element => {
      this.sessionDeviceList.push(element.sensorId);
    });
    this.deviceInsightsobj.SensorId = this.sessionDeviceList.toString();
    return this.deviceInsightsobj
  }

  loadSensorTypes() {
    this.SensorList = {}
    this.SensorList = JSON.parse(sessionStorage.getItem("USER_SENSORS"));
    this.SensorList = this.SensorList.filter(g => g.key !== "tms");
  }

  GetReportDetails() {

    var obj: any

    obj = {}


    obj.type = "ExceptionData"

    this.getVehicleSessionData();


    debugger
    obj.DeviceId = this.sessionDeviceList[0];
    // obj.SensorId = this.sensorSelectedList

    obj.SensorId = []

    this.SensorList.forEach(element => {
      obj.SensorId.push(element.key)
    });


    debugger

    obj.frDate = "72";// this.selectedRange;

    this.loadReport(obj);
  }

  loadReport(obj: any) {

    debugger

    obj.reportType = "chart";


    this._detailService.GetExcHrData(obj).subscribe(result => {

      debugger
      this.dataset = [];


      this.exTrendValues1 = [];
      this.exTrendValuesRw1 = [];

      this.exTrendValues2 = [];
      this.exTrendValuesRw2 = [];

      this.exTrendValues3 = [];
      this.exTrendValuesRw3 = [];

      this.exTrendValues4 = [];
      this.exTrendValuesRw4 = [];

      this.exTrendValues5 = [];
      this.exTrendValuesRw5 = [];

      this.exTrendValues6 = [];
      this.exTrendValuesRw6 = [];

      this.exTrendValues7 = [];
      this.exTrendValuesRw7 = [];

      this.exTrendValues8 = [];
      this.exTrendValuesRw8 = [];

      this.exTrendValues9 = [];
      this.exTrendValuesRw9 = [];

      this.exTrendValues10 = [];
      this.exTrendValuesRw10 = [];


      this.ResponseList = result;

      if (this.ResponseList.length >= 1) {


        this.divexHeight = "266";

        this.exchartTitle1 = this.ResponseList[0].snsrName;
        this.UoM1 = this.ResponseList[0].uom;

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

        this.ResponseList[0].Rawdata.forEach(e => {
          var DtTime = +e.time;
          var rawVal = +e.value;

          this.exTrendValuesRw1.push([
            DtTime,
            rawVal
          ])
        });

        debugger


        // if (!this.isexChart1Ploted) {
        this.ploatexChart();

        //   this.isexChart1Ploted = true;
        // }
        // else {

        //   //Critical
        //   var critical: any = {};

        //   critical.name = 'Critical';
        //   critical.data = [];
        //   this.exTrendValues1.forEach(element => {

        //     var STime = +element[0];
        //     var SVal = +element[1];

        //     critical.data.push([
        //       STime, SVal
        //     ]);


        //   });
        //   debugger
        //   //Warning
        //   var warning: any = {};

        //   warning.name = 'Warning';
        //   warning.data = [];
        //   this.exTrendValues1.forEach(element => {
        //     var STime = +element[0];
        //     var SVal = +element[2];

        //     warning.data.push([
        //       STime, SVal
        //     ]);
        //   });
        //   debugger
        //   //OK
        //   var OK: any = {};

        //   OK.name = 'Good';
        //   OK.data = [];

        //   this.exTrendValues1.forEach(element => {

        //     var STime = +element[0];
        //     var SVal = +element[3];


        //     OK.data.push([
        //       STime, SVal
        //     ]);

        //   });
        //   debugger



        //   apexChart.exec('repChart', "updateSeries", [
        //     critical, warning, OK
        //   ]);


        //   apexChart.exec('repChart', "updateOptions", {
        //     chart: {
        //       height: 250,
        //       toolbar: {
        //         show: true,
        //         tools: {
        //           download: false,
        //           selection: true,
        //           zoom: true,
        //           zoomin: false,
        //           zoomout: false,
        //           pan: false,
        //         },
        //       },
        //     },
        //     title: {
        //       text: this.exchartTitle1
        //     },
        //   });
        // }
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
        this.UoM2 = this.ResponseList[1].uom;
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

        this.ResponseList[1].Rawdata.forEach(e => {
          var DtTime = +e.time;
          var rawVal = +e.value;

          this.exTrendValuesRw2.push([
            DtTime,
            rawVal
          ])
        });

        debugger


        this.ploatexChart2();



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
        this.UoM3 = this.ResponseList[2].uom;
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

        this.ResponseList[2].Rawdata.forEach(e => {
          var DtTime = +e.time;
          var rawVal = +e.value;

          this.exTrendValuesRw3.push([
            DtTime,
            rawVal
          ])
        });

        debugger


        this.ploatexChart3();


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
        this.UoM4 = this.ResponseList[3].uom;

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

        this.ResponseList[3].Rawdata.forEach(e => {
          var DtTime = +e.time;
          var rawVal = +e.value;

          this.exTrendValuesRw4.push([
            DtTime,
            rawVal
          ])
        });
        debugger


        this.ploatexChart4();


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
        this.UoM5 = this.ResponseList[4].uom;

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
        this.ResponseList[4].Rawdata.forEach(e => {
          var DtTime = +e.time;
          var rawVal = +e.value;

          this.exTrendValuesRw5.push([
            DtTime,
            rawVal
          ])
        });
        debugger


        this.ploatexChart5();


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
        this.UoM6 = this.ResponseList[5].uom;

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

        this.ResponseList[5].Rawdata.forEach(e => {
          var DtTime = +e.time;
          var rawVal = +e.value;

          this.exTrendValuesRw6.push([
            DtTime,
            rawVal
          ])
        });
        debugger


        this.ploatexChart6();


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
        this.UoM7 = this.ResponseList[6].uom;

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
        this.ResponseList[5].Rawdata.forEach(e => {
          var DtTime = +e.time;
          var rawVal = +e.value;

          this.exTrendValuesRw6.push([
            DtTime,
            rawVal
          ])
        });
        debugger

        this.ploatexChart7();

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
        this.UoM8 = this.ResponseList[7].uom;

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
        this.ResponseList[7].Rawdata.forEach(e => {
          var DtTime = +e.time;
          var rawVal = +e.value;

          this.exTrendValuesRw8.push([
            DtTime,
            rawVal
          ])
        });
        debugger

        this.ploatexChart8();


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
        this.UoM9 = this.ResponseList[8].uom;

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
        this.ResponseList[8].Rawdata.forEach(e => {
          var DtTime = +e.time;
          var rawVal = +e.value;

          this.exTrendValuesRw9.push([
            DtTime,
            rawVal
          ])
        });
        debugger

        this.ploatexChart9();

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
        this.UoM10 = this.ResponseList[9].uom;

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
        this.ResponseList[9].Rawdata.forEach(e => {
          var DtTime = +e.time;
          var rawVal = +e.value;

          this.exTrendValuesRw10.push([
            DtTime,
            rawVal
          ])
        });
        debugger


        this.ploatexChart10();


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

    OK.name = 'Good';
    OK.data = [];

    this.exTrendValues1.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });

    //Rawdata
    var Raw: any = {};

    Raw.name = 'Reading';
    Raw.data = [];

    this.exTrendValuesRw1.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];


      Raw.data.push([
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
      colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB']
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK, Raw],
      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB']
      },
      title: {
        text: this.exchartTitle1,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: [{
        opposite: true,
        title: {
          text: '% of 1 Hr',
        },
      }, {
        show: false,
      }, {
        show: false,
      }, {
        opposite: false,
        title: {
          text: 'Units ( ' + this.UoM1+' )',
        },
      },
      ],
      tooltip: {
        shared: false,
        x: {
          show: true,
          format: 'HH:mm',
        },
        y: {
          formatter: function (val) {
            //debugger
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

    OK.name = 'Good';
    OK.data = [];

    this.exTrendValues2.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger
    //Rawdata
    var Raw: any = {};

    Raw.name = 'Reading';
    Raw.data = [];

    this.exTrendValuesRw2.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];


      Raw.data.push([
        STime, SVal
      ]);

    });

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
      colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK, Raw],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      title: {
        text: this.exchartTitle2,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: [{
        opposite: true,
        title: {
          text: '% of 1 Hr',
        },
      }, {
        show: false,
      }, {
        show: false,
      }, {
        opposite: false,
        title: {
          text: 'Units ( ' + this.UoM2+' )',
        },
      },
      ],
      tooltip: {
        shared: false,
        x: {
          show: true,
          format: 'HH:mm',
        },
        y: {
          formatter: function (val) {
            //debugger
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

    OK.name = 'Good';
    OK.data = [];

    this.exTrendValues3.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger
    //Rawdata
    var Raw: any = {};

    Raw.name = 'Reading';
    Raw.data = [];

    this.exTrendValuesRw3.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];


      Raw.data.push([
        STime, SVal
      ]);

    });

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
      colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK, Raw],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      title: {
        text: this.exchartTitle3,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: [{
        opposite: true,
        title: {
          text: '% of 1 Hr',
        },
      }, {
        show: false,
      }, {
        show: false,
      }, {
        opposite: false,
        title: {
          text: 'Units ( ' + this.UoM3+' )',
        },
      },
      ],
      tooltip: {
        shared: false,
        x: {
          show: true,
          format: 'HH:mm',
        },
        y: {
          formatter: function (val) {
            //debugger
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

    OK.name = 'Good';
    OK.data = [];

    this.exTrendValues4.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger
    //Rawdata
    var Raw: any = {};

    Raw.name = 'Reading';
    Raw.data = [];

    this.exTrendValuesRw4.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];


      Raw.data.push([
        STime, SVal
      ]);

    });

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
      colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK, Raw],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      title: {
        text: this.exchartTitle4,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: [{
        opposite: true,
        title: {
          text: '% of 1 Hr',
        },
      }, {
        show: false,
      }, {
        show: false,
      }, {
        opposite: false,
        title: {
          text: 'Units ( ' + this.UoM4+' )',
        },
      },
      ],
      tooltip: {
        shared: false,
        x: {
          show: true,
          format: 'HH:mm',
        },
        y: {
          formatter: function (val) {
            //debugger
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

    OK.name = 'Good';
    OK.data = [];

    this.exTrendValues5.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger
    //Rawdata
    var Raw: any = {};

    Raw.name = 'Reading';
    Raw.data = [];

    this.exTrendValuesRw5.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];


      Raw.data.push([
        STime, SVal
      ]);

    });

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
      colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK, Raw],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      title: {
        text: this.exchartTitle5,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: [{
        opposite: true,
        title: {
          text: '% of 1 Hr',
        },
      }, {
        show: false,
      }, {
        show: false,
      }, {
        opposite: false,
        title: {
          text: 'Units ( ' + this.UoM5+' )',
        },
      },
      ],
      tooltip: {
        shared: false,
        x: {
          show: true,
          format: 'HH:mm',
        },
        y: {
          formatter: function (val) {
            //debugger
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

    OK.name = 'Good';
    OK.data = [];

    this.exTrendValues6.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger
    //Rawdata
    var Raw: any = {};

    Raw.name = 'Reading';
    Raw.data = [];

    this.exTrendValuesRw6.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];


      Raw.data.push([
        STime, SVal
      ]);

    });

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
      colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK, Raw],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      title: {
        text: this.exchartTitle6,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: [{
        opposite: true,
        title: {
          text: '% of 1 Hr',
        },
      }, {
        show: false,
      }, {
        show: false,
      }, {
        opposite: false,
        title: {
          text: 'Units ( ' + this.UoM6+' )',
        },
      },
      ],
      tooltip: {
        shared: false,
        x: {
          show: true,
          format: 'HH:mm',
        },
        y: {
          formatter: function (val) {
            //debugger
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

    OK.name = 'Good';
    OK.data = [];

    this.exTrendValues7.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger
    //Rawdata
    var Raw: any = {};

    Raw.name = 'Reading';
    Raw.data = [];

    this.exTrendValuesRw7.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];


      Raw.data.push([
        STime, SVal
      ]);

    });

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
      colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK, Raw],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      title: {
        text: this.exchartTitle7,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: [{
        opposite: true,
        title: {
          text: '% of 1 Hr',
        },
      }, {
        show: false,
      }, {
        show: false,
      }, {
        opposite: false,
        title: {
          text: 'Units ( ' + this.UoM7 + ' )',
        },
      },
      ],
      tooltip: {
        shared: false,
        x: {
          show: true,
          format: 'HH:mm',
        },
        y: {
          formatter: function (val) {
            //debugger
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

    OK.name = 'Good';
    OK.data = [];

    this.exTrendValues8.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger
    //Rawdata
    var Raw: any = {};

    Raw.name = 'Reading';
    Raw.data = [];

    this.exTrendValuesRw8.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];


      Raw.data.push([
        STime, SVal
      ]);

    });

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
      colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK, Raw],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      title: {
        text: this.exchartTitle8,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: [{
        opposite: true,
        title: {
          text: '% of 1 Hr',
        },
      }, {
        show: false,
      }, {
        show: false,
      }, {
        opposite: false,
        title: {
          text: 'Units ( ' + this.UoM8 + ' )',
        },
      },
      ],
      tooltip: {
        shared: false,
        x: {
          show: true,
          format: 'HH:mm',
        },
        y: {
          formatter: function (val) {
            //debugger
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

    OK.name = 'Good';
    OK.data = [];

    this.exTrendValues9.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger
    //Rawdata
    var Raw: any = {};

    Raw.name = 'Reading';
    Raw.data = [];

    this.exTrendValuesRw9.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];


      Raw.data.push([
        STime, SVal
      ]);

    });

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
      colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK, Raw],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      title: {
        text: this.exchartTitle9,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: [{
        opposite: true,
        title: {
          text: '% of 1 Hr',
        },
      }, {
        show: false,
      }, {
        show: false,
      }, {
        opposite: false,
        title: {
          text: 'Units ( ' + this.UoM9 + ' )',
        },
      },
      ],
      tooltip: {
        shared: false,
        x: {
          show: true,
          format: 'HH:mm',
        },
        y: {
          formatter: function (val) {
            //debugger
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

    OK.name = 'Good';
    OK.data = [];

    this.exTrendValues10.forEach(element => {

      var STime = +element[0];
      var SVal = +element[3];


      OK.data.push([
        STime, SVal
      ]);

    });
    debugger
    //Rawdata
    var Raw: any = {};

    Raw.name = 'Reading';
    Raw.data = [];

    this.exTrendValuesRw10.forEach(element => {

      var STime = +element[0];
      var SVal = +element[1];


      Raw.data.push([
        STime, SVal
      ]);

    });

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
      colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      stroke: {
        curve: 'smooth',
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      dataLabels: {
        enabled: false
      },
      series: [critical, warning, OK, Raw],

      fill: {
        opacity: 0,
        colors: ['#E01F26', '#E7C219', '#00A65A', '#008FFB'],
      },
      title: {
        text: this.exchartTitle10,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: [{
        opposite: true,
        title: {
          text: '% of 1 Hr',
        },
      }, {
        show: false,
      }, {
        show: false,
      }, {
        opposite: false,
        title: {
          text: 'Units ( ' + this.UoM10 + ' )',
        },
      },
      ],
      tooltip: {
        shared: false,
        x: {
          show: true,
          format: 'HH:mm',
        },
        y: {
          formatter: function (val) {
            //debugger
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
}
