import { Component, OnInit, NgZone } from '@angular/core';
import { ReportService } from '../../reports/service/report.service';
import { Router } from '@angular/router';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import * as apexChart from '../../../../js/apexChart.min.js';
import { JsonPipe } from '@angular/common';
import { TrackingService } from '../services/tracking.service';
import { debug } from 'util';
import { TestComponentRenderer } from '@angular/core/testing';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { LoaderService } from 'src/app/services/loader.service';


@Component({
  selector: 'app-sensor-view',
  templateUrl: './sensor-view.component.html',
  styleUrls: ['./sensor-view.component.css']
})
export class SensorViewComponent implements OnInit {

  constructor(private router: Router,
    private _detailService: ReportService,
    private _commanService: IdeaBService,
    private _trackingService: TrackingService,
    private _loaderService: LoaderService,) {

  }

  chart: any
  hasChart: boolean = false;
  hasSurv: boolean = false;
  hasMap: boolean = false;
  hasTemp: boolean = false;
  hasDBpin: boolean = false;

  trendPaging: any = 0;

  notFound: boolean = true;

  isNextDisabled: boolean = true;
  isPrevDisabled: boolean = true;


  trendChart1: any;
  trendChart2: any;
  trendChart3: any;
  trendChart4: any;
  trendChart5: any;
  trendChart6: any;

  deviceArr: any = []
  sensor: any;


  ResponseList: any = [];
  MultiTrendResponse: any = [];

  sensorValues1: any;
  UserSensors: any;
  trendDevices: any;


  LastChartIndex: any;
  CurrentChartIndex: any;

  clientFeatures: any;

  ngOnInit() {


    //this.TestTrend();
    this.hasSurv = false;
    this.hasChart = false;



    this.loadCharts();

    this.LastChartIndex = "";
    this.trendPaging = 6;

    this.clientFeatures = {};
    this.clientFeatures = JSON.parse(sessionStorage.getItem('Client_Feature'));

    this.clientFeatures.forEach(fe => {
      if (fe.featureId.toUpperCase() == '830FB9BE-C04F-477E-AE5E-4CB76EDB7D12') {
        this.hasSurv = true;
      }
      if (fe.featureId.toUpperCase() == '6F5B60E3-1473-45B2-86DF-91EF6612D1F4') {
        this.hasChart = true;
      }
      if (fe.featureId.toUpperCase() == 'E05A7A69-7B97-4A1C-B105-9C036C43C3C9') {
        this.hasDBpin = true;
      }
      if (fe.featureId.toUpperCase() == 'EBCC9638-4053-42E0-B523-1EF204F8936C') {
        this.hasMap = true;
      }
      if (fe.featureId.toUpperCase() == '7429106C-8341-458D-BB7D-196DAAC6E8C2') {
        this.hasTemp = true;
      }
    });

  }



  TestTrend() {

    //this.zone.runOutsideAngular(() => {
    var chart = am4core.create("trChart1", am4charts.XYChart);

    var data = [];


    data.push({ date: 1579181885, value: 10 });
    data.push({ date: 1579182885, value: 20 });
    data.push({ date: 1579183885, value: 10 });
    data.push({ date: 1579184885, value: 20 });
    data.push({ date: 1579185885, value: 30 });
    data.push({ date: 1579186885, value: 20 });
    data.push({ date: 1579187885, value: 10 });

    chart.data = data;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;


    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.fontSize = 8;


    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

    var scrollbarX = new am4core.Scrollbar();
    scrollbarX.marginBottom = 20;
    chart.scrollbarX = scrollbarX;

    // });


  }

  loadCharts() {

    this._loaderService.display(true);
    this._detailService.GetSensorChart().subscribe(result => {


      this._loaderService.display(false);
      this.ResponseList = result

      var SUoM: any

      var SessionUoM: any = {};

      var totalCnt: any = 0;

      SessionUoM = JSON.parse(sessionStorage.getItem('Sensor_UoM'));


      if (this.ResponseList.snsr.length == 0) {
        this.notFound = true;
      }

      if (this.ResponseList.snsr.length >= 1) {


        this.notFound = false;
        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[0].uom);
        this.trendSnrUoM = "";

        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else {
          this.trendSnrUoM = "";
        }

        var cnt = +this.ResponseList.snsr[0].warning.Cnt;
        cnt += +this.ResponseList.snsr[0].ok.Cnt;
        cnt += +this.ResponseList.snsr[0].critical.Cnt;
        cnt += +this.ResponseList.snsr[0].NR.Cnt;
        cnt += +this.ResponseList.snsr[0].reporting.Cnt;

        if (cnt > 0) {
          this.ploatexChart(this.ResponseList.snsr[0].critical.Cnt,
            this.ResponseList.snsr[0].warning.Cnt,
            this.ResponseList.snsr[0].ok.Cnt,
            this.ResponseList.snsr[0].NR.Cnt,
            this.ResponseList.snsr[0].reporting.Cnt,
            this.ResponseList.snsr[0].snsrName, this.trendSnrUoM, '#snChart1');

          //default multitrend

          if (this.ResponseList.snsr[0].critical.Cnt != 0) {
            this.plotTrends(this.ResponseList.snsr[0].snsrName, this.trendSnrUoM, 0);
          }
          else
            if (this.ResponseList.snsr[0].warning.Cnt != 0) {
              this.plotTrends(this.ResponseList.snsr[0].snsrName, this.trendSnrUoM, 1);
            }
            else
              if (this.ResponseList.snsr[0].ok.Cnt != 0) {
                this.plotTrends(this.ResponseList.snsr[0].snsrName, this.trendSnrUoM, 2);
              }
          // else
          //   if (this.ResponseList.snsr[0].NR.Cnt != 0) {
          //     this.plotTrends(this.ResponseList.snsr[0].snsrName, this.trendSnrUoM, 3);
          //   }
        }
      }
      if (this.ResponseList.snsr.length >= 2) {


        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[1].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else {
          this.trendSnrUoM = "";
        }

        var cnt = +this.ResponseList.snsr[1].warning.Cnt;
        cnt += +this.ResponseList.snsr[1].ok.Cnt;
        cnt += +this.ResponseList.snsr[1].critical.Cnt;
        cnt += +this.ResponseList.snsr[1].NR.Cnt;
        cnt += +this.ResponseList.snsr[1].reporting.Cnt;

        if (cnt > 0) {

          this.ploatexChart(this.ResponseList.snsr[1].critical.Cnt,
            this.ResponseList.snsr[1].warning.Cnt,
            this.ResponseList.snsr[1].ok.Cnt,
            this.ResponseList.snsr[1].NR.Cnt,
            this.ResponseList.snsr[1].reporting.Cnt,
            this.ResponseList.snsr[1].snsrName, this.trendSnrUoM, '#snChart2');


        }
      }
      if (this.ResponseList.snsr.length >= 3) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[2].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }

          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else {
          this.trendSnrUoM = "";
        }


        var cnt = +this.ResponseList.snsr[2].warning.Cnt;
        cnt += +this.ResponseList.snsr[2].ok.Cnt;
        cnt += +this.ResponseList.snsr[2].critical.Cnt;
        cnt += +this.ResponseList.snsr[2].NR.Cnt;
        cnt += +this.ResponseList.snsr[2].reporting.Cnt;

        if (cnt > 0) {
          // this.ploatexChart3(this.ResponseList.snsr[2].critical.Cnt,
          //   this.ResponseList.snsr[2].warning.Cnt,
          //   this.ResponseList.snsr[2].ok.Cnt,
          //   this.ResponseList.snsr[2].NR.Cnt,
          //   this.ResponseList.snsr[2].snsrName, this.trendSnrUoM);
          this.ploatexChart(this.ResponseList.snsr[2].critical.Cnt,
            this.ResponseList.snsr[2].warning.Cnt,
            this.ResponseList.snsr[2].ok.Cnt,
            this.ResponseList.snsr[2].NR.Cnt,
            this.ResponseList.snsr[2].reporting.Cnt,
            this.ResponseList.snsr[2].snsrName, this.trendSnrUoM, '#snChart3');

        }
      }
      if (this.ResponseList.snsr.length >= 4) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[3].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else {
          this.trendSnrUoM = "";
        }
        var cnt = +this.ResponseList.snsr[3].warning.Cnt;
        cnt += +this.ResponseList.snsr[3].ok.Cnt;
        cnt += +this.ResponseList.snsr[3].critical.Cnt;
        cnt += +this.ResponseList.snsr[3].NR.Cnt;
        cnt += +this.ResponseList.snsr[3].reporting.Cnt;

