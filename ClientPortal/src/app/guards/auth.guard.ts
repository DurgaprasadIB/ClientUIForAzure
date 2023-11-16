import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take';
import { filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService,private _router:Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn.take(1).map((isLoggedIn:boolean)=>{
      debugger
      if(!isLoggedIn){
       // this._router.navigateByUrl('jio-login');
       this._router.navigateByUrl('IoT');
        return false;
      }
      else{
        const navigationEnd$ = this._router.events.pipe(
          filter((event) => event instanceof NavigationEnd)
        );
        navigationEnd$.subscribe((event: NavigationEnd) => {
          const currentUrl = event.url;
          const isUserLoggedIn = this.authService.isUserLoggedInBasedOnUrl(currentUrl);
          debugger
          if (!isUserLoggedIn) {
            this._router.navigateByUrl('IoT');
            return false;
          }
        });
      }
      return true;
    });
  }
}
