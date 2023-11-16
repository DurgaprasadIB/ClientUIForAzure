import { Component, OnInit, ViewChild } from '@angular/core';
import { TrackingService } from '../services/tracking.service';
import * as apexChart from '../../../../js/apexChart.min.js';
import { LoaderService } from 'src/app/services/loader.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ReportService } from '../../reports/service/report.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { IdeaBService } from '../../GlobalServices/ideab.service';
import { ExportToCsv } from 'export-to-csv';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-energymeter-view',
  templateUrl: './energymeter-view.component.html',
  styleUrls: ['./energymeter-view.component.css']
})
export class EnergymeterViewComponent implements OnInit {
  @ViewChild('modalTrend') modalTrend: any;
  constructor(
    private router: Router,
    private _commanService: IdeaBService,
    private _trackingService: TrackingService,
    private _loaderService: LoaderService,
    private _detailService: ReportService,
    private _toaster: ToastrService,
    
  ) { }
   
  liveEnergyData : any;
  getEnergyData :any;
  private sub: Subscription;
  
  isTimer = false;
  private timer;
  deviceId: any = "";
  deviceName: any = "";
  dateRange: any;
  selectedRange: any = "";
  period:any;
  periodRange:any;
  isDates: boolean = false;
  consumption : any;
  timePeriod : any;
  maxDate: any = Date;
  minDate: any = Date;
  maxDateH:any;
  minDateH:any;
  minDateM:any;
  maxDateM:any;
  xTitle:any;
  consumptionData : number[] = [];
  avgconsumptionData : number[] = [];
  consumptionPeriod : string[] = [];
  chart: apexChart | undefined;
  ngOnInit() {
    
    
    var currentDate = new Date();
    this.maxDate = currentDate;
    if(currentDate.getMonth() + 1== 9 && currentDate.getFullYear() == 2023){
      this.minDate = new Date("2023-09-01")
    }
    else{
      this.minDate = new Date(new Date().setDate(new Date().getDate() - 30));  
    }
    
    this.fromDate = this.formatDate(new Date(new Date().setDate(new Date().getDate() - 1)));// new Date(new Date().setHours(0, 0, 0, 0));
    this.toDate = this.formatDate(currentDate)//currentDate;
    this.maxDateH = this.toDate
    this.minDateH = this.formatDate(this.minDate)
    this.minDateM = this.formatDateforMonth(new Date("2023-09"))
    this.maxDateM = this.formatDateforMonth(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    
    
    this.isTimer = false;
    this.periodRange = [];
    this.periodRange.push(
      {
        pId: 1,
        pVal: 'Hourly'
      },
      {
        pId: 2,
        pVal: 'Daily'
      },
      {
        pId: 3,
        pVal: 'Monthly'
      }
    );
    //obj.shortCode = this.selectHW;
   this.timerTick();
  }
  timerTick() {
    if (this.isTimer) {
      this.sub.unsubscribe();
      this.isTimer = true;
      this.timer = Observable.timer(0, Number(6) * 10000);
      this.sub = this.timer.subscribe(N => this.getTimerData(N));
    }
    else {
      this.isTimer = true;
      this.timer = Observable.timer(0, Number(6) * 10000);
      this.sub = this.timer.subscribe(N => this.getTimerData(N));
    }

  }
  getTimerData(time) {
    
    var obj: any;
    obj = {}
    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');

    this._trackingService.getEnergyView(obj).subscribe(result => {
      
      this.liveEnergyData = result;
      var SessionUoM: any = {};


      SessionUoM = JSON.parse(sessionStorage.getItem('Sensor_UoM'));
      var snrUoM = SessionUoM.filter(g => g.uomId == this.liveEnergyData[0].uom);
      this.UoM = snrUoM[0].symbol;
    })
    
  }
  UoM:any;
  async downloadConsumptionData(reportType:any){
    this._loaderService.display(true);
    var csvData: any = []
    var interval = this.periodRange.find(item => item.pId === this.period).pVal;
    this.getEnergyData.lstenergy.forEach(element =>{
      csvData.push(
        {
          deviceId: this.deviceId,
          ['Interval' + '('+ interval +')']: element.intervalPeriod,
          EnergyConsumption: element.consumption

          //[element.sensorName + ' ' + element.uom]: element.sensorValue
        }
      )
    });
    if(reportType == "pdf"){
      var pdfobj: any
      
        pdfobj = {};

        pdfobj.clientLogo = sessionStorage.getItem('logoImage');
        // pdfobj.reportName = this.deviceId
        pdfobj.fromDate = this.fromDate;
        pdfobj.toDate = this.toDate;
        pdfobj.deviceName = this.deviceName;
        pdfobj.deviceId = this.deviceId;
        pdfobj.avgConsumption = this.avgconsumptionData[0]
        pdfobj.UoM = this.UoM;
        pdfobj.deviceDetails = this.sensordetails
        pdfobj.pollingFrequency = this.sensordetails.pollingFrequency
        pdfobj.siteName = this.sensordetails.regionName
        pdfobj.parameter = this.sensordetails.parameter
        

        //pdfobj.columns = 'Date/Time (IST),' + this.trendResponse.trend[0].sensorName + ' ( ' + this.sensorUoM + ' )';
        pdfobj.lstenergy = this.getEnergyData.lstenergy;
        pdfobj.interval =  interval;
    var resp: any = []
    resp = await this.getDataReport(pdfobj);
    if (resp.msg.toLowerCase().includes('object reference not set')) {
      this._toaster.warning("Server is busy please Re-Login");
    }
    else {
      if (resp && resp.sts == "200") {
        // window.location.href = resp.msg;
        window.open(resp.msg, '_bank');
      }
      else {
        this._toaster.warning(resp.msg);
      }
    }
    }
    else
          if (reportType == "csv") {
            var _fileName = this.deviceName + "|" + "Energy Consumption" ;

            //test
            const options = {
              filename: _fileName,
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalSeparator: '.',
              showLabels: true,
              showTitle: false,
              useTextFile: false,
              useBom: true,
              useKeysAsHeaders: true

            };

            const csvExporter = new ExportToCsv(options);

            csvExporter.generateCsv(csvData);

            this._loaderService.display(false);

          }
    
    this._loaderService.display(false);
  }
  TrendName: any = "";
  async getDataReport(pdfobj) {
    return new Promise(async (resolve, reject) => {
      await this._trackingService.getEnergyConsumptionPDF(pdfobj).subscribe(result => {
        ;
        resolve(result);
      }, error => {
        ;
        resolve({})
      });
      ;
    })
  }
  fromDate: any;
  fromDateLst: any;
  toDate: any;
  moveleft(){
    
    var currentDate = new Date(this.hourlyDate);
    
    if(new Date(this.hourlyDate) > new Date(this.minDate)){
      
      this.showright = true;
      // Convert the input date string to a JavaScript Date object
      const dateObj = new Date(this.hourlyDate);

      // Subtract one day in milliseconds from the date
      dateObj.setDate(dateObj.getDate() - 1);

      // Format the resulting date as 'yyyy-MM-dd'
      const formattedDate = dateObj.toISOString().split('T')[0];

      console.log(formattedDate); // Output: '2023-09-29'

      this.hourlyDate = formattedDate//this.formatDate(oneDayBeforeDate)
      this.GetConsumptionData();
    }
    else{
      
      this.showleft = false;
       }
    //this.hourlyDate = this.formatDate(new Date(new Date().setDate( new Date(this.hourlyDate).getDate() - 1)))
    
  }
  showleft:boolean = true;
  showright:boolean = true;
  moveright(){
    
    var currentDate = new Date();
    if(new Date(this.hourlyDate) < new Date(currentDate.toISOString().slice(0, 10))){
      
      this.showleft = true;
      // Convert the input date string to a JavaScript Date object
      const dateObj = new Date(this.hourlyDate);

      // Subtract one day in milliseconds from the date
      dateObj.setDate(dateObj.getDate() + 1);

      // Format the resulting date as 'yyyy-MM-dd'
      const formattedDate = dateObj.toISOString().split('T')[0];

      console.log(formattedDate); // Output: '2023-09-29'

      this.hourlyDate = formattedDate//this.formatDate(oneDayBeforeDate)
      //this.hourlyDate = this.formatDate(new Date(new Date().setDate( new Date(this.hourlyDate).getDate() + 1)))
      this.GetConsumptionData();
    }
    else
    {
      this.showright = false;
    }
  }
  sensordetails:any;
  showTrend(sensordetails:any) {
    
    this.modalTrend.show();
    this.sensordetails = sensordetails;
    this.deviceId = this.sensordetails.sensorId;
    this.deviceName = this.sensordetails.sensorName;
    this.TrendName = this.deviceName + " : " + "Energy Consumption";
    this.isDates = false;
    this.refreshData();
    var currentDate = new Date();
    this.hourlyDate = this.formatDate(currentDate);
    this.fromDate = this.formatDate(new Date(new Date().setDate(new Date().getDate() - 1)));// new Date(new Date().setHours(0, 0, 0, 0));
    this.toDate = this.formatDate(currentDate)//currentDate;
    
    this.period = this.periodRange[0].pId
    if(this.period == 1){
      this.xTitle = "Hour";
    }
    else if(this.period == 2){
      this.xTitle = "Day";
    }
    else {
      this.xTitle = "Month"
    }
    //this._loaderService.display(true);

    this.getData()
  }
  dateToDDMMYY(date){
    var d = new Date(date)
    return d.getDate().toString().padStart(2, '0') + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getFullYear()
  }
  showHourly:any = false;
  showMonthly:any = false;
  showDaily:any = false;
  refreshData(){
    this.fromDateLst = "";
    this.fromDate = "";
    this.toDate = "";
    this.showHourly = true; 
    this.showDaily = false;
    this.showMonthly = false;
    this.endMonth = "";
    this.startMonth = "";
    this.hourlyDate = "";
  }
  checkInterval(event: any) {
    this.period = event.pId;
    var currentDate = new  Date();
    this.refreshData();
    if(this.period == 1){
      this.showHourly = true;
      this.showDaily = false;
      this.showMonthly = false;
      this.hourlyDate = this.formatDate(currentDate);
      this.GetConsumptionData();
    }
    else if(this.period == 2){
      this.showDaily = true;
      this.showMonthly = false;
      this.showHourly = false;
      
      this.fromDate = this.formatDate(new Date(new Date().setDate(new Date().getDate() - 10)));// new Date(new Date().setHours(0, 0, 0, 0));
      this.toDate = this.formatDate(currentDate)//currentDate;
      this.fromDateLst = [this.fromDate,this.toDate];
      this.GetConsumptionData();
    }
    else if(this.period == 3){
      this.showMonthly = true;
      this.showHourly = false;
      this.showDaily = false;
    }
    
  }

  GetConsumptionData(){
    
    var validate: boolean;
    validate = this.validate();
    if(validate){
      if(this.period == 1){
        
        this.xTitle = "Hour";
        this.toDate = this.formatDate(new Date(this.hourlyDate));
        const previousDate = new Date(this.hourlyDate);
        previousDate.setDate(previousDate.getDate() - 1);
        this.fromDate = this.formatDate(new Date(previousDate));
      }
      else if(this.period == 2){
        this.xTitle = "Day";
        this.fromDate = this.formatDate(new Date(this.fromDateLst[0]));
        this.toDate = this.formatDate(new Date(this.fromDateLst[1]));
        if(this.fromDate == this.toDate){
          this._toaster.warning("please Select Different Dates");
          return false;
        }
      }
      else {
        this.xTitle = "Month"
        this.fromDate =  this.formatDate(new Date(this.startMonth));
        
        this.toDate =  this.formatDate(new Date(this.endMonth));
      }
      this.getData();
    }
    
  }
  validate(){
    
    if (this.period == "" || this.period == undefined || this.period == null) {
      this._toaster.warning("please Select Interval");
      return false;
    }
    if (this.period == 1 && (this.hourlyDate == "" || this.hourlyDate == null || this.hourlyDate == undefined)) {
      this._toaster.warning('please Select Date Range');
      return false;
    }
    if (this.period == 2 && (this.fromDateLst == "" || this.fromDateLst == null || this.fromDateLst == undefined)) {
      this._toaster.warning('please Select Date Range');
      return false;
    }
    // if (this.period == 3 && (this.endMonth == "" || this.endMonth == null || this.endMonth == undefined || this.startMonth == "" || this.startMonth == null || this.startMonth == undefined)) {
    //   this._toaster.warning('please Select Date Range');
    //   return false;
    // }
    if(this.period == 3){
      if(this.endMonth == "" || this.endMonth == null || this.endMonth == undefined || this.startMonth == "" || this.startMonth == null || this.startMonth == undefined){
        this._toaster.warning('please Select Date Range');
        return false;
      }
      if(new Date(this.startMonth) >  new Date(this.endMonth)){
        this._toaster.warning('The end month and year must be greater than the start month and year');
        return false;
      }
    }
    return true
  }
  formatDate(date: Date): string {
    
    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (months are 0-based) and pad with leading zero if necessary
    const year = date.getFullYear().toString(); // Get year
  
    return `${year}-${month}-${day}`;
  }
  formatDateforMonth(date: Date): string {
    
    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (months are 0-based) and pad with leading zero if necessary
    const year = date.getFullYear().toString(); // Get year
  
    return `${year}-${month}`;
  }
  options : any
  endMonth:any;
  startMonth:any;
  hourlyDate:any;
  getData(){
    
    var obj :any = {};
    obj.toDate = this.toDate
    obj.fromDate = this.fromDate;
    obj.DeviceId = this.deviceId
    obj.interval = this.period
    obj.timeZone = sessionStorage.getItem('USER_TIMEZONE');
    //this._loaderService.display(true);
    this._trackingService.getEnergyConsumptionDetails(obj).subscribe(result => {
      
      this.getEnergyData = result;
      this.consumptionData = [];
      this.consumptionPeriod = [];
      this.avgconsumptionData = [];
      if(this.getEnergyData.lstenergy){
        this.getEnergyData.lstenergy.forEach(p => {
          this.consumptionData.push(p.consumption)
          this.consumptionPeriod.push(p.intervalPeriod)
          this.avgconsumptionData.push(this.getEnergyData.avgConsumption)
        });
        this.getTrend();
      }
      else{
        //this._loaderService.display(false);
      }
      // console.log(this.consumptionData);
      // console.log(this.consumptionPeriod);
      
    })
    
  }
  
  getTrend() {
    
    var options2 = {
      series: [{
        name: 'Actual Consumption',
        type: 'column',
        data: this.consumptionData
      }, {
        name: 'Average Consumption',
        type: 'line',
        data: this.avgconsumptionData
      }],
      chart: {
        height: 330,
        type: 'line',
        stacked:false,
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: true,
            reset: true
          },
        }
      },
       colors: ['#0b6dde', '#2e2f30'],
      stroke: {
        width: [0, 1]
      },
      title: {
        text: undefined
      },
      dataLabels: {
        enabled: false,
        formatter: function (val) {
          return val;
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      labels: this.consumptionPeriod,
      xaxis: {
        type: 'category'
      },
      yaxis: [{
        title: {
          text: 'Ac tual Consumption',
        }
      }]
    };
    var options1 = {
      series: [{
        name: 'Consumption',
        data: this.consumptionData.slice(0, 25)
      }],
      chart: {
        height: 330,
        type: 'bar',
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: false,
            zoomout: false,
            pan: true,
            reset: true
          },
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
          columnWidth: '50%',
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val;
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: this.consumptionPeriod.slice(0, 25), //["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        },
        title: {
          text: this.xTitle,
          rotate: -90,
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-xaxis-title',
          },
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: true,
          formatter: function (val) {
            return val;
          }
        },
        title: {
          text: "Energy Consumption",
          rotate: 90,
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-yaxis-title',
          },
        }

      },
      title: {
        text: undefined,
        floating: true,
        position: 'top',
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444'
        }
      }
    };
    var option 
    if(this.period == 1){
      option = options1
    }
    else {
      option = options2
    }
    // var name = '#trendChart' 
    // document.querySelector(name).innerHTML = "";
    var chart = new apexChart(document.querySelector("#trendChart"), options2);
    chart.render();
    // chart.updateSeries([{
    //   name: 'Consumption',
    //   data: this.consumptionData.slice(0,25)
    // }]);
    window.dispatchEvent(new Event('resize'))
    
    //this._loaderService.display(false);
  }
  changeView(path: any) {
    sessionStorage.setItem("USER_PREF", "");


    if (path == "live") {
      if (sessionStorage.getItem('Client_ListView') == "1") {
        this.router.navigateByUrl('/pages/tracking/LiveView')
      }
      else
        if (sessionStorage.getItem('Client_ListView') == "0") {
          this.router.navigateByUrl('/pages/tracking/ListView')
        }

      //this.router.navigateByUrl('/pages/tracking/LiveView')
    } else if (path == "chart") {


      this.router.navigateByUrl('/pages/tracking/SensorView')

    } else
      if (path == "pin") {

        this.router.navigateByUrl('/pages/tracking/AnalyticsView')
      } else
        if (path == "temp") {

          this.router.navigateByUrl('/pages/tracking/TempView')
        }
        else if (path == "image") {
          this.router.navigateByUrl('/pages/reports/images')
        }
        else
        if (path == "map") {

          this.router.navigateByUrl('/pages/tracking/Map')
        }
        else if(path == "energy"){
          this.router.navigateByUrl('/pages/tracking/EnergyView')
        }
  }

}