        if (cnt > 0) {
          // this.ploatexChart4(this.ResponseList.snsr[3].critical.Cnt,
          //   this.ResponseList.snsr[3].warning.Cnt,
          //   this.ResponseList.snsr[3].ok.Cnt,
          //   this.ResponseList.snsr[3].NR.Cnt,
          //   this.ResponseList.snsr[3].snsrName, this.trendSnrUoM);
          this.ploatexChart(this.ResponseList.snsr[3].critical.Cnt,
            this.ResponseList.snsr[3].warning.Cnt,
            this.ResponseList.snsr[3].ok.Cnt,
            this.ResponseList.snsr[3].NR.Cnt,
            this.ResponseList.snsr[3].reporting.Cnt,
            this.ResponseList.snsr[3].snsrName, this.trendSnrUoM, '#snChart4');
        }
      }
      if (this.ResponseList.snsr.length >= 4) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[4].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else {
          this.trendSnrUoM = "";
        }

        var cnt = +this.ResponseList.snsr[4].warning.Cnt;
        cnt += +this.ResponseList.snsr[4].ok.Cnt;
        cnt += +this.ResponseList.snsr[4].critical.Cnt;
        cnt += +this.ResponseList.snsr[4].NR.Cnt;
        cnt += +this.ResponseList.snsr[4].reporting.Cnt;

        if (cnt > 0) {
          // this.ploatexChart5(this.ResponseList.snsr[4].critical.Cnt,
          //   this.ResponseList.snsr[4].warning.Cnt,
          //   this.ResponseList.snsr[4].ok.Cnt,
          //   this.ResponseList.snsr[4].NR.Cnt,
          //   this.ResponseList.snsr[4].snsrName, this.trendSnrUoM);

          this.ploatexChart(this.ResponseList.snsr[4].critical.Cnt,
            this.ResponseList.snsr[4].warning.Cnt,
            this.ResponseList.snsr[4].ok.Cnt,
            this.ResponseList.snsr[4].NR.Cnt,
            this.ResponseList.snsr[4].reporting.Cnt,
            this.ResponseList.snsr[4].snsrName, this.trendSnrUoM, '#snChart5');
        }
      }
      if (this.ResponseList.snsr.length >= 5) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[5].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else {
          this.trendSnrUoM = "";
        }

        var cnt = +this.ResponseList.snsr[5].warning.Cnt;
        cnt += +this.ResponseList.snsr[5].ok.Cnt;
        cnt += +this.ResponseList.snsr[5].critical.Cnt;
        cnt += +this.ResponseList.snsr[5].NR.Cnt;
        cnt += +this.ResponseList.snsr[5].reporting.Cnt;

        if (cnt > 0) {
          // this.ploatexChart6(this.ResponseList.snsr[5].critical.Cnt,
          //   this.ResponseList.snsr[5].warning.Cnt,
          //   this.ResponseList.snsr[5].ok.Cnt,
          //   this.ResponseList.snsr[5].NR.Cnt,
          //   this.ResponseList.snsr[5].snsrName, this.trendSnrUoM);
          this.ploatexChart(this.ResponseList.snsr[5].critical.Cnt,
            this.ResponseList.snsr[5].warning.Cnt,
            this.ResponseList.snsr[5].ok.Cnt,
            this.ResponseList.snsr[5].NR.Cnt,
            this.ResponseList.snsr[5].reporting.Cnt,
            this.ResponseList.snsr[5].snsrName, this.trendSnrUoM, '#snChart6');
        }
      }
      if (this.ResponseList.snsr.length >= 6) {


        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[6].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else {
          this.trendSnrUoM = "";
        }

        var cnt = +this.ResponseList.snsr[6].warning.Cnt;
        cnt += +this.ResponseList.snsr[6].ok.Cnt;
        cnt += +this.ResponseList.snsr[6].critical.Cnt;
        cnt += +this.ResponseList.snsr[6].NR.Cnt;
        cnt += +this.ResponseList.snsr[6].reporting.Cnt;

        if (cnt > 0) {
          // this.ploatexChart7(this.ResponseList.snsr[6].critical.Cnt,
          //   this.ResponseList.snsr[6].warning.Cnt,
          //   this.ResponseList.snsr[6].ok.Cnt,
          //   this.ResponseList.snsr[6].NR.Cnt,
          //   this.ResponseList.snsr[6].snsrName, this.trendSnrUoM);
          this.ploatexChart(this.ResponseList.snsr[6].critical.Cnt,
            this.ResponseList.snsr[6].warning.Cnt,
            this.ResponseList.snsr[6].ok.Cnt,
            this.ResponseList.snsr[6].NR.Cnt,
            this.ResponseList.snsr[6].reporting.Cnt,
            this.ResponseList.snsr[6].snsrName, this.trendSnrUoM, '#snChart7');
        }
      }
      if (this.ResponseList.snsr.length >= 7) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[7].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else {
          this.trendSnrUoM = "";
        }

        var cnt = +this.ResponseList.snsr[7].warning.Cnt;
        cnt += +this.ResponseList.snsr[7].ok.Cnt;
        cnt += +this.ResponseList.snsr[7].critical.Cnt;
        cnt += +this.ResponseList.snsr[7].NR.Cnt;
        cnt += +this.ResponseList.snsr[7].reporting.Cnt;

        if (cnt > 0) {
          // this.ploatexChart8(this.ResponseList.snsr[7].critical.Cnt,
          //   this.ResponseList.snsr[7].warning.Cnt,
          //   this.ResponseList.snsr[7].ok.Cnt,
          //   this.ResponseList.snsr[7].NR.Cnt,
          //   this.ResponseList.snsr[7].snsrName, this.trendSnrUoM);
          this.ploatexChart(this.ResponseList.snsr[7].critical.Cnt,
            this.ResponseList.snsr[7].warning.Cnt,
            this.ResponseList.snsr[7].ok.Cnt,
            this.ResponseList.snsr[7].NR.Cnt,
            this.ResponseList.snsr[7].reporting.Cnt,
            this.ResponseList.snsr[7].snsrName, this.trendSnrUoM, '#snChart8');
        }
      }
      if (this.ResponseList.snsr.length >= 8) {


        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[8].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else { this.trendSnrUoM = ""; }

        var cnt = +this.ResponseList.snsr[8].warning.Cnt;
        cnt += +this.ResponseList.snsr[8].ok.Cnt;
        cnt += +this.ResponseList.snsr[8].critical.Cnt;
        cnt += +this.ResponseList.snsr[8].NR.Cnt;
        cnt += +this.ResponseList.snsr[8].reporting.Cnt;

        if (cnt > 0) {
          // this.ploatexChart9(this.ResponseList.snsr[8].critical.Cnt,
          //   this.ResponseList.snsr[8].warning.Cnt,
          //   this.ResponseList.snsr[8].ok.Cnt,
          //   this.ResponseList.snsr[8].NR.Cnt,
          //   this.ResponseList.snsr[8].snsrName, this.trendSnrUoM);
          this.ploatexChart(this.ResponseList.snsr[8].critical.Cnt,
            this.ResponseList.snsr[8].warning.Cnt,
            this.ResponseList.snsr[8].ok.Cnt,
            this.ResponseList.snsr[8].NR.Cnt,
            this.ResponseList.snsr[8].reporting.Cnt,
            this.ResponseList.snsr[8].snsrName, this.trendSnrUoM, '#snChart9');
        }
      }
      if (this.ResponseList.snsr.length >= 9) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[9].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else { this.trendSnrUoM = ""; }

        var cnt = +this.ResponseList.snsr[9].warning.Cnt;
        cnt += +this.ResponseList.snsr[9].ok.Cnt;
        cnt += +this.ResponseList.snsr[9].critical.Cnt;
        cnt += +this.ResponseList.snsr[9].NR.Cnt;
        cnt += +this.ResponseList.snsr[9].reporting.Cnt;

        if (cnt > 0) {
          // this.ploatexChart10(this.ResponseList.snsr[9].critical.Cnt,
          //   this.ResponseList.snsr[9].warning.Cnt,
          //   this.ResponseList.snsr[9].ok.Cnt,
          //   this.ResponseList.snsr[9].NR.Cnt,
          //   this.ResponseList.snsr[9].snsrName, this.trendSnrUoM);
          this.ploatexChart(this.ResponseList.snsr[9].critical.Cnt,
            this.ResponseList.snsr[9].warning.Cnt,
            this.ResponseList.snsr[9].ok.Cnt,
            this.ResponseList.snsr[9].NR.Cnt,
            this.ResponseList.snsr[9].reporting.Cnt,
            this.ResponseList.snsr[9].snsrName, this.trendSnrUoM, '#snChart10');
        }
      }
      if (this.ResponseList.snsr.length >= 10) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[10].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else { this.trendSnrUoM = ""; }

        var cnt = +this.ResponseList.snsr[10].warning.Cnt;
        cnt += +this.ResponseList.snsr[10].ok.Cnt;
        cnt += +this.ResponseList.snsr[10].critical.Cnt;
        cnt += +this.ResponseList.snsr[10].NR.Cnt;
        cnt += +this.ResponseList.snsr[10].reporting.Cnt;

        if (cnt > 0) {
          // this.ploatexChart11(this.ResponseList.snsr[10].critical.Cnt,
          //   this.ResponseList.snsr[10].warning.Cnt,
          //   this.ResponseList.snsr[10].ok.Cnt,
          //   this.ResponseList.snsr[10].NR.Cnt,
          //   this.ResponseList.snsr[10].snsrName, this.trendSnrUoM);
          this.ploatexChart(this.ResponseList.snsr[10].critical.Cnt,
            this.ResponseList.snsr[10].warning.Cnt,
            this.ResponseList.snsr[10].ok.Cnt,
            this.ResponseList.snsr[10].NR.Cnt,
            this.ResponseList.snsr[10].reporting.Cnt,
            this.ResponseList.snsr[10].snsrName, this.trendSnrUoM, '#snChart11');
        }
      }
      if (this.ResponseList.snsr.length >= 11) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[11].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else { this.trendSnrUoM = ""; }

        var cnt = +this.ResponseList.snsr[11].warning.Cnt;
        cnt += +this.ResponseList.snsr[11].ok.Cnt;
        cnt += +this.ResponseList.snsr[11].critical.Cnt;
        cnt += +this.ResponseList.snsr[11].NR.Cnt;
        cnt += +this.ResponseList.snsr[11].reporting.Cnt;

        if (cnt > 0) {
          // this.ploatexChart12(this.ResponseList.snsr[11].critical.Cnt,
          //   this.ResponseList.snsr[11].warning.Cnt,
          //   this.ResponseList.snsr[11].ok.Cnt,
          //   this.ResponseList.snsr[11].NR.Cnt,
          //   this.ResponseList.snsr[11].snsrName, this.trendSnrUoM);
          this.ploatexChart(this.ResponseList.snsr[11].critical.Cnt,
            this.ResponseList.snsr[11].warning.Cnt,
            this.ResponseList.snsr[11].ok.Cnt,
            this.ResponseList.snsr[11].NR.Cnt,
            this.ResponseList.snsr[11].reporting.Cnt,
            this.ResponseList.snsr[11].snsrName, this.trendSnrUoM, '#snChart12');
        }
      }

      if (this.ResponseList.snsr.length >= 1) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[12].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else { this.trendSnrUoM = ""; }

        var cnt = +this.ResponseList.snsr[12].warning.Cnt;
        cnt += +this.ResponseList.snsr[12].ok.Cnt;
        cnt += +this.ResponseList.snsr[12].critical.Cnt;
        cnt += +this.ResponseList.snsr[12].NR.Cnt;
        cnt += +this.ResponseList.snsr[12].reporting.Cnt;

        if (cnt > 0) {
          this.ploatexChart(this.ResponseList.snsr[12].critical.Cnt,
            this.ResponseList.snsr[12].warning.Cnt,
            this.ResponseList.snsr[12].ok.Cnt,
            this.ResponseList.snsr[12].NR.Cnt,
            this.ResponseList.snsr[12].reporting.Cnt,
            this.ResponseList.snsr[12].snsrName, this.trendSnrUoM, '#snChart13');
        }
      }

      if (this.ResponseList.snsr.length >= 13) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[13].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else { this.trendSnrUoM = ""; }

        var cnt = +this.ResponseList.snsr[13].warning.Cnt;
        cnt += +this.ResponseList.snsr[13].ok.Cnt;
        cnt += +this.ResponseList.snsr[13].critical.Cnt;
        cnt += +this.ResponseList.snsr[13].NR.Cnt;
        cnt += +this.ResponseList.snsr[13].reporting.Cnt;

        if (cnt > 0) {
          this.ploatexChart(this.ResponseList.snsr[13].critical.Cnt,
            this.ResponseList.snsr[13].warning.Cnt,
            this.ResponseList.snsr[13].ok.Cnt,
            this.ResponseList.snsr[13].NR.Cnt,
            this.ResponseList.snsr[13].reporting.Cnt,
            this.ResponseList.snsr[13].snsrName, this.trendSnrUoM, '#snChart14');
        }
      }

      if (this.ResponseList.snsr.length >= 14) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[14].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else { this.trendSnrUoM = ""; }

        var cnt = +this.ResponseList.snsr[14].warning.Cnt;
        cnt += +this.ResponseList.snsr[14].ok.Cnt;
        cnt += +this.ResponseList.snsr[14].critical.Cnt;
        cnt += +this.ResponseList.snsr[14].NR.Cnt;
        cnt += +this.ResponseList.snsr[14].reporting.Cnt;

        if (cnt > 0) {
          this.ploatexChart(this.ResponseList.snsr[14].critical.Cnt,
            this.ResponseList.snsr[14].warning.Cnt,
            this.ResponseList.snsr[14].ok.Cnt,
            this.ResponseList.snsr[14].NR.Cnt,
            this.ResponseList.snsr[14].reporting.Cnt,
            this.ResponseList.snsr[14].snsrName, this.trendSnrUoM, '#snChart15');
        }
      }

      if (this.ResponseList.snsr.length >= 15) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[15].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else { this.trendSnrUoM = ""; }

        var cnt = +this.ResponseList.snsr[15].warning.Cnt;
        cnt += +this.ResponseList.snsr[15].ok.Cnt;
        cnt += +this.ResponseList.snsr[15].critical.Cnt;
        cnt += +this.ResponseList.snsr[15].NR.Cnt;
        cnt += +this.ResponseList.snsr[15].reporting.Cnt;

        if (cnt > 0) {

          this.ploatexChart(this.ResponseList.snsr[15].critical.Cnt,
            this.ResponseList.snsr[15].warning.Cnt,
            this.ResponseList.snsr[15].ok.Cnt,
            this.ResponseList.snsr[15].NR.Cnt,
            this.ResponseList.snsr[15].reporting.Cnt,
            this.ResponseList.snsr[15].snsrName, this.trendSnrUoM, '#snChart16');
        }
      }

      if (this.ResponseList.snsr.length >= 16) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[16].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else { this.trendSnrUoM = ""; }

        var cnt = +this.ResponseList.snsr[16].warning.Cnt;
        cnt += +this.ResponseList.snsr[16].ok.Cnt;
        cnt += +this.ResponseList.snsr[16].critical.Cnt;
        cnt += +this.ResponseList.snsr[16].NR.Cnt;
        cnt += +this.ResponseList.snsr[16].reporting.Cnt;

        if (cnt > 0) {
          this.ploatexChart(this.ResponseList.snsr[16].critical.Cnt,
            this.ResponseList.snsr[16].warning.Cnt,
            this.ResponseList.snsr[16].ok.Cnt,
            this.ResponseList.snsr[16].NR.Cnt,
            this.ResponseList.snsr[16].reporting.Cnt,
            this.ResponseList.snsr[16].snsrName, this.trendSnrUoM, '#snChart17');
        }
      }

      if (this.ResponseList.snsr.length >= 17) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[17].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else { this.trendSnrUoM = ""; }

        var cnt = +this.ResponseList.snsr[17].warning.Cnt;
        cnt += +this.ResponseList.snsr[17].ok.Cnt;
        cnt += +this.ResponseList.snsr[17].critical.Cnt;
        cnt += +this.ResponseList.snsr[17].NR.Cnt;
        cnt += +this.ResponseList.snsr[17].reporting.Cnt;

        if (cnt > 0) {

          this.ploatexChart(this.ResponseList.snsr[17].critical.Cnt,
            this.ResponseList.snsr[17].warning.Cnt,
            this.ResponseList.snsr[17].ok.Cnt,
            this.ResponseList.snsr[17].NR.Cnt,
            this.ResponseList.snsr[17].reporting.Cnt,
            this.ResponseList.snsr[17].snsrName, this.trendSnrUoM, '#snChart18');
        }
      }

      if (this.ResponseList.snsr.length >= 18) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[18].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else { this.trendSnrUoM = ""; }

        var cnt = +this.ResponseList.snsr[18].warning.Cnt;
        cnt += +this.ResponseList.snsr[18].ok.Cnt;
        cnt += +this.ResponseList.snsr[18].critical.Cnt;
        cnt += +this.ResponseList.snsr[18].NR.Cnt;
        cnt += +this.ResponseList.snsr[18].reporting.Cnt;

        if (cnt > 0) {
          this.ploatexChart(this.ResponseList.snsr[18].critical.Cnt,
            this.ResponseList.snsr[18].warning.Cnt,
            this.ResponseList.snsr[18].ok.Cnt,
            this.ResponseList.snsr[18].NR.Cnt,
            this.ResponseList.snsr[18].reporting.Cnt,
            this.ResponseList.snsr[18].snsrName, this.trendSnrUoM, '#snChart19');
        }
      }

      if (this.ResponseList.snsr.length >= 19) {

        var snrUoM = SessionUoM.filter(g => g.uomId == this.ResponseList.snsr[19].uom);
        this.trendSnrUoM = "";
        if (snrUoM.length > 0) {
          if (snrUoM[0].symbol == undefined) {
            snrUoM[0].symbol = "";
          }
          this.trendSnrUoM = snrUoM[0].symbol;
        }
        else { this.trendSnrUoM = ""; }

        var cnt = +this.ResponseList.snsr[19].warning.Cnt;
        cnt += +this.ResponseList.snsr[19].ok.Cnt;
        cnt += +this.ResponseList.snsr[19].critical.Cnt;
        cnt += +this.ResponseList.snsr[19].NR.Cnt;
        cnt += +this.ResponseList.snsr[19].reporting.Cnt;

        if (cnt > 0) {
          this.ploatexChart(this.ResponseList.snsr[19].critical.Cnt,
            this.ResponseList.snsr[19].warning.Cnt,
            this.ResponseList.snsr[19].ok.Cnt,
            this.ResponseList.snsr[19].NR.Cnt,
            this.ResponseList.snsr[19].reporting.Cnt,
            this.ResponseList.snsr[19].snsrName, this.trendSnrUoM, '#snChart20');
        }
      }



    });
  }



  plottrend1(trend: any, deviceName: any, sensorName: any, uom: any) {

    // name: 'Warning',
    // type: 'area',
    // data: [[0, 40], [100, 40]],

    if (uom == undefined || uom == "") {
      uom = this.trendSnrUoM
    }

    var TrendValues: any = [];

    var val1: any = []


    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;

      //STime = STime / 1000;

      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      TrendValues.push(obj);

      val1.push(Number(SVal));

    });

    var trendMin1: any = 0
    var trendMax1: any = 0


    trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
    trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();

    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;


    this.trendChart1 = am4core.create("trChart1", am4charts.XYChart);

    let data = [];
    let visits = 10;



    this.trendChart1.data = TrendValues;

    let dateAxis = this.trendChart1.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart1.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.fontSize = 8;

    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 18;

    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);
    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }
    // if (uom != undefined || uom != "") {
    //   if (uom == "(%)") {
    //     valueAxis.min = 0;
    //     valueAxis.max = 100;
    //   }
    // }


    let series = this.trendChart1.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;
    series.stroke = am4core.color("#7092BE");

    this.trendChart1.cursor = new am4charts.XYCursor();
    this.trendChart1.cursor.xAxis = dateAxis;

    // let scrollbarX = new am4core.Scrollbar();
    // scrollbarX.marginBottom = 20;
    // this.trendChart1.scrollbarX = scrollbarX;

    var title = this.trendChart1.titles.create();
    title.text = deviceName + " | " + sensorName + " " + this.trendSnrUoM;
    title.fontSize = 12;
    title.marginBottom = 5;

    let range

    trend.ruleDetails.forEach(pb => {

      range = valueAxis.axisRanges.create();

      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;

      if (pb.colorCode == "red") {
        range.axisFill.fill = am4core.color("#F8CBAD");
      }
      else
        if (pb.colorCode == "green") {
          range.axisFill.fill = am4core.color("#C5E0B4");
        }
        else if (pb.colorCode == "orange") {
          range.axisFill.fill = am4core.color("#FFE699");
        }

      // var minY: number;
      // var maxY: number;
      // minY = 0;
      // maxY = 0;

      if (pb.maxAssign != "") {
        range.value = +pb.minVal;
        range.endValue = +pb.maxVal;

      }
      else
        if (pb.minAssign == ">=" || pb.minAssign == ">") {
          // minY = +pb.minVal;
          // maxY = +pb.minVal * 10000;
          range.value = +pb.minVal;

          range.endValue = +pb.minVal * 10000;
        }
        else
          if (pb.minAssign == "<=" || pb.minAssign == "<") {
            // minY = 0;
            // maxY = +pb.minVal;

            // range.value =+pb.minVal;
            range.endValue = +pb.minVal;
          }

    });


    // });

  }

  plottrend2(trend: any, deviceName: any, sensorName: any, uom: any) {


    if (uom == undefined) {
      uom = this.trendSnrUoM
    }


    var TrendValues: any = [];

    var val1: any = []


    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;

      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      TrendValues.push(obj);

      val1.push(Number(SVal));

    });

    var trendMin1: any = 0
    var trendMax1: any = 0


    trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
    trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();

    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;


    if (this.trendChart2) {
      this.trendChart2.dispose();
    }
    //this.zone.runOutsideAngular(() => {
    this.trendChart2 = am4core.create("trChart2", am4charts.XYChart);


    this.trendChart2.data = TrendValues;


    let dateAxis = this.trendChart2.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart2.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.fontSize = 8;

    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 18;

    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);
    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }
    // if (uom == "(%)") {
    //   valueAxis.min = 0;
    //   valueAxis.max = 100;
    // }

    let series = this.trendChart2.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;
    series.stroke = am4core.color("#7092BE");

    this.trendChart2.cursor = new am4charts.XYCursor();
    this.trendChart2.cursor.xAxis = dateAxis;

    // let scrollbarX = new am4core.Scrollbar();
    // scrollbarX.marginBottom = 20;
    // this.trendChart2.scrollbarX = scrollbarX;

    var title = this.trendChart2.titles.create();
    title.text = deviceName + " | " + sensorName + " " + this.trendSnrUoM;;
    title.fontSize = 12;
    title.marginBottom = 5;

    let range

    trend.ruleDetails.forEach(pb => {

      range = valueAxis.axisRanges.create();

      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;

      if (pb.colorCode == "red") {
        range.axisFill.fill = am4core.color("#F8CBAD");
      }
      else
        if (pb.colorCode == "green") {
          range.axisFill.fill = am4core.color("#C5E0B4");
        }
        else if (pb.colorCode == "orange") {
          range.axisFill.fill = am4core.color("#FFE699");
        }


      if (pb.maxAssign != "") {
        range.value = +pb.minVal;
        range.endValue = +pb.maxVal;

      }
      else
        if (pb.minAssign == ">=" || pb.minAssign == ">") {
          // minY = +pb.minVal;
          // maxY = +pb.minVal * 10000;
          range.value = +pb.minVal;
          range.endValue = +pb.minVal * 10000;
        }
        else
          if (pb.minAssign == "<=" || pb.minAssign == "<") {
            // minY = 0;
            // maxY = +pb.minVal;

            // range.value =+pb.minVal;
            range.endValue = +pb.minVal;
          }

    });



    //});

  }
  plottrend3(trend: any, deviceName: any, sensorName: any, uom: any) {

    var TrendValues: any = [];

    var val1: any = []


    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;

      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      TrendValues.push(obj);

      val1.push(Number(SVal));

    });

    var trendMin1: any = 0
    var trendMax1: any = 0


    trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
    trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();

    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;


    if (this.trendChart3) {
      this.trendChart3.dispose();
    }
    //this.zone.runOutsideAngular(() => {
    this.trendChart3 = am4core.create("trChart3", am4charts.XYChart);


    this.trendChart3.data = TrendValues;


    let dateAxis = this.trendChart3.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart3.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.fontSize = 8;

    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 18;

    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);
    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }

    let series = this.trendChart3.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;
    series.stroke = am4core.color("#7092BE");

    this.trendChart3.cursor = new am4charts.XYCursor();
    this.trendChart3.cursor.xAxis = dateAxis;


    var title = this.trendChart3.titles.create();
    title.text = deviceName + " | " + sensorName + " " + this.trendSnrUoM;
    title.fontSize = 12;
    title.marginBottom = 5;

    let range

    trend.ruleDetails.forEach(pb => {

      range = valueAxis.axisRanges.create();

      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;

      if (pb.colorCode == "red") {
        range.axisFill.fill = am4core.color("#F8CBAD");
      }
      else
        if (pb.colorCode == "green") {
          range.axisFill.fill = am4core.color("#C5E0B4");
        }
        else if (pb.colorCode == "orange") {
          range.axisFill.fill = am4core.color("#FFE699");
        }


      if (pb.maxAssign != "") {
        range.value = +pb.minVal;
        range.endValue = +pb.maxVal;

      }
      else
        if (pb.minAssign == ">=" || pb.minAssign == ">") {
          // minY = +pb.minVal;
          // maxY = +pb.minVal * 10000;
          range.value = +pb.minVal;
          range.endValue = +pb.minVal * 10000;
        }
        else
          if (pb.minAssign == "<=" || pb.minAssign == "<") {
            // minY = 0;
            // maxY = +pb.minVal;

            // range.value =+pb.minVal;
            range.endValue = +pb.minVal;
          }

    });



    //});

  }
  plottrend4(trend: any, deviceName: any, sensorName: any, uom: any) {

    var TrendValues: any = [];

    var val1: any = []


    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;

      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      TrendValues.push(obj);

      val1.push(Number(SVal));

    });

    var trendMin1: any = 0
    var trendMax1: any = 0


    trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
    trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();

    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;


    if (this.trendChart4) {
      this.trendChart4.dispose();
    }
    //this.zone.runOutsideAngular(() => {
    this.trendChart4 = am4core.create("trChart4", am4charts.XYChart);


    this.trendChart4.data = TrendValues;


    let dateAxis = this.trendChart4.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart4.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.fontSize = 8;

    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 18;

    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);
    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }

    let series = this.trendChart4.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;
    series.stroke = am4core.color("#7092BE");

    this.trendChart4.cursor = new am4charts.XYCursor();
    this.trendChart4.cursor.xAxis = dateAxis;


    var title = this.trendChart4.titles.create();
    title.text = deviceName + " | " + sensorName + " " + this.trendSnrUoM;
    title.fontSize = 12;
    title.marginBottom = 5;

    let range

    trend.ruleDetails.forEach(pb => {

      range = valueAxis.axisRanges.create();

      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;

      if (pb.colorCode == "red") {
        range.axisFill.fill = am4core.color("#F8CBAD");
      }
      else
        if (pb.colorCode == "green") {
          range.axisFill.fill = am4core.color("#C5E0B4");
        }
        else if (pb.colorCode == "orange") {
          range.axisFill.fill = am4core.color("#FFE699");
        }


      if (pb.maxAssign != "") {
        range.value = +pb.minVal;
        range.endValue = +pb.maxVal;

      }
      else
        if (pb.minAssign == ">=" || pb.minAssign == ">") {
          // minY = +pb.minVal;
          // maxY = +pb.minVal * 10000;
          range.value = +pb.minVal;
          range.endValue = +pb.minVal * 10000;
        }
        else
          if (pb.minAssign == "<=" || pb.minAssign == "<") {
            // minY = 0;
            // maxY = +pb.minVal;

            // range.value =+pb.minVal;
            range.endValue = +pb.minVal;
          }

    });



    //});

  }
  plottrend5(trend: any, deviceName: any, sensorName: any, uom: any) {

    var TrendValues: any = [];

    var val1: any = []


    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;

      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      TrendValues.push(obj);

      val1.push(Number(SVal));

    });

    var trendMin1: any = 0
    var trendMax1: any = 0


    trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
    trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();

    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;


    if (this.trendChart5) {
      this.trendChart5.dispose();
    }
    //this.zone.runOutsideAngular(() => {
    this.trendChart5 = am4core.create("trChart5", am4charts.XYChart);


    this.trendChart5.data = TrendValues;


    let dateAxis = this.trendChart5.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart5.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.fontSize = 8;

    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 18;

    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);
    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }

    let series = this.trendChart5.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;
    series.stroke = am4core.color("#7092BE");

    this.trendChart5.cursor = new am4charts.XYCursor();
    this.trendChart5.cursor.xAxis = dateAxis;


    var title = this.trendChart5.titles.create();
    title.text = deviceName + " | " + sensorName + " " + this.trendSnrUoM;
    title.fontSize = 12;
    title.marginBottom = 5;

    let range

    trend.ruleDetails.forEach(pb => {

      range = valueAxis.axisRanges.create();

      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;

      if (pb.colorCode == "red") {
        range.axisFill.fill = am4core.color("#F8CBAD");
      }
      else
        if (pb.colorCode == "green") {
          range.axisFill.fill = am4core.color("#C5E0B4");
        }
        else if (pb.colorCode == "orange") {
          range.axisFill.fill = am4core.color("#FFE699");
        }


      if (pb.maxAssign != "") {
        range.value = +pb.minVal;
        range.endValue = +pb.maxVal;

      }
      else
        if (pb.minAssign == ">=" || pb.minAssign == ">") {
          // minY = +pb.minVal;
          // maxY = +pb.minVal * 10000;
          range.value = +pb.minVal;
          range.endValue = +pb.minVal * 10000;
        }
        else
          if (pb.minAssign == "<=" || pb.minAssign == "<") {
            // minY = 0;
            // maxY = +pb.minVal;

            // range.value =+pb.minVal;
            range.endValue = +pb.minVal;
          }

    });



    //});

  }
  plottrend6(trend: any, deviceName: any, sensorName: any, uom: any) {

    var TrendValues: any = [];

    var val1: any = []


    trend.trend.forEach(e => {
      var STime = +e.sensorTime;
      var SVal = +e.sensorValue;

      var obj: any = {};

      obj.date = STime;
      obj.value = SVal;

      TrendValues.push(obj);

      val1.push(Number(SVal));

    });

    var trendMin1: any = 0
    var trendMax1: any = 0


    trendMin1 = val1.reduce((a, b) => Math.min(a, b));//.Min();
    trendMax1 = val1.reduce((a, b) => Math.max(a, b));//.Max();

    trendMin1 = trendMin1 - 5;
    trendMax1 = trendMax1 + 5;


    if (this.trendChart6) {
      this.trendChart6.dispose();
    }
    //this.zone.runOutsideAngular(() => {
    this.trendChart6 = am4core.create("trChart6", am4charts.XYChart);


    this.trendChart6.data = TrendValues;


    let dateAxis = this.trendChart6.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 5;
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.renderer.fontSize = 8;
    dateAxis.renderer.grid.template.disabled = true;

    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    let valueAxis = this.trendChart6.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.fontSize = 8;

    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 18;

    valueAxis.min = Number(trendMin1);
    valueAxis.max = Number(trendMax1);
    if (valueAxis.min > 0) {
      valueAxis.min = 0;
    }

    let series = this.trendChart6.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;
    series.strokeWidth = 0.8;
    //series.tensionX  = 0.83;
    series.stroke = am4core.color("#7092BE");

    this.trendChart6.cursor = new am4charts.XYCursor();
    this.trendChart6.cursor.xAxis = dateAxis;


    var title = this.trendChart6.titles.create();
    title.text = deviceName + " | " + sensorName + " " + this.trendSnrUoM;
    title.fontSize = 12;
    title.marginBottom = 5;

    let range

    trend.ruleDetails.forEach(pb => {

      range = valueAxis.axisRanges.create();

      range.axisFill.fillOpacity = 0.8;
      range.grid.strokeOpacity = 0;

      if (pb.colorCode == "red") {
        range.axisFill.fill = am4core.color("#F8CBAD");
      }
      else
        if (pb.colorCode == "green") {
          range.axisFill.fill = am4core.color("#C5E0B4");
        }
        else if (pb.colorCode == "orange") {
          range.axisFill.fill = am4core.color("#FFE699");
        }


      if (pb.maxAssign != "") {
        range.value = +pb.minVal;
        range.endValue = +pb.maxVal;

      }
      else
        if (pb.minAssign == ">=" || pb.minAssign == ">") {
          // minY = +pb.minVal;
          // maxY = +pb.minVal * 10000;
          range.value = +pb.minVal;
          range.endValue = +pb.minVal * 10000;
        }
        else
          if (pb.minAssign == "<=" || pb.minAssign == "<") {
            // minY = 0;
            // maxY = +pb.minVal;

            // range.value =+pb.minVal;
            range.endValue = +pb.minVal;
          }

    });



    //});

  }




  ploatexChart(C_Count: any, W_Count: any, G_Count: any, NR_Count: any, R_Count: any, SensorName: any, SensorUom: any, chartId: any) {


    var C = +C_Count;
    var W = +W_Count;
    var G = +G_Count;
    var Nr = +NR_Count;
    var R = +R_Count;

    var total = C + W + G + Nr + R;

    var options = {
      series: [C, W, G, Nr, R],
      labels: ['Critical', 'Warning', 'Good', 'Not Reporting', 'Reporting'],
      chart: {
        width: 180,
        type: 'donut',
        events: {

          dataPointSelection: (event, chartContext, config) => {

            this.plotTrends(config.w.config.title.text, SensorUom, config.dataPointIndex);
          }
        },
      }, colors: ['#FC3D3D', '#FCCE3F', '#10DE81', '#807D7C', '#34C6EB'],
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return Math.round((val / 100) * total);
        },
      },

      title: {
        text: SensorName,
        align: 'center',
      },
      legend: {
        show: false
      },
    };

    var chart = new apexChart(document.querySelector(chartId), options);
    chart.render();

  }


  nrDevices: any = "";

  plotTrends(sensor: any, sensorUom: any, type: any) {

    debugger

    var sName: any = "";

    this.sensor = sensor;
    sName = this.sensor;//.split(' ')[0];

    if (type == 0) {
      type = "Critical";
    }
    else if (type == 1) {
      type = "Warning";
    }
    else if (type == 2) {
      type = "Good";
    }
    else if (type == 3) {
      type = "Not reporting";
    }
    else if (type == 4) {
      type = "Reporting";
    }

    if (this.trendChart1) {
      this.trendChart1.dispose();
    }
    if (this.trendChart2) {
      this.trendChart2.dispose();
    }
    if (this.trendChart3) {
      this.trendChart3.dispose();
    }
    if (this.trendChart4) {
      this.trendChart4.dispose();
    }
    if (this.trendChart5) {
      this.trendChart5.dispose();
    }
    if (this.trendChart6) {
      this.trendChart6.dispose();
    }



    this.UserSensors = {}
    this.UserSensors = JSON.parse(sessionStorage.getItem("USER_SENSORS"));
    this.UserSensors = this.UserSensors.filter(g => g.keyName == sName);

    this.trendDevices = {}

    this.trendDevices = this.ResponseList.snsr.filter(g => g.snsrName == sName);



    var devices: any = {};
    if (type == "Critical") {
      devices = this.trendDevices[0].critical.DeviceId
    }
    else
      if (type == "Warning") {
        devices = this.trendDevices[0].warning.DeviceId
      } else
        if (type == "Good") {
          devices = this.trendDevices[0].ok.DeviceId
        } else
          if (type == "Not reporting") {
            devices = this.trendDevices[0].NR.DeviceId
          }
          else
            if (type == "Reporting") {
              devices = this.trendDevices[0].reporting.DeviceId
            }

    var devicesIds: any = "";
    var devicenames: any = "";

    devices.forEach(d => {
      devicesIds = devicesIds + d.split('~')[1] + ',';
      devicenames = devicenames + d.split('~')[0] + ',';
    });

    this.nrDevices = "";
    if (type == "Not reporting") {
      this.nrDevices = devicenames.substring(0, devicenames.length - 1) + " not reporting.";
    }

    this.LastChartIndex = 0;
    this.deviceArr = devicenames.split(',');

    var obj: any = {};
    obj.deviceIds = devicesIds;
    obj.sensorId = this.UserSensors[0].sensorTypeId;
    obj.period = 24;

    this._loaderService.display(true);
    this._trackingService.getMultiTrend(obj).subscribe(result => {
      this.MultiTrendResponse = [];


      this._loaderService.display(false);
      this.MultiTrendResponse = result;

      this.isPrevDisabled = true;
      this.trendSnrUoM = sensorUom
      this.isNextDisabled = false;
      this.CurrentChartIndex = "";
      this.plot();
    });
  }
  trendSnrUoM: any = "";

  plotPrev() {
    this.isNextDisabled = false;
    this.LastChartIndex = this.LastChartIndex - this.trendPaging;
    this.plot();
  }
  plotNext() {
    this.isPrevDisabled = false; //enable
    this.LastChartIndex = this.LastChartIndex + this.trendPaging;
    this.plot();
  }

  plot() {



    if (this.CurrentChartIndex == "" || this.CurrentChartIndex == undefined) {
      this.CurrentChartIndex = 0;
      this.LastChartIndex = 0;
    }

    if (this.MultiTrendResponse.length > 0) {
      this.nrDevices = "";
    }

    if (this.LastChartIndex > this.CurrentChartIndex) //next charts
    {

      this.CurrentChartIndex = this.LastChartIndex
      if (this.MultiTrendResponse.length >= 1 && this.CurrentChartIndex < this.MultiTrendResponse.length) {

        this.plottrend1(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
      }
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.MultiTrendResponse.length >= 2 && this.CurrentChartIndex < this.MultiTrendResponse.length) {

        this.plottrend2(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
      }
      ////
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.MultiTrendResponse.length >= 3 && this.CurrentChartIndex < this.MultiTrendResponse.length) {

        this.plottrend3(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
      }
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.MultiTrendResponse.length >= 4 && this.CurrentChartIndex < this.MultiTrendResponse.length) {
        this.plottrend4(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
      }
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.MultiTrendResponse.length >= 5 && this.CurrentChartIndex < this.MultiTrendResponse.length) {

        this.plottrend5(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
      }
      this.CurrentChartIndex = this.CurrentChartIndex + 1
      if (this.MultiTrendResponse.length >= 6 && this.CurrentChartIndex < this.MultiTrendResponse.length) {
        this.plottrend6(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
      }
    }
    else
      if (this.LastChartIndex < this.CurrentChartIndex)//previous charts
      {

        this.CurrentChartIndex = this.LastChartIndex

        if (this.MultiTrendResponse.length >= 1 && this.CurrentChartIndex < this.MultiTrendResponse.length
          && this.CurrentChartIndex >= 0) {

          this.plottrend1(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
        }

        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.MultiTrendResponse.length >= 2 && this.CurrentChartIndex < this.MultiTrendResponse.length
          && this.CurrentChartIndex >= 0) {


          this.plottrend2(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
        }
        ////
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.MultiTrendResponse.length >= 3 && this.CurrentChartIndex < this.MultiTrendResponse.length
          && this.CurrentChartIndex >= 0) {

          this.plottrend3(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.MultiTrendResponse.length >= 4 && this.CurrentChartIndex < this.MultiTrendResponse.length
          && this.CurrentChartIndex >= 0) {


          this.plottrend4(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.MultiTrendResponse.length >= 5 && this.CurrentChartIndex < this.MultiTrendResponse.length
          && this.CurrentChartIndex >= 0) {
          this.plottrend5(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.MultiTrendResponse.length >= 6 && this.CurrentChartIndex < this.MultiTrendResponse.length
          && this.CurrentChartIndex >= 0) {


          this.plottrend6(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
        }
      }
      else {
        if (this.MultiTrendResponse.length >= 1 && this.CurrentChartIndex < this.MultiTrendResponse.length) {


          this.plottrend1(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.MultiTrendResponse.length >= 2 && this.CurrentChartIndex < this.MultiTrendResponse.length) {

          this.plottrend2(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
        }
        ////
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.MultiTrendResponse.length >= 3 && this.CurrentChartIndex < this.MultiTrendResponse.length) {

          this.plottrend3(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.MultiTrendResponse.length >= 4 && this.CurrentChartIndex < this.MultiTrendResponse.length) {

          this.plottrend4(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.MultiTrendResponse.length >= 5 && this.CurrentChartIndex < this.MultiTrendResponse.length) {

          this.plottrend5(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
        }
        this.CurrentChartIndex = this.CurrentChartIndex + 1
        if (this.MultiTrendResponse.length >= 6 && this.CurrentChartIndex < this.MultiTrendResponse.length) {

          this.plottrend6(this.MultiTrendResponse[this.CurrentChartIndex], this.deviceArr[this.CurrentChartIndex], this.UserSensors[0].keyName, this.sensor.split(' ')[1]);
        }
      }


    if (((this.MultiTrendResponse.length - 1) - this.CurrentChartIndex) > 0) {
      this.isNextDisabled = false;
    }
    else {
      this.isNextDisabled = true;
    }


    if (this.LastChartIndex == 0) {
      this.isPrevDisabled = true;
    }




  }

  changeView(path: any) {
    sessionStorage.setItem("USER_PREF", "");

    this._commanService.ActionType = path;

    debugger

    if (path == "live") {
      if (sessionStorage.getItem('Client_ListView') == "1") {
        this.router.navigateByUrl('/pages/tracking/LiveView')
      }
      else
        if (sessionStorage.getItem('Client_ListView') == "0") {
          this.router.navigateByUrl('/pages/tracking/ListView')
        }
      //this.router.navigateByUrl('/pages/tracking/LiveView')
    } else
      if (path == "pin") {

        this.router.navigateByUrl('/pages/tracking/AnalyticsView')
      } else
        if (path == "temp") {

          this.router.navigateByUrl('/pages/tracking/TempView')
        }
        else
          if (path == "map") {

            this.router.navigateByUrl('/pages/tracking/Map')
          }
          else {
            this.router.navigateByUrl('/pages/reports/images')
          }

  }

}
