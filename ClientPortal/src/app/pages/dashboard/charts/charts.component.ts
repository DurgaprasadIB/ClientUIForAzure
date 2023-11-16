import { Component, OnInit } from '@angular/core';
import * as apexChart from '../../../../js/apexChart.min.js';
import { IdeaBService } from '../../GlobalServices/ideab.service.js';
import { Subscription, Observable } from 'rxjs';
import { TrackingService } from '../../tracking/services/tracking.service.js';
import { TranslateService } from '@ngx-translate/core';
import { ReportService } from '../../reports/service/report.service.js';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})

export class ChartsComponent implements OnInit {


  constructor(private _commanService: IdeaBService,
    private _trackingService: TrackingService,
    private translate: TranslateService,
    private reportService: ReportService) { }

  trackerList: any = [];
  nrSelect: any;
  private timer;
  private sub: Subscription;
  StatData = new StatData();
  vehSum = new VehSum();
  maxDate: any;
  trackerInsightsobj = new TrackerInsights();
  sessionData: any;
  sessionDeviceTypeList = [];
  sessionIMEIList = [];
  hourorMin: any;
  calspd: any;
  dncObj = new DoNutChart();
  vehicleListData: any;
  supportingList: any = [];
  defaultHoursorMintsofNopolling: any;
  DisplayLoader: boolean = false;
  StatusLoader: boolean = false;
  barChartLoader: boolean = false;
  LineChartLoader: boolean = false;
  AreaChartLoader: boolean = false;

  doNutChart: any;

  moving: any = "";
  idle: any;
  stopped: any;
  nogps: any;
  nopolling: any;
  total: any;
  overspeed: any;
  speed: any;
  traveldistance: any;
  distance: any;
  idling: any;
  duration: any;
  LiveStatus: any;

  selectedDate: any;
  prev5Day: any;
  yesterDate: any;

  ngOnInit() {
    this.prev5Day = new Date(new Date().setDate(new Date().getDate() - 5));
    this.yesterDate = new Date(new Date().setDate(new Date().getDate() - 1));
    this.vehSum.fromDate = new Date(this.prev5Day.setHours(0, 0, 0, 0));
    this.vehSum.toDate = new Date(this.yesterDate.setHours(23, 59, 59, 999));
    this.maxDate = new Date(this.yesterDate.setHours(23, 59, 59, 999));
    //debugger
    this.moving = 'Moving';
    this.idle = 'Idle';
    this.stopped = 'Stopped';
    this.nogps = 'NoGPS';
    this.nopolling = 'NoPolling';
    this.total = 'Total';
    this.overspeed = 'OverSpeeding';
    this.speed = 'Speed';
    this.traveldistance = 'TravelDistance';
    this.distance = 'Distance';
    this.idling = 'Idling';
    this.duration = 'Duration';
    this.LiveStatus = 'LiveStatus';


    this.hourorMin = this._commanService.NOPOLLINGHOURSTIME; //24; for no polling time
    this.calspd = this._commanService.VEHICLESPEEDLIMIT; //5; for vehicle speed
    this.defaultHoursorMintsofNopolling = this._commanService.DEFAULTNOPOLLINGTIME; //For Default No Polling Time

    this.trackerList = [];
    this.trackerList = JSON.parse(sessionStorage.getItem("ASSETS_TYPES_VEHICLE"));

    this.dncObj.NoPolling = this.trackerList.length;
    this.InitializeChartData();

    this.updateVehicleData();
    this.DonutChartTimerTick();
    this.changeTrackerOrDate();
  }

