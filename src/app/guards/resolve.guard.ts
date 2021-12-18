import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResolveGuard implements Resolve<any> {
  constructor(private http: HttpClient){}
  resolve(){
    this.http.get<any>('http://localhost:3000/mytasks').subscribe(
      data => {
        console.log(data);
        return data;
      }
    )
  }
  
}
