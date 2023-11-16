import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IdeaBService } from 'src/app/pages/GlobalServices/ideab.service';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/pages/setup/Service/client.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})

export class ChangepasswordComponent implements OnInit {

  obj = new ChangeDefaultPassword
  ResponseList: any = [];
  siteAdmin_id: string;
  @ViewChild('Modalopenbtn') ModalopenChangePswd: ElementRef;
  @ViewChild('modalChangePswd') ModalChangePswd: any;

  constructor(private toastr: ToastrService, private cmnService: IdeaBService,
    private clientService: ClientService,
    private router: Router) { }


  ngOnInit() {
    this.ModalopenChangePswd.nativeElement.click();
  }

  savePwd(obj) {
    if (obj.password == "" || obj.password === undefined ||
      obj.confirmPassword == "" || obj.confirmPassword === undefined) {
      this.toastr.warning(this.cmnService.MANDATORYMESSAGE);
      return false;
    } else {
      if (obj.password == "" || obj.password === undefined) {
        this.toastr.warning("Please Enter Password");
        return false;
      } if (obj.password && !String(obj.password).match(this.cmnService.STRONGPSWD_REGX)) {
        this.toastr.warning("Please Enter Valid Password");
        return false;
      }
      if (obj.confirmPassword == "" || obj.confirmPassword === undefined) {
        this.toastr.warning("Please Re-Enter Password");
        return false;
      }
      if (obj.password != obj.confirmPassword) {
        this.toastr.warning("Password is mismatch");
        return false;
      }

      this.clientService.ChangeDefaultPassword(obj.password).subscribe(result => {
        this.ResponseList = result;
        if (this.ResponseList.HTTPStatus == "200") {
          //sessionStorage.setItem('DEFAULTPASSWORD', this.ResponseList.Message)
         // window.location.assign('pages')
           var parameter=sessionStorage.getItem('DEFAULT_PAGE');
              let  parameters= parameter.split("/")
           //window.location.assign('/pages/'+parameters[0]+'/'+ parameters[1]);
           return  this.router.navigate(['pages', parameters[0], parameters[1]]);
        // return this.router.navigateByUrl('pages');
        } else {
          this.toastr.warning(this.cmnService.ERRORMESSAGE);
        }
      });
    }
  }


  onCloseModal(){
    debugger
    this.ModalChangePswd.show();
  }

}

export class ChangeDefaultPassword {
  public userID: string;
  public password: string;
  public confirmPassword: string;
  public clientID: string;
}