  InitializeChartData() {
    debugger
    ///donut chart
    try {
      var options4 = {
        chart: {
          id: 'status',
          height: 210,
          width: 345,
          type: 'donut',
        },
        colors: ['#1cad4b', '#cab700', '#e01f26', '#008ffb', '#775dd0'
        ],
        dataLabels: {
          enabled: false,
        }, title: {
          text: this.LiveStatus,
          align: 'left',
          style: {
            fontSize: "16px",
            color: '#666'
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: '50%',
              labels: {
                show: true,
                name: {
                  fontSize: "12px",
                  color: "#85378a"
                },
                value: {
                  fontSize: "15px"
                },
                total: {
                  show: true,
                  label: 10
                }
              }
            }
          }
        },
        //labels: [this.moving, this.idle, this.stopped, this.nogps, this.nopolling],
        labels: ['Good', 'OK', 'Bad', 'Critical'],
        series: [
          // Number(this.dncObj.Moving), Number(this.dncObj.Idle), Number(this.dncObj.Stop),
          // Number(this.dncObj.NoGPS), Number(this.dncObj.NoPolling)
          Number(4), Number(2), Number(1),
          Number(3)

        ],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
              hight: 500
            },
            legend: {
              show: false
            }
          }
        }],
        legend: {
          position: 'right',
          offsetY: 0,
          height: 230,
        }
      }

      this.doNutChart = new apexChart(
        document.querySelector("#donut"), options4);

      this.doNutChart.render();
    } catch (e) {
      e = null;
    }

    //////line
    var options1 = {
      chart: {
        id: 'lineChart',
        height: 280,
        type: 'line',
        shadow: {
          enabled: false,
          color: '#bbb',
          top: 3,
          left: 2,
          blur: 3,
          opacity: 1
        },
      }, dataLabels: {
        //offsetY: -5,
        enabled: true,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      stroke: {
        width: 7,
        curve: 'smooth'
      },
      series: [{
        name: this.overspeed,
        data: []
      }],
      xaxis: {
        categories: [],
      },
      title: {
        text: this.overspeed,
        align: 'left',
        style: {
          fontSize: "16px",
          color: '#666'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#FDD835'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        },
      },
      markers: {
        size: 4,
        opacity: 0.9,
        colors: ["#FFA41B"],
        strokeColor: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
        }
      },
      yaxis: {
        title: {
          text: this.speed,
        },
      }
    }

    var lineGradientChart = new apexChart(document.querySelector("#lineGradient"), options1);
    lineGradientChart.render();

    ////area chart
    var options2 = {
      chart: {
        id: 'areaChart',
        height: 280,
        type: 'area',
        shadow: {
          enabled: false,
          color: '#bbb',
          top: 3,
          left: 2,
          blur: 3,
          opacity: 1
        },
      },
      stroke: {
        width: 7,
        curve: 'smooth'
      },
      series: [{
        name: this.traveldistance,
        data: []
      }],
      xaxis: {
        categories: [],
      },
      title: {
        text: this.traveldistance,
        align: 'left',
        style: {
          fontSize: "16px",
          color: '#666'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#FDD835'],
          shadeIntensity: 1,
          type: 'horizontal',
          // opacityFrom: 1,
          // opacityTo: 1,
          //stops: [0, 100, 100, 100]
        },
      },
      markers: {
        size: 4,
        opacity: 0.9,
        colors: ["#FFA41B"],
        strokeColor: "#fff",
        strokeWidth: 1,
        hover: {
          size: 7,
        }
      }, dataLabels: {
        enabled: true,
        //offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      yaxis: {
        title: {
          text: this.distance,
        },
      }
    }

    var areaChart = new apexChart(document.querySelector("#area"), options2);
    areaChart.render();

    /////bar
    var options3 = {
      chart: {
        id: 'barChart',
        height: 280,
        type: 'bar'
      },
      series: [{
        name: this.idling,
        data: []
      }],
      xaxis: {
        categories: [],
      }, colors: ['#cab700'],
      title: {
        text: this.idling,
        align: 'left',
        style: {
          fontSize: "16px",
          color: '#666'
        }
      },
      yaxis: {
        title: {
          text: this.duration,
        },
      }
    }

    var barChart = new apexChart(document.querySelector("#bar"), options3);
    barChart.render();
  }

  updateVehicleData() {
    var jsonData = {
      "userId": sessionStorage.getItem("LOGINUSERID"),
      "userType": sessionStorage.getItem("USER_TYPE")
    }
    this._trackingService.getUserDevices(jsonData).subscribe(
      result => {
        //////debugger;
        this.vehicleListData = result;
        this.vehicleListData = this.vehicleListData.userVLAssets;
        sessionStorage.setItem("ASSETS_TYPES_VEHICLE", JSON.stringify(this.vehicleListData));

        for (let i = 0; i < this.vehicleListData.length; i++) {
          this.supportingList[i] = {
            id: Number(this.vehicleListData[i].deviceNo),
            imi: this.vehicleListData[i].deviceNo,
            vldvt: this.vehicleListData[i].assetNo,
            regNo: this.vehicleListData[i].regNo,
            vlIgnition: "",
            vlspeed: "",
            vlgps: "",
            tms: "",
            vlliveTrack: "",
            vlhours: this.defaultHoursorMintsofNopolling,
            vlpos: "",
            vlLatLng: "",
            isChecked: false,
            DefaultTimeInMnts: this.hourorMin,
            DefaultSpeed: this.calspd
          }
          sessionStorage.setItem("VEHICLE_TOTALDATA", JSON.stringify(this.supportingList));
        }
      });
  }

  DonutChartTimerTick() {
    this.timer = Observable.timer(0, 10 * 1000);
    this.sub = this.timer.subscribe(N => this.DonutChartTimerData(N));
  }

  DonutChartTimerData(time) {
    this.onLoadDonutChartData();
  }
  reqLiveDonut: any;
  onLoadDonutChartData() {
    //debugger

    this.DisplayLoader = true;
    var data;
    //this.displaySpinner(true);
    this.trackerInsightsobj = this.getVehicleSessionData();
    this.reqLiveDonut = this._trackingService.getVehicleTrackerLiveData(this.trackerInsightsobj).subscribe(result => {
      data = result;
      if (this.reqLiveDonut !== undefined && !this.reqLiveDonut.isStopped) {
        this.VehicleTableData(data);
      }

      this.DisplayLoader = false;
    }, error => {
      this.VehicleTableData(data);

      this.DisplayLoader = false;
    })
  }

  getVehicleSessionData() {
    this.sessionDeviceTypeList = [];
    this.sessionIMEIList = [];
    this.sessionData = [];
    this.sessionData = JSON.parse(sessionStorage.getItem("ASSETS_TYPES_VEHICLE"));
    this.sessionData.forEach(element => {
      this.sessionDeviceTypeList.push(element.assetType);
      this.sessionIMEIList.push(element.deviceNo);
    });
    this.trackerInsightsobj.divType = this.remove_duplicates(this.sessionDeviceTypeList).toString();
    this.trackerInsightsobj.IMEI = this.sessionIMEIList.toString();
    return this.trackerInsightsobj
  }

  remove_duplicates(arr) {
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
    }
    arr = [];
    for (let key in obj) {
      arr.push(key);
    }
    return arr;
  }

  VehicleTableData(data: any) {

    ////debugger;
    var vehicleDataList = JSON.parse(sessionStorage.getItem("VEHICLE_TOTALDATA"));

    try {
      for (let j = 0; j < vehicleDataList.length; j++) {
        for (let i = 0; i < data.evd.length; i++) {

          var vehicleDataLst = data.evd[i];//.ext[0];

          if (vehicleDataLst.imi == vehicleDataList[j].imi) {

            let Ignitionsts = vehicleDataLst.igs == "1" ? "ON" : "OFF";

            let IgnitionStatus = vehicleDataLst.pos == "1" || vehicleDataLst.pos == "A" ? "ON" : "OFF";

            var responseDate = this._commanService.epochUTCtoDateWithTimeZone(Number(vehicleDataLst.epochTms), vehicleDataLst.imi)

            var curenntDate = new Date();

            var hourDifference = Math.abs(responseDate.getTime() - curenntDate.getTime());

            var latlng;

            if (Number(vehicleDataLst.lat) != 0 && Number(vehicleDataLst.lon) != 0) {
              latlng = new google.maps.LatLng(Number(vehicleDataLst.lat), Number(vehicleDataLst.lon));
            }
            else latlng = "";

            ////debugger
            var hours = this._commanService.CalculateTimeStamp(hourDifference); //hourDifference / 1000 / 3600;

            vehicleDataList[j].imi = Number(vehicleDataLst.imi);
            vehicleDataList[j].vldvt = vehicleDataList[j].vldvt;
            vehicleDataList[j].imi = vehicleDataList[j].imi;
            vehicleDataList[j].regNo = vehicleDataList[j].regNo;
            vehicleDataList[j].vlIgnition = Ignitionsts;
            vehicleDataList[j].vlspeed = vehicleDataLst.spd;
            vehicleDataList[j].vlgps = IgnitionStatus;
            vehicleDataList[j].tms = this._commanService.DateConvert(vehicleDataLst.tms);
            vehicleDataList[j].vlliveTrack = vehicleDataLst.imi;
            vehicleDataList[j].vlhours = hours;
            vehicleDataList[j].vlLatLng = latlng;
            vehicleDataList[j].vlpos = vehicleDataLst.pos;
            vehicleDataList[j].DefaultTimeInMnts = this.hourorMin;
            vehicleDataList[j].DefaultSpeed = this.calspd;
          }

        }//Inner For Loop End

      } //Main For Loop End
    } catch (e) {
      e = null;
    }
    sessionStorage.setItem("VEHICLE_TOTALDATA", JSON.stringify(vehicleDataList));
    var result = vehicleDataList;

    //debugger
    try {
      this.dncObj = new DoNutChart();
      for (let k = 0; k < result.length; k++) {
        //NoPolling
        try {
          if (result[k].vlhours >= this.hourorMin) {
            this.dncObj.NoPolling = Number(this.dncObj.NoPolling) + 1;
          }

          //NoGps
          else if (result[k].vlpos != "1" && result[k].vlhours < this.hourorMin) {
            this.dncObj.NoGPS = Number(this.dncObj.NoGPS) + 1;
          }
          //Stopping Number(result[k].vlspeed) == 0 && 
          else if (result[k].vlIgnition == "OFF" && result[k].vlhours < this.hourorMin && result[k].vlpos == "1") {
            this.dncObj.Stop = Number(this.dncObj.Stop) + 1;
          }
          //Moving 
          else if (Number(result[k].vlspeed) >= this.calspd && result[k].vlIgnition == "ON" && result[k].vlhours < this.hourorMin && result[k].vlpos == "1") {
            this.dncObj.Moving = Number(this.dncObj.Moving) + 1;
          }
          //Idle
          else if (Number(result[k].vlspeed) < this.calspd && result[k].vlIgnition == "ON" && result[k].vlhours < this.hourorMin && result[k].vlpos == "1") {
            this.dncObj.Idle = Number(this.dncObj.Idle) + 1;
          }
          //All     
          this.dncObj.All = Number(this.dncObj.All) + 1;
        } catch (e) {
          e = null;
        }
      }
    } catch (e) {
      e = null;
    }
    this.doNutChart.updateSeries([//10,20,30,40,2
      Number(this.dncObj.Moving), Number(this.dncObj.Idle), Number(this.dncObj.Stop),
      Number(this.dncObj.NoGPS), Number(this.dncObj.NoPolling)

    ]);
  }

  supportList: any;
  vehList: any;
  idleDate: any = [];
  idleVal: any = [];

  overSpdDate: any = [];
  overSpdVal: any = [];

  trvlDistDate: any = [];
  trvlDistVal: any = [];
  reqLiveCharts: any;
  changeTrackerOrDate() {
    debugger;
    if (this.reqLiveCharts) {
      this.reqLiveCharts.unsubscribe();
    }
    this.StatusLoader = true;
    this.barChartLoader = true;
    this.LineChartLoader = true;
    this.AreaChartLoader = true;

    this.vehSum.vehicleSelect = [];

    if (this.nrSelect != undefined) {
      this.vehSum.vehicleSelect = this.nrSelect;
    } else {
      this.vehList = JSON.parse(sessionStorage.getItem("ASSETS_TYPES_VEHICLE"));

      this.vehList.forEach(element => {
        this.vehSum.vehicleSelect.push(element.deviceNo);
      });
    }

    if (this.selectedDate != undefined) {
      this.vehSum.fromDate = new Date(this.selectedDate.setHours(0, 0, 0, 0));
      this.vehSum.toDate = new Date(this.selectedDate.setHours(23, 59, 59, 999));
    } else {
      this.vehSum.fromDate = new Date(this.prev5Day.setHours(0, 0, 0, 0));
      this.vehSum.toDate = new Date(this.yesterDate.setHours(23, 59, 59, 999));
    }

    this.reqLiveCharts = this.reportService.GetSiteMonitoringData(this.vehSum).subscribe(response => {
      debugger

      if (this.reqLiveCharts !== undefined && !this.reqLiveCharts.isStopped) {
        this.supportList = response;

        try {
          this.StatData = new StatData();

          if (this.supportList.dsum.trvlSec != null) {
            this.StatData.TravelTime = this.supportList.dsum.trvlSec;
          } else {
            this.StatData.TravelTime = "0";
          }

          if (this.supportList.dsum.idleSec != null) {
            this.StatData.IdleTime = this.supportList.dsum.idleSec;
          } else {
            this.StatData.IdleTime = "0";
          }

          if (this.supportList.dsum.stopSec != null) {
            this.StatData.StopTime = this.supportList.dsum.stopSec;
          } else {
            this.StatData.StopTime = "0";
          }

          if (this.supportList.dsum.egnSec != null) {
            this.StatData.EngineRun = this.supportList.dsum.egnSec;
          } else {
            this.StatData.EngineRun = "0";
          }

          if (this.supportList.dsum.distMtrs != null) {
            this.StatData.Distance = this.supportList.dsum.distMtrs;
          } else {
            this.StatData.Distance = "0";
          }

        } catch (e) {
          e = null;
        } finally {
          this.StatusLoader = false;
        }

        try {
          this.idleDate = [];
          this.idleVal = [];

          this.supportList.idle.forEach(element => {
            this.idleDate.push(this._commanService.epochUTCtoDateTimeNoTime(element.date));
            this.idleVal.push(element.idle);
          });

          if (this.idleDate.length > 0) {
            ///////////bar start --- Idling
            apexChart.exec('barChart', "updateOptions", {
              xaxis: {
                type: 'datetime',
                categories: this.idleDate
              }
            });

            apexChart.exec('barChart', "updateSeries", [
              {
                data: this.idleVal
              }
            ]);
          }
          ///////////bar end
        } catch (e) {
          e = null;
        }
        finally {
          this.barChartLoader = false;
        }

        try {

          this.overSpdDate = [];
          this.overSpdVal = [];

          this.supportList.Ospd.forEach(element => {
            this.overSpdDate.push(this._commanService.epochUTCtoDateTimeNoTime(element.date));
            this.overSpdVal.push(element.Overspeed);
          });

          if (this.overSpdDate.length > 0) {
            ///////////line start --- OverSpeeding
            apexChart.exec('lineChart', "updateOptions", {
              xaxis: {
                type: 'datetime',
                categories: this.overSpdDate
              }
            });

            apexChart.exec('lineChart', "updateSeries", [
              {
                data: this.overSpdVal
              }
            ]);
          }

          ///////////line end
        } catch (e) {
          e = null;
        } finally {
          this.LineChartLoader = false;
        }

        try {

          this.trvlDistDate = [];
          this.trvlDistVal = [];

          this.supportList.trvl.forEach(element => {
            this.trvlDistDate.push(this._commanService.epochUTCtoDateTimeNoTime(element.date));
            this.trvlDistVal.push(element.travel);
          });

          if (this.trvlDistDate.length > 0) {
            ///////////area start --TravelDistance
            apexChart.exec('areaChart', "updateOptions", {
              xaxis: {
                type: 'datetime',
                categories: this.trvlDistDate
              }
            });

            apexChart.exec('areaChart', "updateSeries", [
              {
                data: this.trvlDistVal
              }
            ]);
          }

        } catch (e) {
          e = null;
        } finally {
          this.AreaChartLoader = false;
        }
        ///////////area end
      }
    }, error => {
      this.StatusLoader = false;
      this.barChartLoader = false;
      this.LineChartLoader = false;
      this.AreaChartLoader = false;
      this.StatData = new StatData();
    });
  }


  OpenVehDrp() {
    alert('click');
  }
  ngOnDestroy() {
    if (this.reqLiveCharts) {
      this.reqLiveCharts.unsubscribe();
    }
    if (this.reqLiveDonut) {
      this.reqLiveDonut.unsubscribe();
    }
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

export class TrackerInsights {
  public evnt: string;
  public divType: string;
  public IMEI: string;
  public userId: string;
  public userType: string;
}

export class DoNutChart {
  public Moving: Number = 0;
  public Idle: Number = 0;
  public Stop: Number = 0;
  public NoGPS: Number = 0;
  public NoPolling: Number = 0;
  public All: Number = 0;
}

export class VehSum {
  public fromDate: any;
  public toDate: any;
  public vehicleSelect: any = [];
  public selectedType: any;
}

export class StatData {
  public EngineRun: string = "0";
  public TravelTime: string = "0";
  public IdleTime: string = "0";
  public StopTime: string = "0";
  public Distance: string = "0";
  public FuelFill: string = "0";
  public FuelTheft: string = "0";
  public FuelCons: string = "0";
}