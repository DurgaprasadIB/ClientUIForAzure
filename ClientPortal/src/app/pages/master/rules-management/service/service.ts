import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IdeaBService } from 'src/app/pages/GlobalServices/ideab.service';

@Injectable({
    providedIn: 'root'
})
export class RulesManagementService {

    constructor(private http: HttpClient,
        private comman: IdeaBService) {
    }

    InsertRule(jsondata) {
        debugger
        const HTTPOPTIONS_ASSET = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.comman.ReAssetToken
            })

        };
        jsondata.createdBy = this.comman.getLoginUserID();
        jsondata.clientID = this.comman.getClientID();
        return this.http.post(this.comman.BASE_URL_ASSET + 'Rule/create', jsondata, HTTPOPTIONS_ASSET)
    }



    getRules(obj: any) {
        const HTTPOPTIONS = {
            headers: new HttpHeaders({
                'Contenet-Type': 'application.json',
                'Authorization': "Bearer " + this.comman.ReAssetToken
            })
        };

        var jsonData = {
            'loginId': obj.loginId,
            'ruleId': obj.ruleId
        }

        return this.http.post(this.comman.BASE_URL_ASSET + 'Rule/Details', jsonData, HTTPOPTIONS)
    }

    getDefaultRules(obj: any) {
        const HTTPOPTIONS = {
            headers: new HttpHeaders({
                'Contenet-Type': 'application.json',
                'Authorization': "Bearer " + this.comman.ReAssetToken
            })
        };

        var jsonData = {
            'deviceId': obj.deviceId
        }

        return this.http.post(this.comman.BASE_URL_ASSET + 'Sensor/getDeviceDefaultRange', jsonData, HTTPOPTIONS)
    }

    createRuleFromDefaultRules(obj: any) {
        const HTTPOPTIONS = {
            headers: new HttpHeaders({
                'Contenet-Type': 'application.json',
                'Authorization': "Bearer " + this.comman.ReAssetToken
            })
        };

        debugger
        obj.createdBy = this.comman.getLoginUserID();

        var JSONobj: any = []

        JSONobj.push(obj)

        return this.http.post(this.comman.BASE_URL_ASSET + 'Rule/CreateFromDefaultRule', JSONobj, HTTPOPTIONS)
    }


    deleteRule(ruleId: string) {
        const HTTPOPTIONS = {
            headers: new HttpHeaders({
                'Contenet-Type': 'application.json',
                'Authorization': "Bearer " + this.comman.ReAssetToken
            })
        };

        var jsonData = {
            'ruleId': ruleId
        }

        return this.http.post(this.comman.BASE_URL_ASSET + 'Rule/Remove', jsonData, HTTPOPTIONS)
    }

    getDataFormat(DeviceName: any) {
        const HTTPOPTIONS = {
            headers: new HttpHeaders({
                'Contenet-Type': 'application.json',
                'Authorization': "Bearer " + this.comman.ReAssetToken
            })
        };

        var jsonData = {
            "deviceName": DeviceName
        }

        return this.http.post(this.comman.BASE_URL_ASSET + 'Rule/GetDataFromat', jsonData, HTTPOPTIONS)
    }

}