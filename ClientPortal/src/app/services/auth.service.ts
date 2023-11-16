import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  urlIncludes: Boolean = false;
  NonclientFeatures :any;
  private currentUrl: string = '';
  constructor(private router: Router) {
    // this.router.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe((event: NavigationEnd) => {
    //     debugger
    //     this.currentUrl = event.url;
    //     //this.isLoggedIn = this.isUserLoggedInBasedOnUrl(this.currentUrl);
    //   });
  }
  get isLoggedIn() {
    debugger
    if (sessionStorage.length > 0) {
      if (sessionStorage.getItem('IS_AUTH') != null && sessionStorage.getItem('IS_AUTH') != undefined) {

        let IS_AUTH = sessionStorage.getItem('IS_AUTH') == 'true' ? true : false;

        this.loggedIn.next(IS_AUTH);

      }
      else {
        this.loggedIn.next(false);
      }

    }
    else {
      this.loggedIn.next(false);
    }
    return this.loggedIn.asObservable();

  }
  count:any;
  isUserLoggedInBasedOnUrl(url: string): boolean {
    debugger
    this.NonclientFeatures = JSON.parse(sessionStorage.getItem('NonAccess_Feature'));
    if(this.NonclientFeatures.length != 0){
      this.count = this.NonclientFeatures.filter(item => item.endPoint === url).length;
    }
    
    // Implement your logic to check if the user is logged in based on the URL.
    if(this.count == 1){
        return false;
    }
    
    return true; // Example logic
  }
}
