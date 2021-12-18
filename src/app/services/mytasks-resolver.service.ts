import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MytasksResolverService implements Resolve<any>{
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }
  resolve(): Observable<any> {
    return this.getMyTasks().pipe(
      catchError((e) => {
        this.router.navigateByUrl('/errorpage');
        console.log(e);
        return EMPTY;
      }));
  }
  getMyTasks() {
    let data = this.http.get('http://localhost:3000/mytasks');
    // let data = this.http.get('https://635b-1-23-81-152.ngrok.io/mytasks');
    // console.log(data);
    return data;
  }
}

