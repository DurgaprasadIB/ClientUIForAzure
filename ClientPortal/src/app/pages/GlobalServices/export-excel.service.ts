import { Injectable } from '@angular/core';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as ExcelProper from "exceljs";
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
const datePipe = new DatePipe('en-US');


@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  name: string;
  sName: string;
  fileName: string;
  excelfileName: string;
  footer: string = "@2022"
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  // cols = ["Column1", "Column2", "Column3", "Column4", "Column5"]
  // data = [
  //   {
  //     col1: "987877784012456,987877784012456",
  //     col2: "28/01/2019 6:00 AM",
  //     col3: "a1",
  //     col4: "b2",
  //     col5: "a1",
  //   },
  //   {
  //     col1: "a1",
  //     col2: "b2",
  //     col3: "a1",
  //     col4: "b2",
  //     col5: "a1",
  //   },
  //   {
  //     col1: "a1",
  //     col2: "b2",
  //     col3: "a1",
  //     col4: "b2",
  //     col5: "a1",
  //   },
  //   {
  //     col1: "a1",
  //     col2: "b2",
  //     col3: "a1",
  //     col4: "b2",
  //     col5: "a1",
  //   },
  //   {
  //     col1: "a1",
  //     col2: "b2",
  //     col3: "a1",
  //     col4: "b2",
  //     col5: "a1",
  //   },
  // ];
  colArray = [];
  constructor(
    private translate: TranslateService
  ) {
    //this.sName = "JioCompass";
    // this.excelfileName = "report.xlsx"

  }
  applyRowStyle(sheet) {
    sheet.eachRow(function (row, rowNumber) {
      if (rowNumber > 3) {
        row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
          sheet.getCell(cell.address.toString()).alignment = { warpText: true, vertical: 'middle', horizontal: 'middle' }
          sheet.getCell(cell.address.toString()).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          }
          sheet.getCell(cell.address.toString()).font = {
            name: 'Tahoma',
            family: 2,
            size: 0
          }
        });
      }
    });
    return sheet;
  }


  exportExcelFile(fileName: string, headerText: any, columnKeys: any, columnHeaders: any, jsonDataObj: any, FromDate: any, ToDate: any) {
    debugger
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    // if (dd < 10) {
    //   dd = '0' + dd;
    // }
    // if (mm < 10) {
    //   mm = '0' + mm;
    // }
    var newtoday = dd + '/' + mm + '/' + yyyy;

    this.excelfileName = fileName + newtoday;
    this.sName = fileName;
    var workbook = new Excel.Workbook();
    workbook.creator = "SensorConnect";
    workbook.lastModifiedBy = "SensorConnect";
    workbook.created = new Date();
    workbook.modified = new Date();
    // activeCell: 'A1',
    workbook.addWorksheet(this.sName, { views: [{ showGridLines: false }] })
    var sheet = workbook.getWorksheet(1);
    var data1 = headerText;//["Export data"]
    sheet.addRow(data1);
    var reportDate = ['Report Time :' + datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm:ss a')]
    sheet.addRow(reportDate);
    var dateRange = ['From Date :' + FromDate + '(IST)             To Date :' + ToDate + '(IST)']
    sheet.addRow(dateRange);
    sheet.getRow(4).values = columnHeaders;
    sheet.columns = columnKeys; //[{ key: 'col1' ,width:40},{ key: 'col2',width:25 },{ key: 'col3' },{ key: 'col4' },{ key: 'col5' }];
    this.colArray = this.colArrayFunction(columnHeaders);// ['A3', 'B3', 'C3', 'D3', 'E3']
    sheet.addRows(jsonDataObj);
    sheet = this.applyRowStyle(sheet);

    //Row 1
    sheet.getCell('A1', 'B1', 'C1').font = {
      name: 'Tahoma',
      family: 2,
      size: 18,
      bold: true,
      color: { argb: '1E90FF' }
    }

    sheet.getCell('A1', 'B1', 'C1').alignment = {
      indent: 20
    }
    //Row 2
    sheet.getCell('A2', 'B2', 'C2').font = {
      name: 'Tahoma',
      family: 2,
      size: 9,
      bold: true,
      color: { argb: '1E90FF' },
    }
    sheet.getCell('A2', 'B2', 'C2').alignment = {
      indent: 35
    }
    //Row 3
    sheet.getCell('A3', 'B3', 'C3').font = {
      name: 'Tahoma',
      family: 2,
      size: 9,
      bold: true,
      color: { argb: '1E90FF' },
    }
    sheet.getCell('A3', 'B3', 'C3').alignment = {
      indent: 5
    }

    sheet.getCell('A4').border = {
      top: { style: 'double', color: { argb: '1E90FF' } },
      left: { style: 'double', color: { argb: '1E90FF' } },
      bottom: { style: 'double', color: { argb: '1E90FF' } },
      right: { style: 'double', color: { argb: '1E90FF' } }
    };

    this.colArray.map(key => {
      // sheet.getCell(key).fill={
      //   type:'gradient',
      //   gradient:'angle',
      //   degree:0,
      //   stops:[
      //     {position:0, color:{argb:'#454545'}},
      //     {position:0.5, color:{argb:'#454545'}},
      //     {position:1, color:{argb:'#454545'}},
      //   ]
      // }
      sheet.getCell(key).alignment = { warpText: true, vertical: 'middle', horizontal: 'middle' }
      sheet.getCell(key).border = { right: { style: 'thin' }, top: { style: 'thin' } }
      sheet.getCell(key).font = {
        name: 'Tahoma',
        family: 2,
        size: 8,
        bold: true
      }
    });
    //sheet.addRow([this.footer])
    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: this.blobType });
      FileSaver.saveAs(blob, this.excelfileName + '.xlsx', true);
    });
  }

  exportExcelFileMultiTrend(fileName: string, headerText: any, columnKeys: any, columnHeaders: any, jsonDataObj: any, FromDate: any, ToDate: any) {
    debugger
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    // if (dd < 10) {
    //   dd = '0' + dd;
    // }
    // if (mm < 10) {
    //   mm = '0' + mm;
    // }
    var newtoday = dd + '/' + mm + '/' + yyyy;

    this.excelfileName = fileName + '_' + newtoday;
    this.sName = fileName;
    var workbook = new Excel.Workbook();
    workbook.creator = "SensorConnect";
    workbook.lastModifiedBy = "SensorConnect";
    workbook.created = new Date();
    workbook.modified = new Date();
    // activeCell: 'A1',
    workbook.addWorksheet(this.sName, { views: [{ showGridLines: false }] })
    var sheet = workbook.getWorksheet(1);
    var data1 = headerText;//["Export data"]
    sheet.addRow(data1);
    var reportDate = ['Report Time :' + datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm:ss a')]
    sheet.addRow(reportDate);
    var dateRange = ['From Date :' + FromDate + '(IST)                                                                                     To Date :' + ToDate + '(IST)']
    sheet.addRow(dateRange);
    sheet.getRow(4).values = columnHeaders;
    sheet.columns = columnKeys; //[{ key: 'col1' ,width:40},{ key: 'col2',width:25 },{ key: 'col3' },{ key: 'col4' },{ key: 'col5' }];
    this.colArray = this.colArrayFunction(columnHeaders);// ['A3', 'B3', 'C3', 'D3', 'E3']
    sheet.addRows(jsonDataObj);
    sheet = this.applyRowStyle(sheet);

    //Row 1
    sheet.getCell('A1', 'B1', 'C1').font = {
      name: 'Tahoma',
      family: 2,
      size: 18,
      bold: true,
      color: { argb: '1E90FF' }
    }

    sheet.getCell('A1', 'B1', 'C1').alignment = {
      indent: 40
    }
    //Row 2
    sheet.getCell('A2', 'B2', 'C2').font = {
      name: 'Tahoma',
      family: 2,
      size: 9,
      bold: true,
      color: { argb: '1E90FF' },
    }

    sheet.getCell('A2', 'B2', 'C2').alignment = {
      indent: 60
    }
    // //Row 2
    // sheet.getCell('C2').font = {
    //   name: 'Tahoma',
    //   family: 2,
    //   size: 9,
    //   bold: true,
    //   color: { argb: '1E90FF' },
    // }

    // sheet.getCell('C2').alignment = {
    //   indent: 5
    // }
    //Row 3
    sheet.getCell('A3', 'B3', 'C3').font = {
      name: 'Tahoma',
      family: 2,
      size: 9,
      bold: true,
      color: { argb: '1E90FF' },
    }
    sheet.getCell('A3', 'B3', 'C3').alignment = {
      indent: 1
    }

    sheet.getCell('A4').border = {
      top: { style: 'double', color: { argb: '1E90FF' } },
      left: { style: 'double', color: { argb: '1E90FF' } },
      bottom: { style: 'double', color: { argb: '1E90FF' } },
      right: { style: 'double', color: { argb: '1E90FF' } }
    };

    this.colArray.map(key => {
      // sheet.getCell(key).fill={
      //   type:'gradient',
      //   gradient:'angle',
      //   degree:0,
      //   stops:[
      //     {position:0, color:{argb:'#454545'}},
      //     {position:0.5, color:{argb:'#454545'}},
      //     {position:1, color:{argb:'#454545'}},
      //   ]
      // }
      sheet.getCell(key).alignment = { warpText: true, vertical: 'middle', horizontal: 'middle' }
      sheet.getCell(key).border = { right: { style: 'thin' }, top: { style: 'thin' } }
      sheet.getCell(key).font = {
        name: 'Tahoma',
        family: 2,
        size: 8,
        bold: true
      }
    });
    //sheet.addRow([this.footer])
    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: this.blobType });
      FileSaver.saveAs(blob, this.excelfileName + '.xlsx', true);
    });
  }

  colArrayFunction(columnHeadersObj: any) {
    switch (columnHeadersObj.length - 1) {
      case 1: return this.colArray = ['A4', 'B4']
      case 2: return this.colArray = ['A4', 'B4', 'C4']
      case 3: return this.colArray = ['A4', 'B4', 'C4', 'D4']
      case 4: return this.colArray = ['A4', 'B4', 'C4', 'D4', 'E4']
      case 5: return this.colArray = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4']
      case 6: return this.colArray = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4']
      case 7: return this.colArray = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4']
      case 8: return this.colArray = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4']
      case 9: return this.colArray = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4', 'J4']
      case 10: return this.colArray = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4', 'J4', 'K4']
      case 11: return this.colArray = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4', 'J4', 'K4', 'L4']
      case 12: return this.colArray = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4', 'J4', 'K4', 'L4', 'M4']
      case 13: return this.colArray = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4', 'J4', 'K4', 'L4', 'M4', 'N4']
      case 14: return this.colArray = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4', 'J4', 'K4', 'L4', 'M4', 'N4', 'O4']
      case 15: return this.colArray = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4', 'J4', 'K4', 'L4', 'M4', 'N4', 'O4', 'P4']
    }
  }



  // formatExcelFile(fileName: string,  columnKeys: any, columnHeaders: any) {

  //   var today = new Date();
  //   var dd = today.getDate();
  //   var mm = today.getMonth() + 1; //January is 0!

  //   var yyyy = today.getFullYear();
  //   // if (dd < 10) {
  //   //   dd = '0' + dd;
  //   // }
  //   // if (mm < 10) {
  //   //   mm = '0' + mm;
  //   // }
  //   var newtoday = dd + '/' + mm + '/' + yyyy;

  //   this.excelfileName = fileName + newtoday;
  //   this.sName = fileName;
  //   var workbook = new Excel.Workbook();
  //   workbook.creator = "JioCompass";
  //   workbook.lastModifiedBy = "JioCompass";
  //   workbook.created = new Date();
  //   workbook.modified = new Date();
  //   workbook.addWorksheet(this.sName, { views: [{ state: 'frozen', xSplit: 1, activeCell: 'A1', showGridLines: false }] })
  //   var sheet = workbook.getWorksheet(1);
  //   sheet.getRow(1).values = columnHeaders;
  //   sheet.columns = columnKeys; 

  //   workbook.xlsx.writeBuffer().then(data => {
  //     const blob = new Blob([data], { type: this.blobType });
  //     FileSaver.saveAs(blob, this.excelfileName + '.xlsx', true);
  //   });
  // }


}
